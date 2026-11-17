"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Inter, Syne } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* Fonts: Syne for headings, Inter for body/UI */
const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

/* TODO: replace the sample data below with the real order from your API */
const orderItems = [
  {
    id: 1,
    name: "Astronaut Space Poster",
    category: "Posters",
    price: 499,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400",
  },
  {
    id: 2,
    name: "Abstract Modern Art",
    category: "Canvas Prints",
    price: 599,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
  },
];

const customer = {
  name: "Alex Johnson",
  email: "alex@example.com",
  phone: "+91 98765 43210",
};

const deliveryAddress = {
  address: "123, Sample Street, Near City Centre",
  city: "Kochi",
  state: "Kerala",
  pincode: "682001",
  country: "India",
};

const steps = [
  { number: "01", title: "Order Placed", description: "Order received" },
  { number: "02", title: "Processing", description: "Preparing order" },
  { number: "03", title: "Delivered", description: "On its way" },
];

/* Confetti burst: fixed angles so server and client render the same */
const confetti = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const dist = i % 2 === 0 ? 120 : 82;
  return {
    x: Math.round(Math.cos(angle) * dist),
    y: Math.round(Math.sin(angle) * dist),
    size: i % 3 === 0 ? 10 : 7,
    color: i % 4 === 0 ? "bg-[#17171B]" : "bg-[#78D94F]",
    round: i % 2 === 0,
  };
});

const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";
const rupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const card =
  "rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] md:p-8";

export default function OrderSuccessPage() {
  const [orderId, setOrderId] = useState("EP20261117001");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Read ?orderId= and ?payment= without needing a Suspense wrapper */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const id = p.get("orderId");
    const pay = p.get("payment");
    if (id) setOrderId(id.slice(0, 40));
    if (pay) setPaymentMethod(pay);
    const t = setTimeout(() => setReady(true), 80);
    return () => {
      clearTimeout(t);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const subtotal = orderItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const delivery = subtotal >= 999 ? 0 : 49;
  const total = subtotal + delivery;
  const itemCount = orderItems.reduce((n, i) => n + i.quantity, 0);
  const isCod = paymentMethod === "cod";

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable: ignore */
    }
  };

  const reveal = (delay: number) => ({
    style: { transitionDelay: ready ? `${delay}ms` : "0ms" },
  });
  const revealCls = `transition-all duration-700 ${
    ready ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
  }`;

  return (
    <>
      <Header />

      <main
        className={`${syne.variable} ${inter.variable} min-h-screen bg-[#F7F8F5] font-[family-name:var(--font-inter)]`}
      >
        {/* ================= SUCCESS BANNER ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-5 py-16 text-center md:py-24 print:bg-white print:py-8">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#78D94F]/15 blur-3xl print:hidden" />
          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#78D94F]/10 blur-3xl print:hidden" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] print:hidden" />

          <div className="relative mx-auto max-w-3xl">
            {/* Animated check + confetti burst */}
            <div className="relative mx-auto grid h-24 w-24 place-items-center">
              <div aria-hidden="true" className="absolute inset-0 print:hidden">
                {confetti.map((c, i) => (
                  <span
                    key={i}
                    className={`absolute left-1/2 top-1/2 ${c.color} ${
                      c.round ? "rounded-full" : "rounded-sm"
                    }`}
                    style={{
                      width: c.size,
                      height: c.size,
                      marginLeft: -c.size / 2,
                      marginTop: -c.size / 2,
                      opacity: ready ? 0 : 1,
                      transform: ready
                        ? `translate(${c.x}px, ${c.y}px) rotate(${i * 40}deg)`
                        : "translate(0, 0)",
                      transition:
                        "transform 900ms cubic-bezier(0.2,0.7,0.2,1), opacity 500ms ease 550ms",
                    }}
                  />
                ))}
              </div>

              <div
                className={`relative grid h-24 w-24 place-items-center rounded-full bg-[#78D94F] shadow-[0_10px_40px_rgba(120,217,79,0.45)] transition-transform duration-700 ease-[cubic-bezier(0.3,1.5,0.5,1)] ${
                  ready ? "scale-100" : "scale-0"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-12 w-12 text-[#17171B]"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12.5L10 17L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={ready ? 0 : 1}
                    style={{ transition: "stroke-dashoffset 700ms ease 350ms" }}
                  />
                </svg>
              </div>
            </div>

            <p
              {...reveal(200)}
              className={`${revealCls} mt-8 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#78D94F] print:text-green-700`}
            >
              <span className="h-0.5 w-8 bg-[#78D94F]" />
              Order Confirmed
              <span className="h-0.5 w-8 bg-[#78D94F]" />
            </p>

            <h1
              {...reveal(300)}
              className={`${revealCls} ${head} mt-4 text-4xl font-extrabold uppercase leading-[1.02] tracking-tight text-white sm:text-5xl print:text-[#17171B]`}
            >
              Thank You for <span className="text-[#78D94F]">Your Order!</span>
            </h1>

            <p
              {...reveal(400)}
              className={`${revealCls} mx-auto mt-5 max-w-xl leading-7 text-gray-400 print:text-gray-600`}
            >
              Your order has been placed successfully. We appreciate your
              purchase and look forward to delivering your favourite products.
            </p>

            {/* Order number + total */}
            <div
              {...reveal(500)}
              className={`${revealCls} mt-9 inline-flex flex-col items-stretch rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-5 text-left backdrop-blur-sm sm:flex-row sm:items-center sm:gap-8 print:border-gray-200 print:bg-gray-50`}
            >
              <div>
                <p className="m-0 text-xs uppercase tracking-[0.18em] text-gray-400">
                  Order Number
                </p>
                <div className="mt-1 flex items-center gap-3">
                  <p
                    className={`${head} m-0 break-all text-lg font-bold text-white print:text-[#17171B]`}
                  >
                    {orderId}
                  </p>
                  <button
                    type="button"
                    onClick={copyOrderId}
                    aria-label="Copy order number"
                    className={`cursor-pointer rounded-full border border-white/20 bg-transparent px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-[#78D94F] transition duration-300 hover:border-[#78D94F] hover:bg-[#78D94F] hover:text-[#17171B] print:hidden ${focus}`}
                  >
                    {copied ? "COPIED ✓" : "COPY"}
                  </button>
                </div>
              </div>

              <div className="my-4 h-px w-full bg-white/10 sm:my-0 sm:h-10 sm:w-px" />

              <div>
                <p className="m-0 text-xs uppercase tracking-[0.18em] text-gray-400">
                  Order Total
                </p>
                <p
                  className={`${head} m-0 mt-1 text-lg font-bold text-white print:text-[#17171B]`}
                >
                  {rupee(total)}
                </p>
              </div>
            </div>

            <p
              {...reveal(600)}
              className={`${revealCls} mt-5 text-sm text-gray-500`}
            >
              A confirmation message will be sent once your order is
              successfully recorded.
            </p>
          </div>
        </section>

        {/* ================= ORDER DETAILS ================= */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left */}
            <div className="space-y-6 lg:col-span-2">
              {/* Progress */}
              <div {...reveal(100)} className={`${card} ${revealCls}`}>
                <h2 className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}>
                  Order Progress
                </h2>

                <ol className="m-0 mt-8 grid list-none grid-cols-3 gap-3 p-0">
                  {steps.map((step, index) => {
                    const done = index === 0;
                    const current = index === 1;
                    return (
                      <li key={step.number} className="relative text-center">
                        {/* connector line */}
                        {index < steps.length - 1 && (
                          <span
                            aria-hidden="true"
                            className="absolute left-1/2 top-[22px] h-0.5 w-full bg-gray-100"
                          >
                            <span
                              className={`block h-full bg-[#78D94F] transition-all duration-1000 ease-out ${
                                ready && done ? "w-full" : "w-0"
                              }`}
                              style={{ transitionDelay: "700ms" }}
                            />
                          </span>
                        )}

                        <div
                          className={`relative mx-auto grid h-11 w-11 place-items-center rounded-full text-sm font-bold transition-colors duration-500 ${head} ${
                            done
                              ? "bg-[#78D94F] text-[#17171B]"
                              : current
                              ? "border-2 border-[#78D94F] bg-white text-[#17171B]"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {current && (
                            <span className="absolute inset-0 animate-ping rounded-full border border-[#78D94F] motion-reduce:animate-none" />
                          )}
                          {done ? "✓" : step.number}
                        </div>

                        <h3
                          className={`${head} m-0 mt-3 text-xs font-bold sm:text-sm ${
                            done || current ? "text-[#17171B]" : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p className="m-0 mt-1 text-[10px] text-gray-400 sm:text-xs">
                          {step.description}
                        </p>
                      </li>
                    );
                  })}
                </ol>

                <p className="mb-0 mt-7 rounded-2xl bg-[#78D94F]/15 p-4 text-sm leading-6 text-[#17171B]">
                  Your order confirmation is displayed here. Processing and
                  delivery updates will appear when order tracking is
                  connected.
                </p>
              </div>

              {/* Products */}
              <div {...reveal(200)} className={`${card} ${revealCls}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}>
                    Ordered Products
                  </h2>
                  <span className="rounded-full bg-[#F7F8F5] px-3 py-1 text-xs font-semibold text-gray-500">
                    {itemCount} {itemCount === 1 ? "Item" : "Items"}
                  </span>
                </div>

                <ul className="m-0 mt-7 list-none space-y-5 p-0">
                  {orderItems.map((item) => (
                    <li
                      key={item.id}
                      className="group flex flex-col gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0 sm:flex-row sm:items-center"
                    >
                      <Link
                        href={`/products/${item.id}`}
                        aria-label={item.name}
                        className={`block h-28 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-24 ${focus}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </Link>

                      <div className="flex flex-1 items-center justify-between gap-4">
                        <div>
                          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                            {item.category}
                          </p>
                          <h3 className={`${head} m-0 mt-2 font-bold text-[#17171B]`}>
                            {item.name}
                          </h3>
                          <p className="m-0 mt-2 text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className={`${head} m-0 text-lg font-extrabold text-[#17171B]`}>
                          {rupee(item.price * item.quantity)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customer + address */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div {...reveal(300)} className={`${card} !p-6 ${revealCls}`}>
                  <h2 className={`${head} m-0 font-extrabold text-[#17171B]`}>
                    Customer Information
                  </h2>
                  <div className="mt-5 space-y-3 text-sm">
                    <p className="m-0 font-semibold text-[#17171B]">{customer.name}</p>
                    <p className="m-0 break-all text-gray-500">{customer.email}</p>
                    <p className="m-0 text-gray-500">{customer.phone}</p>
                  </div>
                </div>

                <div {...reveal(400)} className={`${card} !p-6 ${revealCls}`}>
                  <h2 className={`${head} m-0 font-extrabold text-[#17171B]`}>
                    Delivery Address
                  </h2>
                  <address className="mt-5 space-y-1 text-sm not-italic leading-6 text-gray-500">
                    <p className="m-0">{customer.name}</p>
                    <p className="m-0">{deliveryAddress.address}</p>
                    <p className="m-0">
                      {deliveryAddress.city}, {deliveryAddress.state}
                    </p>
                    <p className="m-0">
                      {deliveryAddress.pincode}, {deliveryAddress.country}
                    </p>
                  </address>
                </div>
              </div>
            </div>

            {/* Right: summary */}
            <aside>
              <div
                {...reveal(250)}
                className={`${revealCls} rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] lg:sticky lg:top-28`}
              >
                <h2 className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}>
                  Order Summary
                </h2>

                <dl className="m-0 mt-7 space-y-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Subtotal</dt>
                    <dd className="m-0 font-semibold">{rupee(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Delivery Charges</dt>
                    <dd className="m-0 font-semibold">
                      {delivery === 0 ? (
                        <span className="text-green-700">FREE</span>
                      ) : (
                        rupee(delivery)
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="my-6 border-t border-dashed border-gray-200" />

                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#17171B]">
                    {isCod ? "Total Due" : "Total Paid"}
                  </span>
                  <span className={`${head} text-3xl font-extrabold text-[#17171B]`}>
                    {rupee(total)}
                  </span>
                </div>

                <div className="mt-7 rounded-2xl bg-[#F7F8F5] p-4">
                  <p className="m-0 text-xs uppercase tracking-[0.18em] text-gray-400">
                    Payment Method
                  </p>
                  <p className={`${head} m-0 mt-2 font-bold text-[#17171B]`}>
                    {isCod ? "Cash on Delivery" : "Online Payment"}
                  </p>
                  <p className="m-0 mt-2 text-xs text-gray-500">
                    {isCod
                      ? "Payment due on delivery"
                      : "Payment status requires server verification"}
                  </p>
                </div>

                <div className="mt-5 rounded-2xl border border-gray-200 p-4 print:hidden">
                  <p className={`${head} m-0 text-sm font-bold text-[#17171B]`}>
                    Need Help?
                  </p>
                  <p className="m-0 mt-2 text-xs leading-5 text-gray-500">
                    Contact our support team if you have questions about your
                    order.
                  </p>
                  <Link
                    href="/contact"
                    className={`group mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#17171B] no-underline transition hover:text-green-700 ${focus}`}
                  >
                    Contact Support
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {/* Bottom actions */}
          <div
            {...reveal(500)}
            className={`${revealCls} mt-10 flex flex-col justify-center gap-4 sm:flex-row print:hidden`}
          >
            <Link
              href="/shop"
              className={`group inline-flex items-center justify-center gap-3 rounded-full bg-[#78D94F] px-9 py-4 text-sm font-bold tracking-[0.1em] text-[#17171B] no-underline shadow-[0_10px_30px_rgba(120,217,79,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#17171B] hover:text-white ${focus}`}
            >
              CONTINUE SHOPPING
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </Link>

            <Link
              href="/track-order"
              className={`inline-flex items-center justify-center rounded-full border border-[#17171B]/20 bg-white px-9 py-4 text-sm font-bold tracking-[0.1em] text-[#17171B] no-underline transition duration-300 hover:-translate-y-0.5 hover:border-[#17171B] ${focus}`}
            >
              TRACK ORDER
            </Link>

            <button
              type="button"
              onClick={() => window.print()}
              className={`cursor-pointer rounded-full border border-[#17171B] bg-transparent px-9 py-4 text-sm font-bold tracking-[0.1em] text-[#17171B] transition duration-300 hover:-translate-y-0.5 hover:bg-[#17171B] hover:text-white ${focus}`}
            >
              PRINT ORDER DETAILS
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-gray-400">
            Sample order details are shown on this page until it is connected
            to your order system.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}