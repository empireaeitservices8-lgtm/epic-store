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

        let pos = 1;
        while (pos < payload.length && payload[pos] !== 0) pos++;
        pos++;
        pos += 4;
        const scramble1 = payload.subarray(pos, pos + 8);
        pos += 8;
        pos += 1;
        pos += 2;
        pos += 1;
        pos += 2;
        pos += 2;
        const authDataLen = payload[pos];
        pos += 1;
        pos += 10;
        const part2Len = Math.max(12, (authDataLen || 21) - 8 - 1);
        const scramble2 = payload.subarray(pos, pos + 12);
        const scramble = Buffer.concat([scramble1, scramble2]);
        pos += part2Len;

        const sslReq = Buffer.alloc(32);
        sslReq.writeUInt32LE(CAPABILITIES, 0);
        sslReq.writeUInt32LE(0x01000000, 4);
        sslReq[8] = 45;
        rawSocket.write(wrapPacket(sslReq, seqId + 1));

        rawSocket.removeAllListeners("data");
        const tlsSocket = tls.connect(
          {
            socket: rawSocket,
            servername: cfg.host,
            minVersion: "TLSv1.2",
          },
          () => {
            const fixed = Buffer.alloc(32);
            fixed.writeUInt32LE(CAPABILITIES, 0);
            fixed.writeUInt32LE(0x01000000, 4);
            fixed[8] = 45;

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
        if (payload[0] === 0x01) {
          if (payload[1] === 0x03) {
            return;
          }
          if (payload[1] === 0x04) {
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
          const colCount = readLengthEncodedInt(payload, 0);
          expectedCols = colCount.value ?? 0;
          readingStage = "cols";
          return;
        }

        if (readingStage === "cols") {
          if (payload[0] === 0xfe && payload.length < 9) {
            readingStage = "rows";
            return;
          }
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
    `CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(190) NOT NULL,
      sku VARCHAR(64) NOT NULL UNIQUE,
      category VARCHAR(120) NOT NULL,
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      stock INT NOT NULL DEFAULT 0,
      status VARCHAR(40) NOT NULL DEFAULT 'Active',
      image TEXT NOT NULL,
      sales INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
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
    `CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(160) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      phone VARCHAR(40) NOT NULL,
      joined VARCHAR(60) NOT NULL,
      orders_count INT NOT NULL DEFAULT 1,
      spent DECIMAL(10,2) NOT NULL DEFAULT 0,
      status VARCHAR(40) NOT NULL DEFAULT 'Active',
      address TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      slug VARCHAR(120) NOT NULL UNIQUE,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS collections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(160) NOT NULL,
      slug VARCHAR(160) NOT NULL UNIQUE,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'Active',
      featured TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer VARCHAR(160) NOT NULL,
      email VARCHAR(190) NOT NULL,
      product VARCHAR(190) NOT NULL,
      rating INT NOT NULL DEFAULT 5,
      title VARCHAR(190) NOT NULL,
      comment TEXT NOT NULL,
      review_date VARCHAR(60) NOT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS enquiries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      reference VARCHAR(64) NOT NULL UNIQUE,
      customer VARCHAR(160) NOT NULL,
      email VARCHAR(190) NOT NULL,
      phone VARCHAR(40) NOT NULL,
      product VARCHAR(190) NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      enquiry_date VARCHAR(60) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'New',
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

let seedCompleted = false;

export async function ensureSeededDatabase(): Promise<void> {
  if (seedCompleted) return;

  const counts = await runInAppDatabase([
    "SELECT COUNT(*) AS c FROM products",
    "SELECT COUNT(*) AS c FROM orders",
    "SELECT COUNT(*) AS c FROM customers",
    "SELECT COUNT(*) AS c FROM categories",
    "SELECT COUNT(*) AS c FROM collections",
    "SELECT COUNT(*) AS c FROM reviews",
    "SELECT COUNT(*) AS c FROM enquiries",
  ]);

  const seedQueries: string[] = [];

  if (Number(counts[0]?.rows?.[0]?.c ?? 0) === 0) {
    seedQueries.push(
      `INSERT IGNORE INTO products (name, sku, category, price, stock, status, image, sales) VALUES
      ('Football Legends Metal Poster (A3)', 'EP-MET-001', 'Metal Posters', 699, 45, 'Active', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300', 184),
      ('F1 Racing Telemetry Desk Pad', 'EP-DSK-002', 'Desk Pad', 899, 32, 'Active', 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=300', 156),
      ('Autographed Football Signed Jersey Frame', 'EP-FRM-003', 'Signed Jersey Frame', 2499, 14, 'Active', '/products/signed-jersey-frame.jpg', 132),
      ('Anime Shonen Edition Metal Poster (A2)', 'EP-MET-004', 'Metal Posters', 999, 22, 'Active', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300', 98),
      ('Pro Gaming & Characters XXL Desk Pad', 'EP-DSK-005', 'Desk Pad', 949, 18, 'Active', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300', 76),
      ('Championship Cricket Signed Jersey Frame', 'EP-FRM-006', 'Signed Jersey Frame', 2799, 8, 'Active', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=300', 64)`
    );
  }

  if (Number(counts[1]?.rows?.[0]?.c ?? 0) === 0) {
    seedQueries.push(
      `INSERT IGNORE INTO orders (order_id, first_name, last_name, email, phone, address, landmark, city, state, pincode, payment_method, subtotal, delivery, total, status, items_json) VALUES
      ('EP20261119001', 'Alex', 'Johnson', 'alex@example.com', '+91 98765 43210', '123 Marine Drive', 'Near Metro', 'Kochi', 'Kerala', '682001', 'Paid', 1598, 0, 1598, 'Processing', '[{"id":1,"name":"Football Legends Metal Poster (A3)","price":699,"quantity":1},{"id":2,"name":"F1 Racing Telemetry Desk Pad","price":899,"quantity":1}]'),
      ('EP20261118002', 'Priya', 'Sharma', 'priya@example.com', '+91 98765 12345', '45 Indiranagar', '', 'Bengaluru', 'Karnataka', '560038', 'Paid', 899, 0, 899, 'Shipped', '[{"id":2,"name":"F1 Racing Telemetry Desk Pad","price":899,"quantity":1}]'),
      ('EP20261117003', 'Rahul', 'Kumar', 'rahul@example.com', '+91 91234 56789', '18 Anna Nagar', '', 'Chennai', 'Tamil Nadu', '600040', 'COD', 2499, 0, 2499, 'Pending', '[{"id":3,"name":"Autographed Football Signed Jersey Frame","price":2499,"quantity":1}]'),
      ('EP20261116004', 'Sneha', 'Thomas', 'sneha@example.com', '+91 99887 76655', '88 Swaraj Round', '', 'Thrissur', 'Kerala', '680001', 'Paid', 1948, 0, 1948, 'Delivered', '[{"id":4,"name":"Anime Shonen Edition Metal Poster (A2)","price":999,"quantity":1},{"id":5,"name":"Pro Gaming & Characters XXL Desk Pad","price":949,"quantity":1}]'),
      ('EP20261115005', 'Arjun', 'Das', 'arjun@example.com', '+91 90909 80808', '12 Beach Road', '', 'Kozhikode', 'Kerala', '673001', 'Refunded', 699, 0, 699, 'Cancelled', '[{"id":1,"name":"Football Legends Metal Poster (A3)","price":699,"quantity":1}]'),
      ('EP20261114006', 'Meera', 'Nair', 'meera@example.com', '+91 98989 78787', '77 Boat Jetty Road', '', 'Alappuzha', 'Kerala', '688001', 'Paid', 2799, 0, 2799, 'Delivered', '[{"id":6,"name":"Championship Cricket Signed Jersey Frame","price":2799,"quantity":1}]')`
    );
  }

  if (Number(counts[2]?.rows?.[0]?.c ?? 0) === 0) {
    seedQueries.push(
      `INSERT IGNORE INTO customers (name, email, phone, joined, orders_count, spent, status, address) VALUES
      ('Alex Johnson', 'alex@example.com', '+91 98765 43210', '10 Nov 2026', 8, 6490, 'Active', 'Kochi, Kerala, India'),
      ('Priya Sharma', 'priya@example.com', '+91 98765 12345', '08 Nov 2026', 5, 4299, 'Active', 'Bengaluru, Karnataka, India'),
      ('Rahul Kumar', 'rahul@example.com', '+91 91234 56789', '05 Nov 2026', 3, 2499, 'Active', 'Chennai, Tamil Nadu, India'),
      ('Sneha Thomas', 'sneha@example.com', '+91 99887 76655', '01 Nov 2026', 12, 9870, 'Active', 'Thrissur, Kerala, India'),
      ('Arjun Das', 'arjun@example.com', '+91 90909 80808', '28 Oct 2026', 1, 699, 'Inactive', 'Kozhikode, Kerala, India'),
      ('Meera Nair', 'meera@example.com', '+91 98989 78787', '22 Oct 2026', 6, 5199, 'Active', 'Alappuzha, Kerala, India')`
    );
  }

  if (Number(counts[3]?.rows?.[0]?.c ?? 0) === 0) {
    seedQueries.push(
      `INSERT IGNORE INTO categories (name, slug, description, image, status) VALUES
      ('Metal Posters', 'metal-posters', 'HD glossy and matte aluminium metal wall posters in A4, A3, and A2 sizes.', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300', 'Active'),
      ('Desk Pad', 'desk-pad', 'Premium XXL anti-fray gaming and workspace micro-weave desk pads.', 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=300', 'Active'),
      ('Signed Jersey Frame', 'signed-jersey-frame', 'Museum-grade shadow-box display frames for autographed sports jerseys.', '/products/signed-jersey-frame.jpg', 'Active')`
    );
  }

  seedQueries.push(
    `UPDATE products SET image = '/products/signed-jersey-frame.jpg' WHERE image LIKE '%photo-1508098682722-e99c43a406b2%'`,
    `UPDATE categories SET image = '/products/signed-jersey-frame.jpg' WHERE image LIKE '%photo-1508098682722-e99c43a406b2%'`,
    `UPDATE categories SET name = 'Metal Posters' WHERE name = 'Metal Posters'`,
    `UPDATE products SET category = 'Metal Posters' WHERE category = 'Metal Posters'`
  );

  if (Number(counts[4]?.rows?.[0]?.c ?? 0) === 0) {
    seedQueries.push(
      `INSERT IGNORE INTO collections (name, slug, description, image, status, featured) VALUES
      ('Football', 'football', 'Celebrate the beautiful game with metal posters, signed jersey frames, and desk pads featuring football legends.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600', 'Active', 1),
      ('Cricket', 'cricket', 'Tribute prints, framed jersey displays, and collector artwork dedicated to world cricket icons.', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600', 'Active', 1),
      ('Movie, Series & Characters (DC, Marvel)', 'movie-series-characters', 'Action-packed DC, Marvel, and cult cinema artwork printed on vibrant HD metal posters and desk pads.', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600', 'Active', 1),
      ('Anime', 'anime', 'High-contrast anime metal posters and desk pads inspired by iconic characters and worlds.', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600', 'Active', 1),
      ('Cars, Bike & F1', 'cars-bike-f1', 'High-octane Formula 1 racers, JDM legends, hypercars, and superbikes rendered on metallic wall art.', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600', 'Active', 1),
      ('Games and Characters', 'games-and-characters', '30+ signature gaming designs spanning open-world epics, esports classics, and legendary game characters.', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600', 'Active', 0),
      ('Lady Boss', 'lady-boss', 'Bold, modern wall art and workspace pieces celebrating women leaders, entrepreneurs, and ambition.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600', 'Active', 0),
      ('Gym and Motivation', 'gym-and-motivation', 'High-impact motivational typography and physique artwork engineered for home gyms, studios, and offices.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600', 'Active', 0)`
    );
  }

  if (Number(counts[5]?.rows?.[0]?.c ?? 0) === 0) {
    seedQueries.push(
      `INSERT IGNORE INTO reviews (customer, email, product, rating, title, comment, review_date, status) VALUES
      ('Alex Johnson', 'alex@example.com', 'Astronaut Space Poster', 5, 'Amazing quality!', 'The print quality is excellent and the colors look beautiful. It arrived safely packaged.', '19 Nov 2026', 'Approved'),
      ('Priya Sharma', 'priya@example.com', 'Abstract Modern Art', 4, 'Very good product', 'The design looks great on my wall. Delivery took a little longer than expected.', '18 Nov 2026', 'Pending'),
      ('Rahul Kumar', 'rahul@example.com', 'Vintage Aesthetic Poster', 3, 'Good but could improve', 'The design is nice, but I expected slightly thicker paper.', '17 Nov 2026', 'Pending'),
      ('Sneha Thomas', 'sneha@example.com', 'Nature Landscape Print', 5, 'Beautiful artwork', 'Absolutely loved this print. The colors are vibrant and it looks premium.', '16 Nov 2026', 'Approved'),
      ('Arjun Das', 'arjun@example.com', 'Minimalist Wall Art', 1, 'Not satisfied', 'The product I received was damaged. I have contacted support regarding this.', '15 Nov 2026', 'Rejected')`
    );
  }

  if (Number(counts[6]?.rows?.[0]?.c ?? 0) === 0) {
    seedQueries.push(
      `INSERT IGNORE INTO enquiries (reference, customer, email, phone, product, quantity, enquiry_date, message, status) VALUES
      ('ENQ-2026-001', 'Ananya Menon', 'ananya@example.com', '+91 98765 12345', 'Custom Canvas Print', 3, '19 Nov 2026', 'I would like three canvas prints with my own family photographs. Please share the available sizes and pricing.', 'New'),
      ('ENQ-2026-002', 'Vishnu Raj', 'vishnu@example.com', '+91 98765 22222', 'Personalized Poster', 5, '18 Nov 2026', 'Need five customized posters for an office event. Please let me know the bulk price.', 'In Progress'),
      ('ENQ-2026-003', 'Diya Thomas', 'diya@example.com', '+91 98765 33333', 'Custom Wall Art', 2, '17 Nov 2026', 'I have a design file and would like to print it as wall art.', 'Completed'),
      ('ENQ-2026-004', 'Nikhil Kumar', 'nikhil@example.com', '+91 98765 44444', 'Photo Stickers', 20, '16 Nov 2026', 'Looking for twenty personalized stickers for a birthday event.', 'New'),
      ('ENQ-2026-005', 'Riya Nair', 'riya@example.com', '+91 98765 55555', 'Custom Canvas Print', 1, '15 Nov 2026', 'Please provide a quotation for a large canvas print.', 'Rejected')`
    );
  }

  if (seedQueries.length > 0) {
    await runInAppDatabase(seedQueries);
  }
  seedCompleted = true;
}

export async function getAdminDataFromDb() {
  await ensureSeededDatabase();

  const [
    productsRes,
    ordersRes,
    customersRes,
    categoriesRes,
    collectionsRes,
    reviewsRes,
    enquiriesRes,
  ] = await runInAppDatabase([
    "SELECT id, name, sku, category, price, stock, status, image, sales FROM products ORDER BY id DESC",
    "SELECT id, order_id, first_name, last_name, email, phone, payment_method, total, status, items_json, DATE_FORMAT(created_at, '%d %b %Y') AS formatted_date FROM orders ORDER BY id DESC",
    "SELECT id, name, email, phone, joined, orders_count, spent, status, address FROM customers ORDER BY id DESC",
    "SELECT id, name, slug, description, image, status FROM categories ORDER BY id ASC",
    "SELECT id, name, slug, description, image, status, featured FROM collections ORDER BY id ASC",
    "SELECT id, customer, email, product, rating, title, comment, review_date, status FROM reviews ORDER BY id DESC",
    "SELECT id, reference, customer, email, phone, product, quantity, enquiry_date, message, status FROM enquiries ORDER BY id DESC",
  ]);

  const products = (productsRes?.rows ?? []).map((r) => ({
    id: Number(r.id),
    name: r.name ?? "",
    sku: r.sku ?? "",
    category: r.category ?? "Posters",
    price: Number(r.price ?? 0),
    stock: Number(r.stock ?? 0),
    status: (r.status ?? "Active") as "Active" | "Draft" | "Out of Stock",
    image: r.image ?? "",
    sales: Number(r.sales ?? 0),
  }));

  const orders = (ordersRes?.rows ?? []).map((r) => {
    let itemsCount = 1;
    try {
      const parsed = JSON.parse(r.items_json ?? "[]");
      if (Array.isArray(parsed) && parsed.length > 0) {
        itemsCount = parsed.reduce(
          (sum: number, item: { quantity?: number }) =>
            sum + Number(item?.quantity ?? 1),
          0
        );
      }
    } catch {
      /* fallback */
    }
    const payment =
      r.payment_method === "cod"
        ? "COD"
        : r.payment_method === "razorpay"
          ? "Paid"
          : (r.payment_method ?? "Paid");

    return {
      id: r.order_id ?? "",
      customer: `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim(),
      email: r.email ?? "",
      date: r.formatted_date ?? "20 Nov 2026",
      items: itemsCount,
      total: Number(r.total ?? 0),
      payment,
      status: (r.status ?? "Processing") as
        | "Pending"
        | "Processing"
        | "Shipped"
        | "Delivered"
        | "Cancelled",
    };
  });

  const customers = (customersRes?.rows ?? []).map((r) => ({
    id: Number(r.id),
    name: r.name ?? "",
    email: r.email ?? "",
    phone: r.phone ?? "",
    joined: r.joined ?? "Nov 2026",
    orders: Number(r.orders_count ?? 1),
    spent: Number(r.spent ?? 0),
    status: (r.status ?? "Active") as "Active" | "Inactive",
    address: r.address ?? "",
  }));

  const categories = (categoriesRes?.rows ?? []).map((r) => ({
    id: Number(r.id),
    name: r.name ?? "",
    slug: r.slug ?? "",
    description: r.description ?? "",
    image: r.image ?? "",
    status: (r.status ?? "Active") as "Active" | "Inactive",
  }));

  const collections = (collectionsRes?.rows ?? []).map((r) => ({
    id: Number(r.id),
    name: r.name ?? "",
    slug: r.slug ?? "",
    description: r.description ?? "",
    image: r.image ?? "",
    status: (r.status ?? "Active") as "Active" | "Inactive",
    featured: Number(r.featured ?? 0) === 1,
  }));

  const reviews = (reviewsRes?.rows ?? []).map((r) => ({
    id: Number(r.id),
    customer: r.customer ?? "",
    email: r.email ?? "",
    product: r.product ?? "",
    rating: Number(r.rating ?? 5),
    title: r.title ?? "",
    comment: r.comment ?? "",
    date: r.review_date ?? "Nov 2026",
    status: (r.status ?? "Pending") as "Pending" | "Approved" | "Rejected",
  }));

  const enquiries = (enquiriesRes?.rows ?? []).map((r) => ({
    id: Number(r.id),
    reference: r.reference ?? "",
    customer: r.customer ?? "",
    email: r.email ?? "",
    phone: r.phone ?? "",
    product: r.product ?? "",
    quantity: Number(r.quantity ?? 1),
    date: r.enquiry_date ?? "Nov 2026",
    message: r.message ?? "",
    status: (r.status ?? "New") as
      | "New"
      | "In Progress"
      | "Completed"
      | "Rejected",
  }));

  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  // Aggregate real top-selling products from non-cancelled orders in TiDB Cloud
  const productById = new Map(products.map((p) => [p.id, p]));
  const productByName = new Map(
    products.map((p) => [p.name.trim().toLowerCase(), p])
  );
  const realSalesMap = new Map<
    string,
    { id: number; name: string; category: string; sales: number; revenue: number; image: string }
  >();

  for (const r of ordersRes?.rows ?? []) {
    if ((r.status ?? "") === "Cancelled") continue;
    try {
      const parsed = JSON.parse(r.items_json ?? "[]") as Array<{
        id?: number;
        name?: string;
        price?: number;
        quantity?: number;
      }>;
      if (!Array.isArray(parsed)) continue;
      for (const item of parsed) {
        const qty = Math.max(1, Number(item?.quantity ?? 1));
        const matched =
          (item?.id ? productById.get(Number(item.id)) : undefined) ??
          (item?.name
            ? productByName.get(String(item.name).trim().toLowerCase())
            : undefined);
        const unitPrice = Number(item?.price ?? matched?.price ?? 0);
        const name = matched?.name || String(item?.name || "Product").trim();
        const key = matched ? `id-${matched.id}` : `name-${name.toLowerCase()}`;
        const existing = realSalesMap.get(key);
        if (existing) {
          existing.sales += qty;
          existing.revenue += unitPrice * qty;
        } else {
          realSalesMap.set(key, {
            id: matched?.id ?? realSalesMap.size + 1000,
            name,
            category: matched?.category ?? "Epic Store",
            sales: qty,
            revenue: unitPrice * qty,
            image: matched?.image ?? "/products/signed-jersey-frame.jpg",
          });
        }
      }
    } catch {
      /* ignore malformed items_json */
    }
  }

  const topProducts = Array.from(realSalesMap.values())
    .sort((a, b) => b.revenue - a.revenue || b.sales - a.sales)
    .slice(0, 5);

  return {
    products,
    orders,
    customers,
    categories,
    collections,
    reviews,
    enquiries,
    topProducts,
    summary: {
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: customers.length,
      totalProducts: products.length,
    },
  };
}

export async function generateNextBookingId(): Promise<string> {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}`;
  const baseId = `IFE-${datePart}`;
  try {
    await ensureSeededDatabase();
    const [res] = await runInAppDatabase([
      `SELECT COUNT(*) AS count FROM orders WHERE order_id = ${sqlEscape(baseId)} OR order_id LIKE ${sqlEscape(`${baseId}-%`)}`,
    ]);
    const existing = Number(res?.rows?.[0]?.count ?? 0);
    return existing === 0 ? baseId : `${baseId}-${existing + 1}`;
  } catch {
    return baseId;
  }
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
  await ensureSeededDatabase();
  const fullName = `${order.firstName} ${order.lastName}`.trim();
  const fullAddress = `${order.city}, ${order.state}, India`;
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const insertOrderSql = `INSERT INTO orders (
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

  const upsertCustomerSql = `INSERT INTO customers (name, email, phone, joined, orders_count, spent, status, address)
  VALUES (
    ${sqlEscape(fullName)},
    ${sqlEscape(order.email)},
    ${sqlEscape(order.phone)},
    ${sqlEscape(today)},
    1,
    ${sqlEscape(order.total)},
    'Active',
    ${sqlEscape(fullAddress)}
  ) ON DUPLICATE KEY UPDATE
    orders_count = orders_count + 1,
    spent = spent + ${sqlEscape(order.total)}`;

  await runInAppDatabase([insertOrderSql, upsertCustomerSql]);
}

export async function saveContactEnquiryToDb(payload: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<void> {
  await ensureSeededDatabase();
  const ref = `ENQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  await runInAppDatabase([
    `INSERT INTO contact_enquiries (name, email, phone, subject, message) VALUES (
      ${sqlEscape(payload.name)},
      ${sqlEscape(payload.email)},
      ${sqlEscape(payload.phone ?? "")},
      ${sqlEscape(payload.subject)},
      ${sqlEscape(payload.message)}
    )`,
    `INSERT IGNORE INTO enquiries (reference, customer, email, phone, product, quantity, enquiry_date, message, status) VALUES (
      ${sqlEscape(ref)},
      ${sqlEscape(payload.name)},
      ${sqlEscape(payload.email)},
      ${sqlEscape(payload.phone || "Not provided")},
      ${sqlEscape(payload.subject)},
      1,
      ${sqlEscape(today)},
      ${sqlEscape(payload.message)},
      'New'
    )`,
  ]);
}

export async function saveCustomPrintToDb(payload: {
  name: string;
  email: string;
  printType: string;
  dimensions?: string;
  fileName?: string;
  message?: string;
}): Promise<void> {
  await ensureSeededDatabase();
  const ref = `ENQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  await runInAppDatabase([
    `INSERT INTO custom_print_requests (name, email, print_type, dimensions, file_name, message) VALUES (
      ${sqlEscape(payload.name)},
      ${sqlEscape(payload.email)},
      ${sqlEscape(payload.printType)},
      ${sqlEscape(payload.dimensions ?? "")},
      ${sqlEscape(payload.fileName ?? "")},
      ${sqlEscape(payload.message ?? "")}
    )`,
    `INSERT IGNORE INTO enquiries (reference, customer, email, phone, product, quantity, enquiry_date, message, status) VALUES (
      ${sqlEscape(ref)},
      ${sqlEscape(payload.name)},
      ${sqlEscape(payload.email)},
      'Custom Studio',
      ${sqlEscape(
        `${payload.printType}${payload.dimensions ? ` (${payload.dimensions})` : ""}`
      )},
      1,
      ${sqlEscape(today)},
      ${sqlEscape(payload.message || "Custom print request")},
      'New'
    )`,
  ]);
}

export async function saveNewsletterSubscriberToDb(email: string): Promise<void> {
  const sql = `INSERT IGNORE INTO newsletter_subscribers (email) VALUES (${sqlEscape(email)})`;
  await runInAppDatabase([sql]);
}
