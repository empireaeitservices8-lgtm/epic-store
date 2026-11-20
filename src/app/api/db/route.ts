import { NextRequest } from "next/server";
import {
  ensureSeededDatabase,
  getAdminDataFromDb,
  getDbConfig,
  runInAppDatabase,
  sqlEscape,
} from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const view = request.nextUrl.searchParams.get("view");
    const cfg = getDbConfig();

    if (view === "admin") {
      const data = await getAdminDataFromDb();
      return Response.json({ ok: true, ...data });
    }

    if (view === "orders") {
      await ensureSeededDatabase();
      const [res] = await runInAppDatabase([
        "SELECT order_id, first_name, last_name, email, phone, city, state, payment_method, total, status, created_at FROM orders ORDER BY id DESC LIMIT 50",
      ]);
      return Response.json({ ok: true, orders: res?.rows ?? [] });
    }

    if (view === "enquiries") {
      await ensureSeededDatabase();
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

    await ensureSeededDatabase();
    const [
      versionRes,
      productsCount,
      ordersCount,
      customersCount,
      categoriesCount,
      collectionsCount,
      reviewsCount,
      enquiriesCount,
      newsletterCount,
    ] = await runInAppDatabase([
      "SELECT VERSION() AS version, DATABASE() AS current_db",
      "SELECT COUNT(*) AS count FROM products",
      "SELECT COUNT(*) AS count FROM orders",
      "SELECT COUNT(*) AS count FROM customers",
      "SELECT COUNT(*) AS count FROM categories",
      "SELECT COUNT(*) AS count FROM collections",
      "SELECT COUNT(*) AS count FROM reviews",
      "SELECT COUNT(*) AS count FROM enquiries",
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
        products: Number(productsCount?.rows?.[0]?.count ?? 0),
        orders: Number(ordersCount?.rows?.[0]?.count ?? 0),
        customers: Number(customersCount?.rows?.[0]?.count ?? 0),
        categories: Number(categoriesCount?.rows?.[0]?.count ?? 0),
        collections: Number(collectionsCount?.rows?.[0]?.count ?? 0),
        reviews: Number(reviewsCount?.rows?.[0]?.count ?? 0),
        enquiries: Number(enquiriesCount?.rows?.[0]?.count ?? 0),
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const entity = String(body?.entity ?? "");
    const action = String(body?.action ?? "");

    await ensureSeededDatabase();

    if (entity === "product") {
      if (action === "create") {
        const [res] = await runInAppDatabase([
          `INSERT INTO products (name, sku, category, price, stock, status, image) VALUES (
            ${sqlEscape(body.name)},
            ${sqlEscape(body.sku)},
            ${sqlEscape(body.category)},
            ${sqlEscape(Number(body.price ?? 0))},
            ${sqlEscape(Number(body.stock ?? 0))},
            ${sqlEscape(body.status ?? "Active")},
            ${sqlEscape(body.image ?? "")}
          )`,
        ]);
        return Response.json({ ok: true, insertId: res?.insertId ?? 0 });
      }
      if (action === "update") {
        await runInAppDatabase([
          `UPDATE products SET
            name = ${sqlEscape(body.name)},
            sku = ${sqlEscape(body.sku)},
            category = ${sqlEscape(body.category)},
            price = ${sqlEscape(Number(body.price ?? 0))},
            stock = ${sqlEscape(Number(body.stock ?? 0))},
            status = ${sqlEscape(body.status)},
            image = ${sqlEscape(body.image)}
          WHERE id = ${sqlEscape(Number(body.id))}`,
        ]);
        return Response.json({ ok: true });
      }
      if (action === "delete") {
        await runInAppDatabase([
          `DELETE FROM products WHERE id = ${sqlEscape(Number(body.id))}`,
        ]);
        return Response.json({ ok: true });
      }
    }

    if (entity === "order" && action === "status") {
      await runInAppDatabase([
        `UPDATE orders SET status = ${sqlEscape(body.status)} WHERE order_id = ${sqlEscape(body.id)}`,
      ]);
      return Response.json({ ok: true });
    }

    if (entity === "customer" && action === "status") {
      await runInAppDatabase([
        `UPDATE customers SET status = ${sqlEscape(body.status)} WHERE id = ${sqlEscape(Number(body.id))}`,
      ]);
      return Response.json({ ok: true });
    }

    if (entity === "category") {
      if (action === "create") {
        const [res] = await runInAppDatabase([
          `INSERT INTO categories (name, slug, description, image, status) VALUES (
            ${sqlEscape(body.name)},
            ${sqlEscape(body.slug)},
            ${sqlEscape(body.description ?? "")},
            ${sqlEscape(body.image ?? "")},
            ${sqlEscape(body.status ?? "Active")}
          )`,
        ]);
        return Response.json({ ok: true, insertId: res?.insertId ?? 0 });
      }
      if (action === "update") {
        await runInAppDatabase([
          `UPDATE categories SET
            name = ${sqlEscape(body.name)},
            slug = ${sqlEscape(body.slug)},
            description = ${sqlEscape(body.description ?? "")},
            image = ${sqlEscape(body.image ?? "")},
            status = ${sqlEscape(body.status ?? "Active")}
          WHERE id = ${sqlEscape(Number(body.id))}`,
        ]);
        return Response.json({ ok: true });
      }
      if (action === "delete") {
        await runInAppDatabase([
          `DELETE FROM categories WHERE id = ${sqlEscape(Number(body.id))}`,
        ]);
        return Response.json({ ok: true });
      }
    }

    if (entity === "collection") {
      if (action === "create") {
        const [res] = await runInAppDatabase([
          `INSERT INTO collections (name, slug, description, image, status, featured) VALUES (
            ${sqlEscape(body.name)},
            ${sqlEscape(body.slug)},
            ${sqlEscape(body.description ?? "")},
            ${sqlEscape(body.image ?? "")},
            ${sqlEscape(body.status ?? "Active")},
            ${sqlEscape(Boolean(body.featured))}
          )`,
        ]);
        return Response.json({ ok: true, insertId: res?.insertId ?? 0 });
      }
      if (action === "update") {
        await runInAppDatabase([
          `UPDATE collections SET
            name = ${sqlEscape(body.name)},
            slug = ${sqlEscape(body.slug)},
            description = ${sqlEscape(body.description ?? "")},
            image = ${sqlEscape(body.image ?? "")},
            status = ${sqlEscape(body.status ?? "Active")},
            featured = ${sqlEscape(Boolean(body.featured))}
          WHERE id = ${sqlEscape(Number(body.id))}`,
        ]);
        return Response.json({ ok: true });
      }
      if (action === "featured") {
        await runInAppDatabase([
          `UPDATE collections SET featured = ${sqlEscape(Boolean(body.featured))} WHERE id = ${sqlEscape(Number(body.id))}`,
        ]);
        return Response.json({ ok: true });
      }
      if (action === "delete") {
        await runInAppDatabase([
          `DELETE FROM collections WHERE id = ${sqlEscape(Number(body.id))}`,
        ]);
        return Response.json({ ok: true });
      }
    }

    if (entity === "review") {
      if (action === "status") {
        await runInAppDatabase([
          `UPDATE reviews SET status = ${sqlEscape(body.status)} WHERE id = ${sqlEscape(Number(body.id))}`,
        ]);
        return Response.json({ ok: true });
      }
      if (action === "delete") {
        await runInAppDatabase([
          `DELETE FROM reviews WHERE id = ${sqlEscape(Number(body.id))}`,
        ]);
        return Response.json({ ok: true });
      }
    }

    if (entity === "enquiry" && action === "status") {
      await runInAppDatabase([
        `UPDATE enquiries SET status = ${sqlEscape(body.status)} WHERE id = ${sqlEscape(Number(body.id))}`,
      ]);
      return Response.json({ ok: true });
    }

    return Response.json(
      { ok: false, error: "Unsupported database mutation." },
      { status: 400 }
    );
  } catch (err) {
    return Response.json(
      {
        ok: false,
        error:
          err instanceof Error ? err.message : "Database mutation failed.",
      },
      { status: 500 }
    );
  }
}
