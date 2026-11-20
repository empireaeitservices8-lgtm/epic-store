import { NextRequest } from "next/server";
import { getDbConfig, runInAppDatabase } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const view = request.nextUrl.searchParams.get("view");
    const cfg = getDbConfig();

    if (view === "orders") {
      const [res] = await runInAppDatabase([
        "SELECT order_id, first_name, last_name, email, phone, city, state, payment_method, total, status, created_at FROM orders ORDER BY id DESC LIMIT 50",
      ]);
      return Response.json({ ok: true, orders: res?.rows ?? [] });
    }

    if (view === "enquiries") {
      const [contactRes, customRes] = await runInAppDatabase([
        "SELECT id, name, email, phone, subject, message, status, created_at FROM contact_enquiries ORDER BY id DESC LIMIT 50",
        "SELECT id, name, email, print_type, dimensions, file_name, message, status, created_at FROM custom_print_requests ORDER BY id DESC LIMIT 50",
      ]);
      return Response.json({
        ok: true,
        contactEnquiries: contactRes?.rows ?? [],
        customPrintRequests: customRes?.rows ?? [],
      });
    }

    const [versionRes, ordersCount, enquiriesCount, customCount, newsletterCount] =
      await runInAppDatabase([
        "SELECT VERSION() AS version, DATABASE() AS current_db",
        "SELECT COUNT(*) AS count FROM orders",
        "SELECT COUNT(*) AS count FROM contact_enquiries",
        "SELECT COUNT(*) AS count FROM custom_print_requests",
        "SELECT COUNT(*) AS count FROM newsletter_subscribers",
      ]);

    return Response.json({
      ok: true,
      connected: true,
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      database: versionRes?.rows?.[0]?.current_db ?? cfg.appDatabase,
      serverVersion: versionRes?.rows?.[0]?.version ?? "TiDB Cloud",
      tables: {
        orders: Number(ordersCount?.rows?.[0]?.count ?? 0),
        contact_enquiries: Number(enquiriesCount?.rows?.[0]?.count ?? 0),
        custom_print_requests: Number(customCount?.rows?.[0]?.count ?? 0),
        newsletter_subscribers: Number(newsletterCount?.rows?.[0]?.count ?? 0),
      },
    });
  } catch (err) {
    const cfg = getDbConfig();
    return Response.json(
      {
        ok: false,
        connected: false,
        host: cfg.host,
        port: cfg.port,
        user: cfg.user,
        error:
          err instanceof Error
            ? err.message
            : "Failed to connect to TiDB Cloud database.",
      },
      { status: 500 }
    );
  }
}

