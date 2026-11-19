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

const returnSteps = [
  {
    number: "01",
    title: "Contact Support",
    description:
      "Reach out to our support team with your order number and details of the issue.",
  },
  {
    number: "02",
    title: "Share Product Details",
    description:
      "Provide photographs or other information requested to help us review your request.",
  },
  {
    number: "03",
    title: "Request Review",
    description:
      "Our team will review your request according to the applicable return policy.",
  },
  {
    number: "04",
    title: "Resolution",
    description:
      "If approved, we will guide you through the applicable return, replacement, or refund process.",
  },
];

const returnConditions = [
  {
    icon: "box" as const,
    title: "Damaged Products",
    description:
      "Contact us if your product arrives damaged. Include clear photographs of the product and packaging.",
  },
  {
    icon: "alert" as const,
    title: "Incorrect Products",
    description:
      "If you receive a product different from what you ordered, contact our team with your order details.",
  },
  {
    icon: "search" as const,
    title: "Product Issues",
    description:
      "If there is a quality or manufacturing issue, share the details so our team can assess your request.",
  },
];

const checklist = [
  "Keep your order number ready.",
  "Take clear photographs if the product is damaged.",
  "Share the reason for your return request.",
  "Keep the original packaging where possible.",
];

const refundFaqs = [
  {
    question: "How can I request a return?",
    answer:
      "Contact our support team through the Contact Us page with your order number, product details, and reason for the return. Our team will explain the next steps based on the applicable policy.",
  },
  {
    question: "Can I return a damaged product?",
    answer:
      "If your product arrives damaged, contact us as soon as possible with photographs of the product and packaging. Our team will review the issue and advise you on the available resolution.",
  },
  {
    question: "How long does a refund take?",
    answer:
      "Once a refund is approved and initiated, the time taken for the amount to reflect depends on your original payment method, bank, or payment provider.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Please contact our support team as soon as possible if you want to cancel an order. Cancellation may not be possible once the order has been processed or dispatched.",
  },
  {
    question: "Are customized products eligible for returns?",
    answer:
      "Customized and personalized products may have different return conditions. Please review the applicable custom-order policy before placing your order.",
  },
  {
    question: "Will shipping charges be refunded?",
    answer:
      "Shipping charge refunds, if applicable, will be determined according to the reason for the return and the applicable refund policy.",
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
  alert: (
    <>
      <path d="M12 3 2 20h20z" />
      <path d="M12 10v4.5M12 17.5v.01" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8 8 0 0 0-14.3-4.5L4 8.5" />
      <path d="M4 4v4.5h4.5" />
      <path d="M4 13a8 8 0 0 0 14.3 4.5l1.7-2" />
      <path d="M20 20v-4.5h-4.5" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
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

export default function ReturnsPage() {
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hero-banners/custom-prints-hero.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-80"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#17171B]/55 via-[#17171B]/45 to-[#17171B]/75" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#78D94F]/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--x,70%)_var(--y,30%),rgba(120,217,79,0.12),transparent_40%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
          <span
            aria-hidden="true"
            className={`${head} pointer-events-none absolute -right-4 bottom-0 select-none text-[clamp(90px,20vw,320px)] font-extrabold leading-[0.8] text-white/[0.03]`}
          >
            RETURN
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
              <span className="text-white">RETURNS</span>
            </nav>

            <span
              data-reveal
              style={delay(80)}
              className={`${rv} mb-5 inline-flex items-center rounded-full border border-[#78D94F]/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#78D94F]`}
            >
              Customer Support
            </span>

            <h1
              data-reveal
              style={delay(160)}
              className={`${rv} ${head} text-[34px] font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-6xl`}
            >
              Returns &amp; <span className="text-[#78D94F]">Refunds</span>
            </h1>

            <p
              data-reveal
              style={delay(260)}
              className={`${rv} mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-gray-300 sm:mt-6 sm:text-base sm:leading-8 md:text-lg`}
            >
              Your satisfaction matters to us. Find out how to request a
              return, report a product issue, cancel an order, and understand
              the refund process.
            </p>

            <div
              data-reveal
              style={delay(340)}
              className={`${rv} mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-4`}
            >
              <Link href="/contact" className={btnGreen}>
                <span aria-hidden="true" className={shine} />
                <span className="relative">REQUEST ASSISTANCE</span>
                <span className="relative transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>

              <Link
                href="/faq"
                className={`inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 text-sm font-bold tracking-[0.1em] text-white no-underline transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#17171B] ${focus}`}
              >
                VIEW FAQS
              </Link>
            </div>
          </div>
        </section>

        {/* ================= INTRODUCTION ================= */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-10">
          <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-14">
            <div>
              <p data-reveal className={`${rv} ${eyebrow} m-0 text-green-700`}>
                <span className="h-0.5 w-10 bg-[#78D94F]" />
                Our Policy
              </p>

              <h2
                data-reveal
                style={delay(80)}
                className={`${rv} ${head} mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-[#17171B] sm:text-4xl`}
              >
                Shopping With Confidence
              </h2>

              <p
                data-reveal
                style={delay(160)}
                className={`${rv} mt-6 text-[15px] leading-7 text-gray-600 sm:text-base sm:leading-8`}
              >
                At Epic Store, we want you to have a positive shopping
                experience. If you receive a damaged, defective, or incorrect
                product, our support team is here to help.
              </p>

              <p
                data-reveal
                style={delay(220)}
                className={`${rv} mt-4 text-[15px] leading-7 text-gray-600 sm:text-base sm:leading-8`}
              >
                Return and refund requests are reviewed according to the
                product type and the applicable policy. Please contact us with
                your order details for assistance.
              </p>

              <div data-reveal style={delay(280)} className={rv}>
                <Link
                  href="/contact"
                  className={`group mt-7 inline-flex items-center gap-2 font-bold text-[#17171B] no-underline transition hover:text-green-700 ${focus}`}
                >
                  Contact Customer Support
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

                <span className="relative grid h-24 w-24 place-items-center rounded-3xl bg-[#78D94F] text-[#17171B] shadow-[0_15px_40px_rgba(120,217,79,0.35)] transition-transform duration-700 group-hover:rotate-180 group-hover:scale-110">
                  <Icon name="refresh" size={46} />
                </span>

                <h3
                  className={`${head} relative mt-7 text-2xl font-extrabold text-white`}
                >
                  We&apos;re Here to Help
                </h3>
                <p className="relative mt-3 text-gray-400">
                  Your concerns matter to us.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ELIGIBLE ISSUES ================= */}
        <section className="bg-[#F7F8F5] px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
              <p
                data-reveal
                className={`${rv} ${eyebrow} m-0 justify-center text-green-700`}
              >
                <span className="h-0.5 w-8 bg-[#78D94F]" />
                Return Assistance
                <span className="h-0.5 w-8 bg-[#78D94F]" />
              </p>

              <h2
                data-reveal
                style={delay(80)}
                className={`${rv} ${head} mt-3 text-3xl font-extrabold tracking-tight text-[#17171B] sm:text-4xl`}
              >
                When Should You Contact Us?
              </h2>

              <p
                data-reveal
                style={delay(160)}
                className={`${rv} mt-4 text-[15px] leading-7 text-gray-500 sm:text-base`}
              >
                Get in touch with our team if you experience any of the
                following issues.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3 md:gap-6">
              {returnConditions.map((item, i) => (
                <div
                  key={item.title}
                  data-reveal
                  style={delay(i * 100)}
                  onMouseMove={spot}
                  className={`${rv} group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 hover:-translate-y-1.5 hover:border-[#78D94F] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] sm:p-8`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(300px_circle_at_var(--x,50%)_var(--y,50%),rgba(120,217,79,0.14),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-[#78D94F]/15 text-[#17171B] transition duration-300 group-hover:-rotate-6 group-hover:bg-[#78D94F]">
                    <Icon name={item.icon} size={28} />
                  </span>

                  <h3
                    className={`${head} relative mt-6 text-xl font-extrabold text-[#17171B]`}
                  >
                    {item.title}
                  </h3>

                  <p className="relative mt-3 text-[15px] leading-7 text-gray-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= RETURN PROCESS ================= */}
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
                How Returns Work
              </h2>

              <p
                data-reveal
                style={delay(160)}
                className={`${rv} mt-4 text-[15px] text-gray-500 sm:text-base`}
              >
                Follow these steps to request assistance with your order.
              </p>
            </div>

            {/* Vertical timeline on mobile, horizontal from md up */}
            <ol className="m-0 grid list-none p-0 md:grid-cols-4 md:gap-6">
              {returnSteps.map((step, i) => (
                <li
                  key={step.number}
                  data-reveal
                  style={delay(i * 120)}
                  className={`${rv} group relative flex gap-5 pb-10 last:pb-0 md:flex-col md:items-center md:pb-0 md:text-center`}
                >
                  {i < returnSteps.length - 1 && (
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

        {/* ================= IMPORTANT INFORMATION ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-4 py-12 text-white sm:px-6 sm:py-16 md:py-20 lg:px-10">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#78D94F]/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <p
                  data-reveal
                  className={`${rv} ${eyebrow} m-0 text-[#78D94F]`}
                >
                  <span className="h-0.5 w-10 bg-[#78D94F]" />
                  Important Information
                </p>

                <h2
                  data-reveal
                  style={delay(80)}
                  className={`${rv} ${head} mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl`}
                >
                  Before Requesting a Return
                </h2>

                <p
                  data-reveal
                  style={delay(160)}
                  className={`${rv} mt-5 text-[15px] leading-7 text-gray-300 sm:text-base sm:leading-8`}
                >
                  Please keep your order information and original packaging
                  available when contacting our team. This helps us review your
                  request.
                </p>
              </div>

              <ul className="m-0 list-none space-y-3 p-0 sm:space-y-4">
                {checklist.map((item, index) => (
                  <li
                    key={item}
                    data-reveal
                    style={delay(index * 90)}
                    className={`${rv} group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors duration-300 hover:border-[#78D94F]/50 sm:p-5`}
                  >
                    <span
                      className={`${head} grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#78D94F] text-sm font-extrabold text-[#17171B] transition-transform duration-300 group-hover:scale-110`}
                    >
                      {index + 1}
                    </span>

                    <p className="m-0 pt-1 text-[15px] leading-7 text-gray-300">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div
              data-reveal
              onMouseMove={spot}
              className={`${rv} group relative mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:mt-12 sm:p-8`}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(360px_circle_at_var(--x,50%)_var(--y,0%),rgba(120,217,79,0.16),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#78D94F] text-[#17171B]">
                  <Icon name="check" size={20} />
                </span>
                <h3
                  className={`${head} m-0 text-xl font-extrabold text-[#78D94F]`}
                >
                  Refund Information
                </h3>
              </div>

              <p className="relative mb-0 mt-4 text-[15px] leading-7 text-gray-300 sm:leading-8">
                Refunds are processed only after the applicable request has
                been reviewed and approved. Once initiated, the time required
                for the amount to reflect depends on your bank or payment
                provider.
              </p>
            </div>
          </div>
        </section>

        {/* ================= FAQS ================= */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center sm:mb-12">
              <p
                data-reveal
                className={`${rv} ${eyebrow} m-0 justify-center text-green-700`}
              >
                <span className="h-0.5 w-8 bg-[#78D94F]" />
                Need Clarification?
                <span className="h-0.5 w-8 bg-[#78D94F]" />
              </p>

              <h2
                data-reveal
                style={delay(80)}
                className={`${rv} ${head} mt-3 text-3xl font-extrabold tracking-tight text-[#17171B] sm:text-4xl`}
              >
                Returns &amp; Refund FAQs
              </h2>
            </div>

            <div className="space-y-3">
              {refundFaqs.map((faq, index) => {
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
                          id={`ret-faq-${index}-btn`}
                          aria-expanded={open}
                          aria-controls={`ret-faq-${index}-panel`}
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
                        id={`ret-faq-${index}-panel`}
                        role="region"
                        aria-labelledby={`ret-faq-${index}-btn`}
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

        {/* ================= CONTACT CTA ================= */}
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
                Need Help With a Return?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-[#17171B]/75 sm:text-base">
                Contact our support team with your order details. We&apos;re
                ready to help you find the right solution.
              </p>

              <Link
                href="/contact"
                className={`group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#17171B] px-8 py-4 text-sm font-bold tracking-[0.1em] text-white no-underline transition duration-300 hover:-translate-y-0.5 hover:bg-black sm:w-auto ${focus}`}
              >
                CONTACT OUR TEAM
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