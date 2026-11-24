"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Inter, Montserrat } from "next/font/google";
import { ArrowRight, Check, Package, Search, Truck } from "lucide-react";
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

const trackingSteps = [
  {
    title: "Order Placed",
    description: "Your order has been received successfully.",
    date: "19 Nov 2026",
    completed: true,
  },
  {
    title: "Order Confirmed",
    description: "Your order is confirmed and being prepared.",
    date: "19 Nov 2026",
    completed: true,
  },
  {
    title: "Packed & Ready",
    description: "Your items have been packed for dispatch.",
    date: "Expected soon",
    completed: false,
  },
  {
    title: "Out for Delivery",
    description: "Your package is on its way to your address.",
    date: "Pending",
    completed: false,
  },
  {
    title: "Delivered",
    description: "Your order will be delivered successfully.",
    date: "Pending",
    completed: false,
  },
];

const head = `${montserrat.className} font-[family-name:var(--font-montserrat)]`;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";
const revealCls =
  "translate-y-8 opacity-0 transition-all duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none data-[in=1]:translate-y-0 data-[in=1]:opacity-100";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const pageRef = useRef<HTMLElement>(null);

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
  }, [searched]);

  const handleTrackOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!orderId.trim()) {
      setError("Please enter your order ID.");
      setSearched(false);
      return;
    }

    setError("");
    setSearched(true);
  };

  return (
    <>
      <Header />

      <main
        ref={pageRef}
        className={`${montserrat.variable} ${inter.variable} min-h-screen bg-[#F7F8F5] font-[family-name:var(--font-inter)]`}
      >
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-5 py-12 text-center md:py-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hero-banners/custom-prints-hero.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-80"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#17171B]/55 via-[#17171B]/45 to-[#17171B]/75" />
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#78D94F]/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

          <div className="relative mx-auto max-w-3xl">
            <p
              data-reveal
              style={{ transitionDelay: "80ms" }}
              className={`${revealCls} flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#78D94F]`}
            >
              <span className="h-0.5 w-8 bg-[#78D94F]" />
              Order Updates
              <span className="h-0.5 w-8 bg-[#78D94F]" />
            </p>

            <h1
              data-reveal
              style={{ transitionDelay: "160ms" }}
              className={`${revealCls} ${head} mt-4 text-4xl font-extrabold uppercase leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl`}
            >
              Track Your <span className="text-[#78D94F]">Order</span>
            </h1>

            <p
              data-reveal
              style={{ transitionDelay: "240ms" }}
              className={`${revealCls} mx-auto mt-5 max-w-xl leading-7 text-gray-400`}
            >
              Check your order progress and stay updated on its journey to your
              doorstep.
            </p>
          </div>
        </section>

        {/* ================= TRACKER FORM & RESULTS ================= */}
        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-12">
          <div
            data-reveal
            className={`${revealCls} rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:p-10`}
          >
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#78D94F]/20 text-[#17171B]">
                <Package className="h-7 w-7" strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h2
                className={`${head} m-0 mt-5 text-2xl font-extrabold text-[#17171B] sm:text-3xl`}
              >
                Where is your package?
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Enter your order ID to view its current status.
              </p>
            </div>

            <form onSubmit={handleTrackOrder} className="mt-8">
              <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                Order ID
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex min-w-0 flex-1 items-center rounded-full border border-gray-200 px-5 transition focus-within:border-[#78D94F]">
                  <Search
                    className="h-4 w-4 shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => {
                      setOrderId(e.target.value);
                      setError("");
                      setSearched(false);
                    }}
                    placeholder="Example: IFE-20261123"
                    className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3.5 text-sm outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className={`group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-[#17171B] px-8 py-4 text-sm font-bold tracking-[0.08em] text-white transition hover:bg-[#78D94F] hover:text-[#17171B] ${focus}`}
                >
                  TRACK ORDER
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                <span>
                  Demo tip:{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setOrderId("EP20261117001");
                      setError("");
                      setSearched(true);
                    }}
                    className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#17171B] underline decoration-[#78D94F] underline-offset-4 hover:text-green-700"
                  >
                    Try EP20261117001
                  </button>
                </span>
                {error && (
                  <span role="alert" className="font-semibold text-red-600">
                    {error}
                  </span>
                )}
              </div>
            </form>
          </div>

          {searched && (
            <div
              data-reveal
              className={`${revealCls} mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:p-10`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                  <p className="m-0 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                    Tracking Order
                  </p>
                  <h2
                    className={`${head} m-0 mt-1 text-2xl font-extrabold text-[#17171B]`}
                  >
                    {orderId}
                  </h2>
                </div>

                <span className="inline-flex items-center gap-2 rounded-full bg-[#78D94F]/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-green-800">
                  <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                  Processing
                </span>
              </div>

              <div className="mt-8">
                <h3
                  className={`${head} m-0 text-lg font-extrabold text-[#17171B]`}
                >
                  Delivery Progress
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Sample tracking information for your website demo.
                </p>

                <div className="mt-8">
                  {trackingSteps.map((step, index) => (
                    <div
                      key={step.title}
                      className="relative flex gap-5 pb-9 last:pb-0"
                    >
                      {index !== trackingSteps.length - 1 && (
                        <div
                          className={`absolute left-[15px] top-8 h-full w-0.5 ${
                            step.completed ? "bg-[#78D94F]" : "bg-gray-200"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                          step.completed
                            ? "bg-[#78D94F] text-[#17171B]"
                            : "border-2 border-gray-200 bg-white text-gray-400"
                        }`}
                      >
                        {step.completed ? (
                          <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                        ) : (
                          index + 1
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4
                            className={`${head} m-0 font-bold ${
                              step.completed
                                ? "text-[#17171B]"
                                : "text-gray-400"
                            }`}
                          >
                            {step.title}
                          </h4>
                          <span className="text-xs font-medium text-gray-400">
                            {step.date}
                          </span>
                        </div>
                        <p className="m-0 mt-1 text-sm leading-6 text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-[#F7F8F5] p-5">
                <p className={`${head} m-0 text-sm font-bold text-[#17171B]`}>
                  Need help with your order?
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Contact our support team if you have questions about your
                  delivery.
                </p>
                <Link
                  href="/contact"
                  className={`group mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#17171B] no-underline transition hover:text-green-700 ${focus}`}
                >
                  Contact Support
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="m-0 text-sm text-gray-500">Do not have an order ID?</p>
            <Link
              href="/shop"
              className="mt-2 inline-block text-sm font-bold text-[#17171B] underline decoration-[#78D94F] decoration-2 underline-offset-4 hover:text-green-700"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
