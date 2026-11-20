import tls from "node:tls";

export const STORE_EMAIL =
  process.env.GMAIL_USER?.trim() || "store.epicsports@gmail.com";
export const STORE_NAME = "Epic Store";

export type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type SendMailResult = {
  ok: boolean;
  mode: "smtp" | "preview";
  error?: string;
};

function encodeHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function buildMimeMessage(opts: SendMailOptions): string {
  const boundary = `epic_boundary_${Date.now().toString(36)}`;
  const headers = [
    `From: "${STORE_NAME}" <${STORE_EMAIL}>`,
    `To: <${encodeHeader(opts.to)}>`,
    opts.replyTo ? `Reply-To: <${encodeHeader(opts.replyTo)}>` : "",
    `Subject: =?UTF-8?B?${Buffer.from(encodeHeader(opts.subject), "utf8").toString("base64")}?=`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ].filter(Boolean);

  const plainB64 =
    Buffer.from(opts.text, "utf8")
      .toString("base64")
      .match(/.{1,76}/g)
      ?.join("\r\n") ?? "";

  const htmlB64 =
    Buffer.from(opts.html, "utf8")
      .toString("base64")
      .match(/.{1,76}/g)
      ?.join("\r\n") ?? "";

  return [
    ...headers,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    plainB64,
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    htmlB64,
    `--${boundary}--`,
    "",
  ].join("\r\n");
}

/**
 * Connects directly to smtp.gmail.com:465 over TLS using Node's built-in `node:tls`
 * so no external npm dependency is required.
 */
async function sendViaGmailSmtp(
  user: string,
  appPassword: string,
  opts: SendMailOptions
): Promise<void> {
  const rawMessage = buildMimeMessage(opts)
    .split("\r\n")
    .map((line) => (line.startsWith(".") ? `.${line}` : line))
    .join("\r\n");

  return new Promise<void>((resolve, reject) => {
    const socket = tls.connect(
      {
        host: "smtp.gmail.com",
        port: 465,
        servername: "smtp.gmail.com",
        timeout: 15000,
      },
      () => {
        /* connected */
      }
    );

    let buffer = "";
    let step = 0;
    let settled = false;

    const finish = (err?: Error) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      if (err) reject(err);
      else resolve();
    };

    const writeLine = (cmd: string) => {
      socket.write(`${cmd}\r\n`);
    };

    socket.setEncoding("utf8");
    socket.on("timeout", () => finish(new Error("Gmail SMTP connection timed out")));
    socket.on("error", (err) => finish(err));

    socket.on("data", (chunk: string) => {
      buffer += chunk;
      const lines = buffer.split("\r\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.length < 3) continue;
        // Multi-line SMTP responses have a hyphen at index 3 (e.g., "250-..."); wait for the final line ("250 ...")
        if (line[3] === "-") continue;

        const code = Number(line.slice(0, 3));
        if (code >= 400) {
          finish(new Error(`Gmail SMTP error (${code}): ${line}`));
          return;
        }

        if (step === 0 && code === 220) {
          step = 1;
          writeLine("EHLO epicstore.local");
        } else if (step === 1 && code === 250) {
          step = 2;
          writeLine("AUTH LOGIN");
        } else if (step === 2 && code === 334) {
          step = 3;
          writeLine(Buffer.from(user, "utf8").toString("base64"));
        } else if (step === 3 && code === 334) {
          step = 4;
          writeLine(
            Buffer.from(appPassword.replace(/\s+/g, ""), "utf8").toString("base64")
          );
        } else if (step === 4 && code === 235) {
          step = 5;
          writeLine(`MAIL FROM:<${user}>`);
        } else if (step === 5 && code === 250) {
          step = 6;
          writeLine(`RCPT TO:<${encodeHeader(opts.to)}>`);
        } else if (step === 6 && code === 250) {
          step = 7;
          writeLine("DATA");
        } else if (step === 7 && code === 354) {
          step = 8;
          writeLine(`${rawMessage}\r\n.`);
        } else if (step === 8 && code === 250) {
          step = 9;
          writeLine("QUIT");
          finish();
        }
      }
    });
  });
}

export async function sendEmail(opts: SendMailOptions): Promise<SendMailResult> {
  const appPassword = process.env.GMAIL_APP_PASSWORD?.trim();

  if (!appPassword) {
    console.info(
      `[Epic Store Mailer - Preview Mode] Set GMAIL_APP_PASSWORD for ${STORE_EMAIL} to send live Gmail SMTP emails.\n` +
        `  From: ${STORE_EMAIL}\n` +
        `  To: ${opts.to}\n` +
        `  Subject: ${opts.subject}`
    );
    return { ok: true, mode: "preview" };
  }

  await sendViaGmailSmtp(STORE_EMAIL, appPassword, opts);
  return { ok: true, mode: "smtp" };
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrapEmailLayout(badge: string, heading: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F7F8F5;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#17171B;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F8F5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#FFFFFF;border-radius:24px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background-color:#17171B;padding:28px 32px;">
              <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#78D94F;">
                ${escapeHtml(badge)}
              </p>
              <h1 style="margin:0;font-size:24px;font-weight:800;line-height:1.25;color:#FFFFFF;">
                ${escapeHtml(heading)}
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#17171B;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;">
                Sent automatically by <strong style="color:#FFFFFF;">Epic Store</strong> &bull;
                <a href="mailto:${STORE_EMAIL}" style="color:#78D94F;text-decoration:none;">${STORE_EMAIL}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export type OrderItemPayload = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type OrderEmailPayload = {
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
  items: OrderItemPayload[];
  subtotal: number;
  delivery: number;
  total: number;
};

export function buildCustomerOrderEmail(order: OrderEmailPayload): SendMailOptions {
  const customerName = `${order.firstName} ${order.lastName}`.trim();
  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;font-size:14px;color:#17171B;">
          <strong>${escapeHtml(item.name)}</strong> &times; ${item.quantity}
        </td>
        <td align="right" style="padding:10px 0;border-bottom:1px solid #F3F4F6;font-size:14px;font-weight:700;color:#17171B;">
          ₹${(item.price * item.quantity).toLocaleString("en-IN")}
        </td>
      </tr>`
    )
    .join("");

  const bodyHtml = `
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374151;">
      Hi <strong>${escapeHtml(customerName)}</strong>,
    </p>
    <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:#374151;">
      Thank you for your order with <strong>Epic Store</strong>! We have received your order and our studio is preparing your prints.
    </p>

    <div style="background-color:#F7F8F5;border-radius:16px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 6px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;color:#6B7280;">
        Order ID
      </p>
      <p style="margin:0;font-size:18px;font-weight:800;color:#17171B;">
        ${escapeHtml(order.orderId)}
      </p>
    </div>

    <h2 style="margin:0 0 12px 0;font-size:16px;font-weight:800;color:#17171B;">
      Ordered Products
    </h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      ${itemsRows}
      <tr>
        <td style="padding:10px 0 4px 0;font-size:13px;color:#6B7280;">Subtotal</td>
        <td align="right" style="padding:10px 0 4px 0;font-size:13px;font-weight:600;color:#17171B;">₹${order.subtotal.toLocaleString("en-IN")}</td>
      </tr>
      <tr>
        <td style="padding:4px 0 10px 0;font-size:13px;color:#6B7280;">Shipping</td>
        <td align="right" style="padding:4px 0 10px 0;font-size:13px;font-weight:600;color:#17171B;">${order.delivery === 0 ? "FREE" : `₹${order.delivery}`}</td>
      </tr>
      <tr>
        <td style="padding:12px 0 0 0;border-top:2px solid #17171B;font-size:16px;font-weight:800;color:#17171B;">Total</td>
        <td align="right" style="padding:12px 0 0 0;border-top:2px solid #17171B;font-size:18px;font-weight:800;color:#17171B;">₹${order.total.toLocaleString("en-IN")}</td>
      </tr>
    </table>

    <div style="border-top:1px solid #E5E7EB;padding-top:16px;margin-top:16px;font-size:13px;line-height:1.6;color:#4B5563;">
      <p style="margin:0 0 4px 0;font-weight:700;color:#17171B;">Delivery Address</p>
      <p style="margin:0;">
        ${escapeHtml(customerName)} (${escapeHtml(order.phone)})<br />
        ${escapeHtml(order.address)}${order.landmark ? `, ${escapeHtml(order.landmark)}` : ""}<br />
        ${escapeHtml(order.city)}, ${escapeHtml(order.state)} - ${escapeHtml(order.pincode)}
      </p>
      <p style="margin:12px 0 0 0;">
        <strong>Payment Method:</strong> ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment (Razorpay)"}
      </p>
    </div>

    <p style="margin:24px 0 0 0;font-size:13px;line-height:1.6;color:#6B7280;">
      Need help with your order? Simply reply to this email or contact us at
      <a href="mailto:${STORE_EMAIL}" style="color:#15803D;font-weight:600;">${STORE_EMAIL}</a>.
    </p>
  `;

  const text = [
    `Hi ${customerName},`,
    "",
    `Thank you for your order with Epic Store!`,
    `Order ID: ${order.orderId}`,
    "",
    "Items:",
    ...order.items.map(
      (i) => `- ${i.name} x${i.quantity}: ₹${(i.price * i.quantity).toLocaleString("en-IN")}`
    ),
    `Subtotal: ₹${order.subtotal.toLocaleString("en-IN")}`,
    `Shipping: ${order.delivery === 0 ? "FREE" : `₹${order.delivery}`}`,
    `Total: ₹${order.total.toLocaleString("en-IN")}`,
    "",
    `Delivery Address: ${order.address}, ${order.city}, ${order.state} - ${order.pincode}`,
    `Phone: ${order.phone}`,
    `Questions? Contact ${STORE_EMAIL}`,
  ].join("\n");

  return {
    to: order.email,
    replyTo: STORE_EMAIL,
    subject: `Order Confirmed (${order.orderId}) — Epic Store`,
    html: wrapEmailLayout("Order Confirmation", `Thank You for Your Order!`, bodyHtml),
    text,
  };
}

export function buildStoreOrderNotificationEmail(
  order: OrderEmailPayload
): SendMailOptions {
  const customerName = `${order.firstName} ${order.lastName}`.trim();
  const itemsList = order.items
    .map(
      (i) =>
        `<li><strong>${escapeHtml(i.name)}</strong> &times; ${i.quantity} — ₹${(
          i.price * i.quantity
        ).toLocaleString("en-IN")}</li>`
    )
    .join("");

  const bodyHtml = `
    <p style="margin:0 0 16px 0;font-size:14px;color:#374151;">
      A new order <strong>${escapeHtml(order.orderId)}</strong> has been placed on Epic Store.
    </p>
    <div style="background-color:#F7F8F5;border-radius:16px;padding:16px 20px;margin-bottom:20px;font-size:14px;line-height:1.7;">
      <strong>Customer:</strong> ${escapeHtml(customerName)}<br />
      <strong>Email:</strong> <a href="mailto:${escapeHtml(order.email)}">${escapeHtml(order.email)}</a><br />
      <strong>Phone:</strong> ${escapeHtml(order.phone)}<br />
      <strong>Payment:</strong> ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment (Razorpay)"}<br />
      <strong>Total Amount:</strong> ₹${order.total.toLocaleString("en-IN")}
    </div>
    <h3 style="margin:0 0 8px 0;font-size:15px;">Items Ordered</h3>
    <ul style="margin:0 0 20px 0;padding-left:20px;font-size:14px;line-height:1.7;">
      ${itemsList}
    </ul>
    <h3 style="margin:0 0 6px 0;font-size:15px;">Shipping Address</h3>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#4B5563;">
      ${escapeHtml(order.address)}${order.landmark ? `, ${escapeHtml(order.landmark)}` : ""}<br />
      ${escapeHtml(order.city)}, ${escapeHtml(order.state)} - ${escapeHtml(order.pincode)}
    </p>
  `;

  return {
    to: STORE_EMAIL,
    replyTo: order.email,
    subject: `[New Order ${order.orderId}] ₹${order.total.toLocaleString("en-IN")} from ${customerName}`,
    html: wrapEmailLayout("New Store Order", `Order ${order.orderId}`, bodyHtml),
    text: `New Order ${order.orderId} from ${customerName} (${order.email}, ${order.phone}). Total: ₹${order.total}. Address: ${order.address}, ${order.city}, ${order.state} - ${order.pincode}`,
  };
}

export type ContactEmailPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export function buildContactEmails(payload: ContactEmailPayload): {
  storeMail: SendMailOptions;
  customerMail: SendMailOptions;
} {
  const storeBody = `
    <div style="background-color:#F7F8F5;border-radius:16px;padding:16px 20px;margin-bottom:20px;font-size:14px;line-height:1.7;">
      <strong>Name:</strong> ${escapeHtml(payload.name)}<br />
      <strong>Email:</strong> <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a><br />
      <strong>Phone:</strong> ${escapeHtml(payload.phone || "Not provided")}<br />
      <strong>Topic:</strong> ${escapeHtml(payload.subject)}
    </div>
    <h3 style="margin:0 0 8px 0;font-size:15px;">Message</h3>
    <p style="margin:0;font-size:14px;line-height:1.7;color:#374151;white-space:pre-line;">
      ${escapeHtml(payload.message)}
    </p>
  `;

  const customerBody = `
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374151;">
      Hi <strong>${escapeHtml(payload.name)}</strong>,
    </p>
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374151;">
      Thank you for contacting <strong>Epic Store</strong> regarding <strong>${escapeHtml(payload.subject)}</strong>. We have received your message and our support team at <a href="mailto:${STORE_EMAIL}" style="color:#15803D;font-weight:600;">${STORE_EMAIL}</a> will get back to you shortly.
    </p>
    <div style="background-color:#F7F8F5;border-radius:16px;padding:16px 20px;font-size:13px;line-height:1.6;color:#4B5563;">
      <strong>Your message:</strong><br />
      ${escapeHtml(payload.message)}
    </div>
  `;

  return {
    storeMail: {
      to: STORE_EMAIL,
      replyTo: payload.email,
      subject: `[Contact Enquiry] ${payload.subject} — ${payload.name}`,
      html: wrapEmailLayout("Contact Enquiry", payload.subject, storeBody),
      text: `From: ${payload.name} (${payload.email}, ${payload.phone || "N/A"})\nSubject: ${payload.subject}\n\n${payload.message}`,
    },
    customerMail: {
      to: payload.email,
      replyTo: STORE_EMAIL,
      subject: `We received your message — Epic Store`,
      html: wrapEmailLayout("Customer Support", "Thanks for Reaching Out!", customerBody),
      text: `Hi ${payload.name},\n\nThank you for contacting Epic Store regarding "${payload.subject}". Our team (${STORE_EMAIL}) will respond shortly.\n\nYour message:\n${payload.message}`,
    },
  };
}

export type CustomPrintEmailPayload = {
  name: string;
  email: string;
  printType: string;
  dimensions?: string;
  fileName?: string;
  message?: string;
};

export function buildCustomPrintEmails(payload: CustomPrintEmailPayload): {
  storeMail: SendMailOptions;
  customerMail: SendMailOptions;
} {
  const storeBody = `
    <div style="background-color:#F7F8F5;border-radius:16px;padding:16px 20px;margin-bottom:20px;font-size:14px;line-height:1.7;">
      <strong>Customer:</strong> ${escapeHtml(payload.name)}<br />
      <strong>Email:</strong> <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a><br />
      <strong>Print Type:</strong> ${escapeHtml(payload.printType)}<br />
      <strong>Dimensions:</strong> ${escapeHtml(payload.dimensions || "Standard / To discuss")}<br />
      <strong>Reference File:</strong> ${escapeHtml(payload.fileName || "None attached")}
    </div>
    <h3 style="margin:0 0 8px 0;font-size:15px;">Design Instructions</h3>
    <p style="margin:0;font-size:14px;line-height:1.7;color:#374151;white-space:pre-line;">
      ${escapeHtml(payload.message || "No additional notes provided.")}
    </p>
  `;

  const customerBody = `
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374151;">
      Hi <strong>${escapeHtml(payload.name)}</strong>,
    </p>
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374151;">
      We have received your custom print request for a <strong>${escapeHtml(payload.printType)}</strong>! Our design specialists at <a href="mailto:${STORE_EMAIL}" style="color:#15803D;font-weight:600;">${STORE_EMAIL}</a> will review your specifications and contact you with preview and pricing details.
    </p>
    <div style="background-color:#F7F8F5;border-radius:16px;padding:16px 20px;font-size:13px;line-height:1.7;color:#4B5563;">
      <strong>Print Type:</strong> ${escapeHtml(payload.printType)}<br />
      <strong>Dimensions:</strong> ${escapeHtml(payload.dimensions || "To discuss")}<br />
      <strong>Notes:</strong> ${escapeHtml(payload.message || "None")}
    </div>
  `;

  return {
    storeMail: {
      to: STORE_EMAIL,
      replyTo: payload.email,
      subject: `[Custom Print Request] ${payload.printType} — ${payload.name}`,
      html: wrapEmailLayout("Custom Print Request", payload.printType, storeBody),
      text: `Custom Print Request from ${payload.name} (${payload.email})\nType: ${payload.printType}\nDimensions: ${payload.dimensions || "N/A"}\nFile: ${payload.fileName || "N/A"}\nNotes: ${payload.message || "N/A"}`,
    },
    customerMail: {
      to: payload.email,
      replyTo: STORE_EMAIL,
      subject: `Your Custom Print Request (${payload.printType}) — Epic Store`,
      html: wrapEmailLayout("Custom Prints Studio", "We Received Your Custom Idea!", customerBody),
      text: `Hi ${payload.name},\n\nWe received your custom print enquiry for "${payload.printType}". Our team at ${STORE_EMAIL} will review your request and reply soon.`,
    },
  };
}

export function buildNewsletterEmails(subscriberEmail: string): {
  storeMail: SendMailOptions;
  customerMail: SendMailOptions;
} {
  const customerBody = `
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374151;">
      Welcome to the <strong>Epic Store</strong> community!
    </p>
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374151;">
      You&apos;re now on the list for new wall art drops, curated collections, and exclusive custom print offers.
    </p>
  `;

  const storeBody = `
    <p style="margin:0;font-size:14px;line-height:1.6;color:#374151;">
      New newsletter subscriber: <strong>${escapeHtml(subscriberEmail)}</strong>
    </p>
  `;

  return {
    storeMail: {
      to: STORE_EMAIL,
      replyTo: subscriberEmail,
      subject: `[Newsletter Subscriber] ${subscriberEmail}`,
      html: wrapEmailLayout("Newsletter Signup", "New Subscriber", storeBody),
      text: `New newsletter subscriber: ${subscriberEmail}`,
    },
    customerMail: {
      to: subscriberEmail,
      replyTo: STORE_EMAIL,
      subject: `Welcome to Epic Store!`,
      html: wrapEmailLayout("Welcome to Epic Store", "You're on the List.", customerBody),
      text: `Welcome to Epic Store! You're now subscribed for new collections, exclusive offers, and creative updates. Contact us anytime at ${STORE_EMAIL}.`,
    },
  };
}

