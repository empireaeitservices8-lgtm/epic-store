"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Inter, Montserrat } from "next/font/google";
import { ArrowRight, Calendar, Package, ShoppingBag, Truck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* Fonts: Montserrat for headings, Inter for body/UI */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const orders = [
  {
    id: "EP20261117001",
    date: "17 Nov 2026",
    items: "Astronaut Space Poster, Abstract Modern Art",
    quantity: 2,
    total: 1147,
    status: "Processing",
    color: "bg-amber-100 text-amber-800",
  },
  {
    id: "EP20261110002",
    date: "10 Nov 2026",
    items: "Vintage Aesthetic Poster",
    quantity: 1,
    total: 448,
    status: "Delivered",
    color: "bg-[#78D94F]/20 text-green-800",
  },
  {
    id: "EP20261028003",
    date: "28 Oct 2026",
    items: "Nature Landscape Print",
    quantity: 1,
    total: 598,
    status: "Shipped",
    color: "bg-sky-100 text-sky-800",
  },
];

const statuses = ["All", "Processing", "Shipped", "Delivered"] as const;

const head = `${montserrat.className} font-[family-name:var(--font-montserrat)]`;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";
const revealCls =
  "translate-y-8 opacity-0 transition-all duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none data-[in=1]:translate-y-0 data-[in=1]:opacity-100";

export default function MyOrdersPage() {
  const [filter, setFilter] = useState<(typeof statuses)[number]>("All");
  const pageRef = useRef<HTMLElement>(null);

  const visibleOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.in = "1";
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filter]);

  return (
    <>
      <Header />

      <main
        ref={pageRef}
        className={`${montserrat.variable} ${inter.variable} min-h-screen bg-[#F7F8F5] font-[family-name:var(--font-inter)]`}
      >
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-5 py-12 text-white md:py-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hero-banners/collections-hero.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right opacity-85"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#17171B]/90 via-[#17171B]/55 to-[#17171B]/15" />
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#78D94F]/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

          <div className="relative mx-auto max-w-7xl">
            <p
              data-reveal
              style={{ transitionDelay: "80ms" }}
              className={`${revealCls} m-0 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#78D94F]`}
            >
              <span className="h-0.5 w-8 bg-[#78D94F]" />
              Purchase History
            </p>
            <h1
              data-reveal
              style={{ transitionDelay: "160ms" }}
              className={`${revealCls} ${head} m-0 mt-4 text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-5xl`}
            >
              My <span className="text-[#78D94F]">Orders</span>
            </h1>
            <p
              data-reveal
              style={{ transitionDelay: "240ms" }}
              className={`${revealCls} m-0 mt-4 max-w-xl text-sm leading-7 text-gray-400 sm:text-base`}
            >
              View your previous purchases and check their delivery status.
            </p>
          </div>
        </section>

        {/* ================= ORDERS LIST ================= */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2
                className={`${head} m-0 text-2xl font-extrabold text-[#17171B] sm:text-3xl`}
              >
                Your Orders
              </h2>
              <p className="m-0 mt-1 text-sm text-gray-500">
                {visibleOrders.length}{" "}
                {visibleOrders.length === 1 ? "order" : "orders"} shown
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div
                role="tablist"
                aria-label="Filter orders by status"
                className="flex flex-wrap gap-1.5 rounded-full border border-gray-200 bg-white p-1"
              >
                {statuses.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="tab"
                    aria-selected={filter === s}
                    onClick={() => setFilter(s)}
                    className={`cursor-pointer rounded-full border-0 px-4 py-2 text-xs font-bold transition ${focus} ${
                      filter === s
                        ? "bg-[#17171B] text-white"
                        : "bg-transparent text-gray-500 hover:text-[#17171B]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <Link
                href="/shop"
                className={`group inline-flex items-center gap-2 rounded-full bg-[#17171B] px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white no-underline transition hover:bg-[#78D94F] hover:text-[#17171B] ${focus}`}
              >
                <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="space-y-5">
            {visibleOrders.map((order, idx) => (
              <article
                key={order.id}
                data-reveal
                style={{ transitionDelay: `${Math.min(idx, 3) * 70}ms` }}
                className={`${revealCls} rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] transition duration-300 hover:border-[#78D94F] hover:shadow-[0_10px_30px_rgba(120,217,79,0.12)] sm:p-8`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-5">
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#78D94F]/15 text-[#17171B]">
                      <Package className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="m-0 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                        Order ID
                      </p>
                      <h3
                        className={`${head} m-0 mt-1 break-all text-lg font-extrabold text-[#17171B]`}
                      >
                        {order.id}
                      </h3>
                      <p className="m-0 mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        Placed on {order.date}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-4 py-1.5 text-xs font-bold ${order.color}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="grid gap-5 py-6 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <p className="m-0 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                      Products
                    </p>
                    <p className="m-0 mt-2 font-semibold leading-6 text-[#17171B]">
                      {order.items}
                    </p>
                    <p className="m-0 mt-1 text-sm text-gray-500">
                      {order.quantity} {order.quantity === 1 ? "item" : "items"}
                    </p>
                  </div>

                  <div>
                    <p className="m-0 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                      Total Amount
                    </p>
                    <p
                      className={`${head} m-0 mt-2 text-2xl font-extrabold text-[#17171B]`}
                    >
                      ₹{order.total.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
                  <Link
                    href={`/my-orders/${order.id}`}
                    className={`group inline-flex items-center gap-2 rounded-full bg-[#17171B] px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white no-underline transition hover:bg-[#78D94F] hover:text-[#17171B] ${focus}`}
                  >
                    View Order Details
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>

                  <Link
                    href="/track-order"
                    className={`inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#17171B] no-underline transition hover:border-[#78D94F] ${focus}`}
                  >
                    <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                    Track Order
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div
            data-reveal
            className={`${revealCls} mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5`}
          >
            <p className={`${head} m-0 text-sm font-bold text-amber-900`}>
              Demo Data
            </p>
            <p className="m-0 mt-1 text-sm leading-6 text-amber-800">
              These orders are sample records for presentation. Actual order
              history will be loaded from the database after backend
              integration.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
