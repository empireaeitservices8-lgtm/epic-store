"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

const shippingSteps = [
  {
    number: "01",
    title: "Order Placed",
    description:
      "Your order is successfully placed and our team receives your order details.",
  },
  {
    number: "02",
    title: "Order Processing",
    description:
      "Your products are prepared, checked, and packed for dispatch.",
  },
  {
    number: "03",
    title: "Order Dispatched",
    description: "Your package is handed over to our delivery partner.",
  },
  {
    number: "04",
    title: "Delivered",
    description: "Your order reaches your delivery address.",
  },
];

const deliveryFeatures = [
  {
    icon: "box" as const,
    title: "Safe Packaging",
    description:
      "Products are packed carefully to help protect them during transportation.",
  },
  {
    icon: "truck" as const,
    title: "Reliable Delivery",
    description:
      "We work with delivery partners to get your orders to your doorstep.",
  },
  {
    icon: "pin" as const,
    title: "Order Tracking",
    description:
      "Where tracking is available, you can follow your shipment using the shared tracking details.",
  },
];

const chargeFactors = [
  "Delivery location",
  "Order value",
  "Product dimensions",
  "Available delivery services",
];

const shippingFaqs = [
  {
    question: "How long does delivery take?",
    answer:
      "Delivery timelines depend on your location, product availability, order processing, and courier service. The estimated delivery date will be communicated when available.",
  },
  {
    question: "How much are the shipping charges?",
    answer:
      "Applicable shipping charges will be displayed during checkout before you confirm your order. Any free-shipping offers will also be shown there.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Once your order is dispatched, tracking information will be shared if tracking is supported by the delivery partner.",
  },
  {
    question: "What if I am not available during delivery?",
    answer:
      "The delivery partner may contact you or attempt delivery again according to its delivery procedures. Please ensure that your contact number and address are correct.",
  },
  {
    question: "What should I do if my package is damaged?",
    answer:
      "Please contact our support team as soon as possible. Share your order number and clear photographs of the package and product so that we can assist you.",
  },
];

/* Shared class strings */
const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";
/* Scroll-reveal: an observer sets data-in="1" on [data-reveal] elements */
const rv =
  "opacity-0 translate-y-8 transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] data-[in=1]:translate-y-0 data-[in=1]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100";
const eyebrow =
  "flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em]";
const btnGreen = `group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-[#78D94F] px-8 py-4 text-sm font-bold tracking-[0.1em] text-[#17171B] no-underline shadow-[0_10px_30px_rgba(120,217,79,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-white ${focus}`;
const shine =
  "absolute inset-0 -translate-x-[120%] bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.6)_50%,transparent_70%)] transition-transform duration-700 group-hover:translate-x-[120%]";

const icons = {
  box: (
    <>
      <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" />
      <path d="M3 7.5 12 12l9-4.5M12 12v9" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v10H3z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  rupee: <path d="M7 5h10M7 9h10M7 5c5 0 6 2.5 6 4s-1 4-6 4l7 6" />,
};

function Icon({ name, size = 24 }: { name: keyof typeof icons; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

/* Cursor spotlight for cards (no re-renders) */
function spot(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--x", `${e.clientX - r.left}px`);
  el.style.setProperty("--y", `${e.clientY - r.top}px`);
}

export default function ShippingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const pageRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  /* One observer reveals every [data-reveal] element */
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
      { threshold: 0.12 }
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Hero cursor glow */
  const onHeroMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const delay = (ms: number) => ({ transitionDelay: `${ms}ms` });

  return (
    <>
      <Header />

      <main
        ref={pageRef}
        className={`${syne.variable} ${inter.variable} min-h-screen bg-white font-[family-name:var(--font-inter)]`}
      >
        {/* ================= HERO ================= */}
        <section
          ref={heroRef}
          onMouseMove={onHeroMove}
          className="relative overflow-hidden bg-[#17171B] px-4 py-14 text-white sm:px-6 sm:py-20 md:py-28"
        >
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#78D94F]/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--x,70%)_var(--y,30%),rgba(120,217,79,0.12),transparent_40%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
          <span
            aria-hidden="true"
            className={`${head} pointer-events-none absolute -right-4 bottom-0 select-none text-[clamp(110px,24vw,380px)] font-extrabold leading-[0.8] text-white/[0.03]`}
          >
            SHIP
          </span>

          <div className="relative mx-auto max-w-5xl text-center">
            <nav
              aria-label="Breadcrumb"
              data-reveal
              className={`${rv} mb-6 flex items-center justify-center gap-2 text-xs font-medium tracking-[0.14em] text-gray-400`}
            >
              <Link
                href="/"
                className={`text-gray-400 no-underline transition hover:text-[#78D94F] ${focus}`}
              >
                HOME
              </Link>
              <span>/</span>
              <span className="text-white">SHIPPING</span>
            </nav>

            <span
              data-reveal
              style={delay(80)}
              className={`${rv} mb-5 inline-flex items-center rounded-full border border-[#78D94F]/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#78D94F]`}
            >
              Customer Information
            </span>

            <h1
              data-reveal
              style={delay(160)}
              className={`${rv} ${head} text-[34px] font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-6xl`}
            >
              Shipping &amp;{" "}
              <span className="text-[#78D94F]">Delivery</span>
            </h1>

            <p
              data-reveal
              style={delay(260)}
              className={`${rv} mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-gray-300 sm:mt-6 sm:text-base sm:leading-8 md:text-lg`}
            >
              We want your shopping experience to be simple from checkout to
              delivery. Find out how we process, pack, and deliver your Epic
              Store orders.
            </p>

            <div
              data-reveal
              style={delay(340)}
              className={`${rv} mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-4`}
            >
              <Link href="/shop" className={btnGreen}>
                <span aria-hidden="true" className={shine} />
                <span className="relative">EXPLORE PRODUCTS</span>
                <span className="relative transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>

              <Link
                href="/contact"
                className={`inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 text-sm font-bold tracking-[0.1em] text-white no-underline transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#17171B] ${focus}`}
              >
                CONTACT SUPPORT
              </Link>
            </div>
          </div>
        </section>

        {/* ================= INTRODUCTION ================= */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-10">
          <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-14">
            <div>
              <p
                data-reveal
                className={`${rv} ${eyebrow} m-0 text-green-700`}
              >
                <span className="h-0.5 w-10 bg-[#78D94F]" />
                Delivery Information
              </p>

              <h2
                data-reveal
                style={delay(80)}
                className={`${rv} ${head} mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-[#17171B] sm:text-4xl`}
              >
                Your Order, Delivered With Care
              </h2>

              <p
                data-reveal
                style={delay(160)}
                className={`${rv} mt-6 text-[15px] leading-7 text-gray-600 sm:text-base sm:leading-8`}
              >
                At Epic Store, we aim to make every order a smooth experience.
                From order confirmation to final delivery, we focus on careful
                packaging and reliable delivery arrangements.
              </p>

              <p
                data-reveal
                style={delay(220)}
                className={`${rv} mt-4 text-[15px] leading-7 text-gray-600 sm:text-base sm:leading-8`}
              >
                Delivery availability, estimated timelines, and applicable
                shipping charges may vary depending on your location and the
                products ordered.
              </p>

              <div data-reveal style={delay(280)} className={rv}>
                <Link
                  href="/contact"
                  className={`group mt-7 inline-flex items-center gap-2 font-bold text-[#17171B] no-underline transition hover:text-green-700 ${focus}`}
                >
                  Need delivery assistance?
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </Link>
              </div>
            </div>

            <div data-reveal style={delay(120)} className={`${rv} relative`}>
              <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border-2 border-[#78D94F]/60" />

              <div className="group relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-[#17171B] p-8 text-center sm:p-10 md:min-h-[420px]">
                <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-[#78D94F]/20 blur-3xl" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

                <span className="relative grid h-24 w-24 place-items-center rounded-3xl bg-[#78D94F] text-[#17171B] shadow-[0_15px_40px_rgba(120,217,79,0.35)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon name="box" size={46} />
                </span>

                <h3
                  className={`${head} relative mt-7 text-2xl font-extrabold text-white`}
                >
                  Delivered With Care
                </h3>
                <p className="relative mt-3 text-gray-400">
                  From our store to your doorstep.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= DELIVERY FEATURES ================= */}
        <section className="bg-[#F7F8F5] px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
              <p
                data-reveal
                className={`${rv} ${eyebrow} m-0 justify-center text-green-700`}
              >
                <span className="h-0.5 w-8 bg-[#78D94F]" />
                Our Delivery Promise
                <span className="h-0.5 w-8 bg-[#78D94F]" />
              </p>

              <h2
                data-reveal
                style={delay(80)}
                className={`${rv} ${head} mt-3 text-3xl font-extrabold tracking-tight text-[#17171B] sm:text-4xl`}
              >
                A Better Delivery Experience
              </h2>

              <p
                data-reveal
                style={delay(160)}
                className={`${rv} mt-4 text-[15px] leading-7 text-gray-500 sm:text-base`}
              >
                We focus on the important details that help make receiving your
                order easier.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3 md:gap-6">
              {deliveryFeatures.map((feature, i) => (
                <div
                  key={feature.title}
                  data-reveal
                  style={delay(i * 100)}
                  onMouseMove={spot}
                  className={`${rv} group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 hover:-translate-y-1.5 hover:border-[#78D94F] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] sm:p-8`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(300px_circle_at_var(--x,50%)_var(--y,50%),rgba(120,217,79,0.14),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-[#78D94F]/15 text-[#17171B] transition duration-300 group-hover:-rotate-6 group-hover:bg-[#78D94F]">
                    <Icon name={feature.icon} size={28} />
                  </span>

                  <h3
                    className={`${head} relative mt-6 text-xl font-extrabold text-[#17171B]`}
                  >
                    {feature.title}
                  </h3>

                  <p className="relative mt-3 text-[15px] leading-7 text-gray-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= HOW DELIVERY WORKS ================= */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center sm:mb-14">
              <p
                data-reveal
                className={`${rv} ${eyebrow} m-0 justify-center text-green-700`}
              >
                <span className="h-0.5 w-8 bg-[#78D94F]" />
                Simple Process
                <span className="h-0.5 w-8 bg-[#78D94F]" />
              </p>

              <h2
                data-reveal
                style={delay(80)}
                className={`${rv} ${head} mt-3 text-3xl font-extrabold tracking-tight text-[#17171B] sm:text-4xl`}
              >
                How Your Delivery Works
              </h2>

              <p
                data-reveal
                style={delay(160)}
                className={`${rv} mt-4 text-[15px] text-gray-500 sm:text-base`}
              >
                Four simple steps from placing your order to receiving it.
              </p>
            </div>

            {/* Vertical timeline on mobile, horizontal from md up */}
            <ol className="m-0 grid list-none p-0 md:grid-cols-4 md:gap-6">
              {shippingSteps.map((step, i) => (
                <li
                  key={step.number}
                  data-reveal
                  style={delay(i * 120)}
                  className={`${rv} group relative flex gap-5 pb-10 last:pb-0 md:flex-col md:items-center md:pb-0 md:text-center`}
                >
                  {i < shippingSteps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-[-8px] left-[27px] top-[64px] w-0.5 overflow-hidden bg-gray-200 md:bottom-auto md:left-[calc(50%+48px)] md:top-10 md:h-0.5 md:w-[calc(100%-72px)]"
                    >
                      <span
                        style={delay(500 + i * 150)}
                        className="block h-full w-full origin-top scale-y-0 bg-[#78D94F] transition-transform duration-1000 ease-out group-data-[in=1]:scale-y-100 md:origin-left md:scale-y-100 md:scale-x-0 md:group-data-[in=1]:scale-x-100"
                      />
                    </span>
                  )}

                  <span
                    className={`${head} relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#78D94F] text-base font-extrabold text-[#17171B] shadow-[0_10px_25px_rgba(120,217,79,0.3)] transition duration-300 group-hover:scale-110 md:h-20 md:w-20 md:text-xl`}
                  >
                    {step.number}
                  </span>

                  <div className="pt-1 md:pt-0">
                    <h3
                      className={`${head} m-0 text-lg font-extrabold text-[#17171B] md:mt-6`}
                    >
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-gray-500 md:mt-3">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ================= SHIPPING CHARGES ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-4 py-12 text-white sm:px-6 sm:py-16 md:py-20 lg:px-10">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#78D94F]/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <p
                data-reveal
                className={`${rv} ${eyebrow} m-0 text-[#78D94F]`}
              >
                <span className="h-0.5 w-10 bg-[#78D94F]" />
                Shipping Charges
              </p>

              <h2
                data-reveal
                style={delay(80)}
                className={`${rv} ${head} mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl`}
              >
                Transparent Shipping Information
              </h2>

              <p
                data-reveal
                style={delay(160)}
                className={`${rv} mt-5 text-[15px] leading-7 text-gray-300 sm:text-base sm:leading-8`}
              >
                Shipping charges may depend on your delivery location, order
                value, product dimensions, and available delivery services.
              </p>

              <p
                data-reveal
                style={delay(220)}
                className={`${rv} mt-4 text-[15px] leading-7 text-gray-300 sm:text-base sm:leading-8`}
              >
                Any applicable shipping fee or promotional discount will be
                clearly displayed in your order summary before payment.
              </p>
            </div>

            <div
              data-reveal
              style={delay(160)}
              onMouseMove={spot}
              className={`${rv} group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 md:p-10`}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(360px_circle_at_var(--x,50%)_var(--y,0%),rgba(120,217,79,0.16),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex items-center gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[#78D94F] text-[#17171B] transition-transform duration-500 group-hover:-rotate-6">
                  <Icon name="rupee" size={26} />
                </span>

                <div>
                  <h3 className={`${head} m-0 text-xl font-extrabold`}>
                    Shipping Fee
                  </h3>
                  <p className="m-0 mt-1 text-sm text-gray-400">
                    Displayed at checkout
                  </p>
                </div>
              </div>

              <div className="relative my-6 border-t border-white/10" />

              <p className="relative m-0 mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                What it may depend on
              </p>

              <ul className="relative m-0 flex list-none flex-wrap gap-2.5 p-0">
                {chargeFactors.map((f) => (
                  <li
                    key={f}
                    className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-medium text-gray-200 transition duration-300 hover:border-[#78D94F]/60 hover:text-white"
                  >
                    {f}
                  </li>
                ))}
              </ul>

              <p className="relative mb-0 mt-6 text-[15px] leading-7 text-gray-300">
                Check your final order summary before placing your order to see
                the applicable delivery charges.
              </p>

              <Link
                href="/shop"
                className={`group/link relative mt-6 inline-flex items-center gap-2 font-bold text-[#78D94F] no-underline transition hover:text-white ${focus}`}
              >
                Start Shopping
                <span className="transition-transform duration-300 group-hover/link:translate-x-1.5">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ================= DELIVERY FAQ ================= */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center sm:mb-12">
              <p
                data-reveal
                className={`${rv} ${eyebrow} m-0 justify-center text-green-700`}
              >
                <span className="h-0.5 w-8 bg-[#78D94F]" />
                Helpful Information
                <span className="h-0.5 w-8 bg-[#78D94F]" />
              </p>

              <h2
                data-reveal
                style={delay(80)}
                className={`${rv} ${head} mt-3 text-3xl font-extrabold tracking-tight text-[#17171B] sm:text-4xl`}
              >
                Shipping FAQs
              </h2>
            </div>

            <div className="space-y-3">
              {shippingFaqs.map((faq, index) => {
                const open = openFaq === index;
                return (
                  <div
                    key={faq.question}
                    data-reveal
                    style={delay(index * 70)}
                    className={rv}
                  >
                    <div
                      className={`overflow-hidden rounded-2xl border bg-white transition duration-300 ${
                        open
                          ? "border-[#78D94F] shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <h3 className="m-0">
                        <button
                          type="button"
                          id={`ship-faq-${index}-btn`}
                          aria-expanded={open}
                          aria-controls={`ship-faq-${index}-panel`}
                          onClick={() => setOpenFaq(open ? null : index)}
                          className={`flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-4 py-4 text-left sm:gap-5 sm:px-6 sm:py-5 ${focus}`}
                        >
                          <span
                            className={`${head} flex items-start gap-3 text-[15px] font-bold leading-6 text-[#17171B] sm:text-base sm:leading-7`}
                          >
                            <span className="text-[#78D94F]">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            {faq.question}
                          </span>

                          <span
                            aria-hidden="true"
                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xl transition duration-300 ${
                              open
                                ? "rotate-45 bg-[#78D94F] text-[#17171B]"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            +
                          </span>
                        </button>
                      </h3>

                      <div
                        id={`ship-faq-${index}-panel`}
                        role="region"
                        aria-labelledby={`ship-faq-${index}-btn`}
                        className={`grid transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
                          open
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <p className="m-0 border-t border-gray-100 bg-[#F7F8F5] px-4 py-4 text-[15px] leading-7 text-gray-600 sm:px-6 sm:py-5 sm:text-sm sm:leading-8">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= CONTACT BANNER ================= */}
        <section className="bg-[#F7F8F5] px-4 py-10 sm:px-6 sm:py-16">
          <div
            data-reveal
            className={`${rv} relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#78D94F] px-6 py-10 text-center sm:px-8 sm:py-12 md:px-16`}
          >
            <span
              aria-hidden="true"
              className={`${head} pointer-events-none absolute -bottom-8 -right-2 select-none text-[160px] font-extrabold leading-none text-[#17171B]/[0.06] sm:text-[200px]`}
            >
              ?
            </span>

            <div className="relative">
              <h2
                className={`${head} m-0 text-2xl font-extrabold tracking-tight text-[#17171B] sm:text-3xl md:text-4xl`}
              >
                Need Help With Your Delivery?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-[#17171B]/75 sm:text-base">
                Our support team can help you with delivery questions, damaged
                packages, and order-related concerns.
              </p>

              <Link
                href="/contact"
                className={`group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#17171B] px-8 py-4 text-sm font-bold tracking-[0.1em] text-white no-underline transition duration-300 hover:-translate-y-0.5 hover:bg-black sm:w-auto ${focus}`}
              >
                GET IN TOUCH
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}