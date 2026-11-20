import crypto from "node:crypto";
import net from "node:net";
import tls from "node:tls";

export type DbConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  appDatabase: string;
};

export function getDbConfig(): DbConfig {
  const urlStr = process.env.DATABASE_URL?.trim();
  const appDatabase = process.env.TIDB_DATABASE?.trim() || "epic_store";

  if (urlStr) {
    try {
      const parsed = new URL(urlStr);
      return {
        host:
          parsed.hostname ||
          "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
        port: Number(parsed.port || 4000),
        user: decodeURIComponent(parsed.username || "3qqHVDrzGLa8Yps.root"),
        password: decodeURIComponent(parsed.password || ""),
        database: parsed.pathname.replace(/^\//, "") || "sys",
        appDatabase,
      };
    } catch {
      /* fallback to individual env vars */
    }
  }

  return {
    host:
      process.env.TIDB_HOST?.trim() ||
      "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
    port: Number(process.env.TIDB_PORT || 4000),
    user: process.env.TIDB_USER?.trim() || "3qqHVDrzGLa8Yps.root",
    password: process.env.TIDB_PASSWORD?.trim() || "",
    database: "sys",
    appDatabase,
  };
}

// MySQL capability flags
const CLIENT_LONG_PASSWORD = 0x00000001;
const CLIENT_FOUND_ROWS = 0x00000002;
const CLIENT_LONG_FLAG = 0x00000004;
const CLIENT_CONNECT_WITH_DB = 0x00000008;
const CLIENT_PROTOCOL_41 = 0x00000200;
const CLIENT_SSL = 0x00000800;
const CLIENT_TRANSACTIONS = 0x00002000;
const CLIENT_SECURE_CONNECTION = 0x00008000;
const CLIENT_PLUGIN_AUTH = 0x00080000;

const CAPABILITIES =
  CLIENT_LONG_PASSWORD |
  CLIENT_FOUND_ROWS |
  CLIENT_LONG_FLAG |
  CLIENT_CONNECT_WITH_DB |
  CLIENT_PROTOCOL_41 |
  CLIENT_SSL |
  CLIENT_TRANSACTIONS |
  CLIENT_SECURE_CONNECTION |
  CLIENT_PLUGIN_AUTH;

function computeNativePasswordAuth(password: string, scramble: Buffer): Buffer {
  if (!password) return Buffer.alloc(0);
  const sha1 = (buf: Buffer | string) =>
    crypto.createHash("sha1").update(buf).digest();
  const stage1 = sha1(password);
  const stage2 = sha1(stage1);
  const stage3 = sha1(Buffer.concat([scramble, stage2]));
  const token = Buffer.alloc(stage1.length);
  for (let i = 0; i < stage1.length; i++) {
    token[i] = stage1[i] ^ stage3[i];
  }
  return token;
}

function computeCachingSha2PasswordAuth(
  password: string,
  scramble: Buffer
): Buffer {
  if (!password) return Buffer.alloc(0);
  const sha256 = (buf: Buffer | string) =>
    crypto.createHash("sha256").update(buf).digest();
  const stage1 = sha256(password);
  const stage2 = sha256(stage1);
  const stage3 = sha256(Buffer.concat([stage2, scramble]));
  const token = Buffer.alloc(stage1.length);
  for (let i = 0; i < stage1.length; i++) {
    token[i] = stage1[i] ^ stage3[i];
  }
  return token;
}

function wrapPacket(payload: Buffer, seqId: number): Buffer {
  const header = Buffer.alloc(4);
  header.writeUIntLE(payload.length, 0, 3);
  header[3] = seqId & 0xff;
  return Buffer.concat([header, payload]);
}

function readLengthEncodedInt(
  buf: Buffer,
  offset: number
): { value: number | null; nextOffset: number } {
  const first = buf[offset];
  if (first === 0xfb) return { value: null, nextOffset: offset + 1 };
  if (first < 0xfb) return { value: first, nextOffset: offset + 1 };
  if (first === 0xfc) {
    return { value: buf.readUInt16LE(offset + 1), nextOffset: offset + 3 };
  }
  if (first === 0xfd) {
    return { value: buf.readUIntLE(offset + 1, 3), nextOffset: offset + 4 };
  }
  const low = buf.readUInt32LE(offset + 1);
  const high = buf.readUInt32LE(offset + 5);
  return { value: high * 0x100000000 + low, nextOffset: offset + 9 };
}

function readLengthEncodedString(
  buf: Buffer,
  offset: number
): { value: string | null; nextOffset: number } {
  const lenInfo = readLengthEncodedInt(buf, offset);
  if (lenInfo.value === null) {
    return { value: null, nextOffset: lenInfo.nextOffset };
  }
  const start = lenInfo.nextOffset;
  const end = start + lenInfo.value;
  return {
    value: buf.subarray(start, end).toString("utf8"),
    nextOffset: end,
  };
}

export function sqlEscape(val: unknown): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return Number.isFinite(val) ? String(val) : "0";
  if (typeof val === "boolean") return val ? "1" : "0";
  const str = String(val)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\0/g, "\\0")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\x1a/g, "\\Z");
  return `'${str}'`;
}

export type QueryResult = {
  rows: Record<string, string | null>[];
  affectedRows: number;
  insertId: number;
};

/**
 * Executes one or more SQL statements sequentially against TiDB Cloud (MySQL v10 over TLS)
 * using only Node's built-in `node:net`, `node:tls`, and `node:crypto`.
 */
export async function executeTidbQueries(
  queries: string[]
): Promise<QueryResult[]> {
  const cfg = getDbConfig();
  if (!cfg.password) {
    throw new Error(
      "TiDB database password is not configured. Set DATABASE_URL or TIDB_PASSWORD."
    );
  }

  return new Promise<QueryResult[]>((resolve, reject) => {
    const rawSocket = net.connect({
      host: cfg.host,
      port: cfg.port,
    });
    rawSocket.setTimeout(15000);

    let activeStream: net.Socket | tls.TLSSocket = rawSocket;
    let recvBuf = Buffer.alloc(0);
    let settled = false;
    let stage: "handshake" | "auth" | "query" = "handshake";
    let queryIndex = 0;
    const results: QueryResult[] = [];

    // Per-query resultset state
    let expectedCols = 0;
    let colNames: string[] = [];
    let currentRows: Record<string, string | null>[] = [];
    let readingStage: "header" | "cols" | "rows" = "header";

    const finish = (err?: Error) => {
      if (settled) return;
      settled = true;
      try {
        activeStream.destroy();
      } catch {
        /* ignore */
      }
      if (err) reject(err);
      else resolve(results);
    };

    rawSocket.on("timeout", () =>
      finish(new Error("TiDB Cloud connection timed out"))
    );
    rawSocket.on("error", (err) => finish(err));

    const sendNextQuery = () => {
      if (queryIndex >= queries.length) {
        // Send COM_QUIT (0x01)
        activeStream.write(wrapPacket(Buffer.from([0x01]), 0));
        finish();
        return;
      }
      const sql = queries[queryIndex];
      expectedCols = 0;
      colNames = [];
      currentRows = [];
      readingStage = "header";
      const payload = Buffer.concat([
        Buffer.from([0x03]),
        Buffer.from(sql, "utf8"),
      ]);
      activeStream.write(wrapPacket(payload, 0));
    };

    const handlePacket = (payload: Buffer, seqId: number) => {
      if (stage === "handshake") {
        if (payload[0] === 0xff) {
          const errMsg = payload.subarray(9).toString("utf8");
          finish(new Error(`TiDB Handshake Error: ${errMsg}`));
          return;
        }

        // Parse MySQL Initial Handshake v10
        let pos = 1; // skip protocol version (10)
        while (pos < payload.length && payload[pos] !== 0) pos++;
        pos++; // skip null terminator of server version
        pos += 4; // skip connection id
        const scramble1 = payload.subarray(pos, pos + 8);
        pos += 8;
        pos += 1; // filler
        pos += 2; // cap flags lower
        pos += 1; // charset
        pos += 2; // status flags
        pos += 2; // cap flags upper
        const authDataLen = payload[pos];
        pos += 1;
        pos += 10; // reserved 10 bytes
        const part2Len = Math.max(12, (authDataLen || 21) - 8 - 1);
        const scramble2 = payload.subarray(pos, pos + 12);
        const scramble = Buffer.concat([scramble1, scramble2]);
        pos += part2Len;

        // 1. Send SSLRequest packet before upgrading to TLS
        const sslReq = Buffer.alloc(32);
        sslReq.writeUInt32LE(CAPABILITIES, 0);
        sslReq.writeUInt32LE(0x01000000, 4);
        sslReq[8] = 45; // utf8mb4_general_ci
        rawSocket.write(wrapPacket(sslReq, seqId + 1));

        // 2. Upgrade rawSocket to TLS (required by TiDB Cloud public endpoint)
        rawSocket.removeAllListeners("data");
        const tlsSocket = tls.connect(
          {
            socket: rawSocket,
            servername: cfg.host,
            minVersion: "TLSv1.2",
          },
          () => {
            // 3. Send HandshakeResponse41 over TLS
            const fixed = Buffer.alloc(32);
            fixed.writeUInt32LE(CAPABILITIES, 0);
            fixed.writeUInt32LE(0x01000000, 4);
            fixed[8] = 45; // utf8mb4

            const userBuf = Buffer.from(`${cfg.user}\0`, "utf8");
            const authToken = computeNativePasswordAuth(cfg.password, scramble);
            const authLenBuf = Buffer.from([authToken.length]);
            const dbBuf = Buffer.from(`${cfg.database}\0`, "utf8");
            const pluginBuf = Buffer.from("mysql_native_password\0", "utf8");

            const respPayload = Buffer.concat([
              fixed,
              userBuf,
              authLenBuf,
              authToken,
              dbBuf,
              pluginBuf,
            ]);

            stage = "auth";
            tlsSocket.write(wrapPacket(respPayload, seqId + 2));
          }
        );

        activeStream = tlsSocket;
        recvBuf = Buffer.alloc(0);
        tlsSocket.on("error", (err) => finish(err));
        tlsSocket.on("data", onData);
        return;
      }

      if (stage === "auth") {
        if (payload[0] === 0xff) {
          const code = payload.readUInt16LE(1);
          const msg = payload.subarray(9).toString("utf8");
          finish(new Error(`TiDB Auth Failed (${code}): ${msg}`));
          return;
        }
        if (payload[0] === 0x00) {
          stage = "query";
          sendNextQuery();
          return;
        }
        // 0xfe = AuthSwitchRequest from TiDB Serverless Gateway after routing to cluster
        if (payload[0] === 0xfe) {
          let p = 1;
          while (p < payload.length && payload[p] !== 0) p++;
          const pluginName = payload.subarray(1, p).toString("utf8");
          const newScramble = payload.subarray(p + 1, p + 1 + 20);
          const switchToken =
            pluginName === "caching_sha2_password"
              ? computeCachingSha2PasswordAuth(cfg.password, newScramble)
              : computeNativePasswordAuth(cfg.password, newScramble);
          activeStream.write(wrapPacket(switchToken, seqId + 1));
          return;
        }
        // 0x01 = AuthMoreData (e.g. caching_sha2_password fast-auth success 0x03 or full-auth request 0x04 over TLS)
        if (payload[0] === 0x01) {
          if (payload[1] === 0x03) {
            // Fast auth succeeded; next packet is OK_Packet (0x00)
            return;
          }
          if (payload[1] === 0x04) {
            // Perform full authentication over TLS by sending null-terminated password
            activeStream.write(
              wrapPacket(Buffer.from(`${cfg.password}\0`, "utf8"), seqId + 1)
            );
            return;
          }
        }
        finish(
          new Error(`Unexpected TiDB auth response packet: 0x${payload[0].toString(16)}`)
        );
        return;
      }

      if (stage === "query") {
        if (readingStage === "header") {
          if (payload[0] === 0xff) {
            const code = payload.readUInt16LE(1);
            const msg = payload.subarray(9).toString("utf8");
            finish(new Error(`TiDB SQL Error (${code}): ${msg}`));
            return;
          }
          if (payload[0] === 0x00) {
            // OK_Packet
            const affected = readLengthEncodedInt(payload, 1);
            const insertId = readLengthEncodedInt(payload, affected.nextOffset);
            results.push({
              rows: [],
              affectedRows: affected.value ?? 0,
              insertId: insertId.value ?? 0,
            });
            queryIndex++;
            sendNextQuery();
            return;
          }
          // ResultSet header: column count
          const colCount = readLengthEncodedInt(payload, 0);
          expectedCols = colCount.value ?? 0;
          readingStage = "cols";
          return;
        }

        if (readingStage === "cols") {
          // EOF packet (0xfe) after column definitions
          if (payload[0] === 0xfe && payload.length < 9) {
            readingStage = "rows";
            return;
          }
          // ColumnDefinition41 packet: catalog, schema, table, org_table, name, org_name
          let offset = 0;
          for (let i = 0; i < 4; i++) {
            offset = readLengthEncodedString(payload, offset).nextOffset;
          }
          const nameInfo = readLengthEncodedString(payload, offset);
          colNames.push(nameInfo.value ?? `col_${colNames.length}`);
          if (colNames.length > expectedCols) {
            readingStage = "rows";
          }
          return;
        }

        if (readingStage === "rows") {
          if (payload[0] === 0xff) {
            const code = payload.readUInt16LE(1);
            const msg = payload.subarray(9).toString("utf8");
            finish(new Error(`TiDB Row Error (${code}): ${msg}`));
            return;
          }
          // EOF packet (0xfe) or OK packet at end of rows
          if (payload[0] === 0xfe && payload.length < 9) {
            results.push({
              rows: currentRows,
              affectedRows: 0,
              insertId: 0,
            });
            queryIndex++;
            sendNextQuery();
            return;
          }
          // Text Resultset Row
          let offset = 0;
          const row: Record<string, string | null> = {};
          for (let c = 0; c < expectedCols; c++) {
            const cell = readLengthEncodedString(payload, offset);
            row[colNames[c] ?? `col_${c}`] = cell.value;
            offset = cell.nextOffset;
          }
          currentRows.push(row);
        }
      }
    };

    const onData = (chunk: Buffer) => {
      recvBuf = Buffer.concat([recvBuf, chunk]);
      while (recvBuf.length >= 4) {
        const pktLen = recvBuf.readUIntLE(0, 3);
        const seqId = recvBuf[3];
        if (recvBuf.length < 4 + pktLen) break;
        const payload = recvBuf.subarray(4, 4 + pktLen);
        recvBuf = recvBuf.subarray(4 + pktLen);
        handlePacket(payload, seqId);
      }
    };

    rawSocket.on("data", onData);
  });
}

let schemaInitialized = false;

export function getSchemaSetupQueries(appDb: string): string[] {
  const safeDb = appDb.replace(/[^a-zA-Z0-9_]/g, "") || "epic_store";
  return [
    `CREATE DATABASE IF NOT EXISTS \`${safeDb}\``,
    `USE \`${safeDb}\``,
    `CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(64) NOT NULL UNIQUE,
      first_name VARCHAR(120) NOT NULL,
      last_name VARCHAR(120) NOT NULL,
      email VARCHAR(190) NOT NULL,
      phone VARCHAR(40) NOT NULL,
      address TEXT NOT NULL,
      landmark VARCHAR(255) DEFAULT '',
      city VARCHAR(120) NOT NULL,
      state VARCHAR(120) NOT NULL,
      pincode VARCHAR(20) NOT NULL,
      payment_method VARCHAR(60) NOT NULL,
      subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
      delivery DECIMAL(10,2) NOT NULL DEFAULT 0,
      total DECIMAL(10,2) NOT NULL DEFAULT 0,
      status VARCHAR(40) NOT NULL DEFAULT 'Processing',
      items_json TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS contact_enquiries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(160) NOT NULL,
      email VARCHAR(190) NOT NULL,
      phone VARCHAR(40) DEFAULT '',
      subject VARCHAR(190) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'New',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS custom_print_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(160) NOT NULL,
      email VARCHAR(190) NOT NULL,
      print_type VARCHAR(120) NOT NULL,
      dimensions VARCHAR(120) DEFAULT '',
      file_name VARCHAR(255) DEFAULT '',
      message TEXT,
      status VARCHAR(40) NOT NULL DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(190) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
  ];
}

export async function runInAppDatabase(
  statements: string[]
): Promise<QueryResult[]> {
  const cfg = getDbConfig();
  const safeDb = cfg.appDatabase.replace(/[^a-zA-Z0-9_]/g, "") || "epic_store";
  const prefix = schemaInitialized
    ? [`USE \`${safeDb}\``]
    : getSchemaSetupQueries(safeDb);
  const allResults = await executeTidbQueries([...prefix, ...statements]);
  schemaInitialized = true;
  return allResults.slice(prefix.length);
}

export async function saveOrderToDb(order: {
  orderId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
  subtotal: number;
  delivery: number;
  total: number;
  items: unknown[];
}): Promise<void> {
  const sql = `INSERT INTO orders (
    order_id, first_name, last_name, email, phone, address, landmark, city, state, pincode,
    payment_method, subtotal, delivery, total, items_json
  ) VALUES (
    ${sqlEscape(order.orderId)},
    ${sqlEscape(order.firstName)},
    ${sqlEscape(order.lastName)},
    ${sqlEscape(order.email)},
    ${sqlEscape(order.phone)},
    ${sqlEscape(order.address)},
    ${sqlEscape(order.landmark ?? "")},
    ${sqlEscape(order.city)},
    ${sqlEscape(order.state)},
    ${sqlEscape(order.pincode)},
    ${sqlEscape(order.paymentMethod)},
    ${sqlEscape(order.subtotal)},
    ${sqlEscape(order.delivery)},
    ${sqlEscape(order.total)},
    ${sqlEscape(JSON.stringify(order.items))}
  )`;
  await runInAppDatabase([sql]);
}

export async function saveContactEnquiryToDb(payload: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<void> {
  const sql = `INSERT INTO contact_enquiries (name, email, phone, subject, message) VALUES (
    ${sqlEscape(payload.name)},
    ${sqlEscape(payload.email)},
    ${sqlEscape(payload.phone ?? "")},
    ${sqlEscape(payload.subject)},
    ${sqlEscape(payload.message)}
  )`;
  await runInAppDatabase([sql]);
}

export async function saveCustomPrintToDb(payload: {
  name: string;
  email: string;
  printType: string;
  dimensions?: string;
  fileName?: string;
  message?: string;
}): Promise<void> {
  const sql = `INSERT INTO custom_print_requests (name, email, print_type, dimensions, file_name, message) VALUES (
    ${sqlEscape(payload.name)},
    ${sqlEscape(payload.email)},
    ${sqlEscape(payload.printType)},
    ${sqlEscape(payload.dimensions ?? "")},
    ${sqlEscape(payload.fileName ?? "")},
    ${sqlEscape(payload.message ?? "")}
  )`;
  await runInAppDatabase([sql]);
}

export async function saveNewsletterSubscriberToDb(email: string): Promise<void> {
  const sql = `INSERT IGNORE INTO newsletter_subscribers (email) VALUES (${sqlEscape(email)})`;
  await runInAppDatabase([sql]);
}

