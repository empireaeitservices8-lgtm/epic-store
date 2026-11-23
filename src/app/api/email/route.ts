import { NextRequest } from "next/server";
import {
  generateNextBookingId,
  saveContactEnquiryToDb,
  saveCustomPrintToDb,
  saveNewsletterSubscriberToDb,
  saveOrderToDb,
} from "@/lib/db";
import {
  buildContactEmails,
  buildCustomerOrderEmail,
  buildCustomPrintEmails,
  buildNewsletterEmails,
  buildStoreOrderNotificationEmail,
  sendEmail,
  STORE_EMAIL,
  type OrderEmailPayload,
} from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const type = body?.type as string | undefined;

    if (type === "order") {
      const email = String(body.email ?? "").trim();
      if (!EMAIL_RE.test(email)) {
        return Response.json(
          { ok: false, error: "A valid customer email address is required." },
          { status: 400 }
        );
      }

      const requestedId = String(body.orderId ?? "").trim();
      const orderId = requestedId || (await generateNextBookingId());

      const payload: OrderEmailPayload = {
        orderId,
        firstName: String(body.firstName ?? "Customer").trim(),
        lastName: String(body.lastName ?? "").trim(),
        email,
        phone: String(body.phone ?? "").trim(),
        address: String(body.address ?? "").trim(),
        landmark: String(body.landmark ?? "").trim(),
        city: String(body.city ?? "").trim(),
        state: String(body.state ?? "").trim(),
        pincode: String(body.pincode ?? "").trim(),
        paymentMethod: String(body.paymentMethod ?? "razorpay"),
        items: Array.isArray(body.items) ? body.items : [],
        subtotal: Number(body.subtotal ?? 0),
        delivery: Number(body.delivery ?? 0),
        total: Number(body.total ?? 0),
      };

      const customerMail = buildCustomerOrderEmail(payload);
      const storeMail = buildStoreOrderNotificationEmail(payload);

      const [customerResult, storeResult, dbSaved] = await Promise.all([
        sendEmail(customerMail),
        sendEmail(storeMail),
        saveOrderToDb(payload)
          .then(() => true)
          .catch((err) => {
            console.warn("[Epic Store TiDB Order Save Warning]", err);
            return false;
          }),
      ]);

      return Response.json({
        ok: true,
        orderId,
        dbSaved,
        storeEmail: STORE_EMAIL,
        customerEmail: email,
        mode:
          customerResult.mode === "smtp" && storeResult.mode === "smtp"
            ? "smtp"
            : "preview",
      });
    }

    if (type === "contact") {
      const email = String(body.email ?? "").trim();
      const name = String(body.name ?? "").trim();
      const message = String(body.message ?? "").trim();
      if (!name || !EMAIL_RE.test(email) || !message) {
        return Response.json(
          { ok: false, error: "Name, valid email, and message are required." },
          { status: 400 }
        );
      }

      const contactPayload = {
        name,
        email,
        phone: String(body.phone ?? "").trim(),
        subject: String(body.subject ?? "General Enquiry").trim(),
        message,
      };

      const { storeMail, customerMail } = buildContactEmails(contactPayload);

      const [storeResult, , dbSaved] = await Promise.all([
        sendEmail(storeMail),
        sendEmail(customerMail),
        saveContactEnquiryToDb(contactPayload)
          .then(() => true)
          .catch((err) => {
            console.warn("[Epic Store TiDB Contact Save Warning]", err);
            return false;
          }),
      ]);

      return Response.json({
        ok: true,
        dbSaved,
        storeEmail: STORE_EMAIL,
        mode: storeResult.mode,
      });
    }

    if (type === "custom-print") {
      const email = String(body.email ?? "").trim();
      const name = String(body.name ?? "").trim();
      if (!name || !EMAIL_RE.test(email)) {
        return Response.json(
          { ok: false, error: "Name and valid email are required." },
          { status: 400 }
        );
      }

      const customPayload = {
        name,
        email,
        printType: String(body.printType ?? "Personalized Poster").trim(),
        dimensions: String(body.dimensions ?? "").trim(),
        fileName: String(body.fileName ?? "").trim(),
        message: String(body.message ?? "").trim(),
      };

      const { storeMail, customerMail } = buildCustomPrintEmails(customPayload);

      const [storeResult, , dbSaved] = await Promise.all([
        sendEmail(storeMail),
        sendEmail(customerMail),
        saveCustomPrintToDb(customPayload)
          .then(() => true)
          .catch((err) => {
            console.warn("[Epic Store TiDB Custom Print Save Warning]", err);
            return false;
          }),
      ]);

      return Response.json({
        ok: true,
        dbSaved,
        storeEmail: STORE_EMAIL,
        mode: storeResult.mode,
      });
    }

    if (type === "newsletter") {
      const email = String(body.email ?? "").trim();
      if (!EMAIL_RE.test(email)) {
        return Response.json(
          { ok: false, error: "Please enter a valid email address." },
          { status: 400 }
        );
      }

      const { storeMail, customerMail } = buildNewsletterEmails(email);
      const [customerResult, , dbSaved] = await Promise.all([
        sendEmail(customerMail),
        sendEmail(storeMail),
        saveNewsletterSubscriberToDb(email)
          .then(() => true)
          .catch((err) => {
            console.warn("[Epic Store TiDB Newsletter Save Warning]", err);
            return false;
          }),
      ]);

      return Response.json({
        ok: true,
        dbSaved,
        storeEmail: STORE_EMAIL,
        mode: customerResult.mode,
      });
    }

    return Response.json(
      { ok: false, error: "Unsupported email action type." },
      { status: 400 }
    );
  } catch (err) {
    console.error("[Epic Store Email API Error]", err);
    return Response.json(
      {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : "Failed to process email request.",
      },
      { status: 500 }
    );
  }
}
