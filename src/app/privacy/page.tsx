"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Inter, Montserrat } from "next/font/google";
import { ArrowRight, FileText, Lock, RotateCcw, Truck } from "lucide-react";
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

const privacySections = [
  {
    number: "01",
    title: "Information We Collect",
    content:
      "When you use Epic Store, we may collect information that you provide, such as your name, email address, phone number, billing address, shipping address, and order details. We may also collect basic technical information such as browser type, device information, and website usage data.",
  },
  {
    number: "02",
    title: "How We Use Your Information",
    content:
      "We may use your information to process orders, arrange deliveries, communicate order updates, respond to support requests, improve our website, prevent fraudulent activities, and provide relevant information about our services.",
  },
  {
    number: "03",
    title: "Payment Information",
    content:
      "Payments may be processed through third-party payment providers such as Razorpay. Payment information is handled according to the payment provider's security practices. Epic Store should not store sensitive card details unless a compliant payment arrangement specifically permits it.",
  },
  {
    number: "04",
    title: "Cookies and Website Technologies",
    content:
      "Our website may use cookies or similar technologies to maintain shopping sessions, remember preferences, understand website performance, and improve the browsing experience. You can manage cookie settings through your browser.",
  },
  {
    number: "05",
    title: "Sharing of Information",
    content:
      "We may share relevant information with trusted service providers when necessary to operate our business. These may include payment processors, delivery partners, website hosting providers, and customer support services. We do not intend to sell customers' personal information.",
  },
  {
    number: "06",
    title: "Data Security",
    content:
      "We take reasonable measures to protect customer information against unauthorized access, misuse, loss, or disclosure. However, no internet transmission or electronic storage system can be guaranteed to be completely secure.",
  },
  {
    number: "07",
    title: "Data Retention",
    content:
      "We retain personal information only for as long as reasonably necessary for business operations, order management, customer support, legal compliance, dispute resolution, and other legitimate purposes.",
  },
  {
    number: "08",
    title: "Your Privacy Rights",
    content:
      "Depending on applicable law, you may have rights to request access to, correction of, or deletion of your personal information, and to raise concerns about how your information is used. Contact us to submit a privacy-related request.",
  },
  {
    number: "09",
    title: "Third-Party Services",
    content:
      "Our website may connect to third-party services, including payment providers and delivery partners. Those services may have their own privacy policies and terms. We encourage customers to review those policies when using their services.",
  },
  {
    number: "10",
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy when our website, services, or legal requirements change. Updated information will be published on this page with a revised effective date.",
  },
];

const relatedPolicies = [
  {
    href: "/terms",
    icon: FileText,
    title: "Terms & Conditions",
    text: "Review the guidelines and conditions for using Epic Store.",
  },
  {
    href: "/returns",
    icon: RotateCcw,
    title: "Returns & Refunds",
    text: "Understand return requests and refund procedures.",
  },
  {
    href: "/shipping",
    icon: Truck,
    title: "Shipping & Delivery",
    text: "Find information about shipping and delivery.",
  },
];

const head = `${montserrat.className} font-[family-name:var(--font-montserrat)]`;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";
const card =
  "rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] md:p-8";

const revealCls =
  "translate-y-8 opacity-0 transition-all duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none data-[in=1]:translate-y-0 data-[in=1]:opacity-100";

export default function PrivacyPage() {
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
      { threshold: 0.12 }
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const reveal = (delay: number) => ({
    "data-reveal": "",
    style: { transitionDelay: `${delay}ms` },
  });

  return (
    <>
      <Header />

      <main
        ref={pageRef}
        className={`${montserrat.variable} ${inter.variable} min-h-screen bg-[#F7F8F5] font-[family-name:var(--font-inter)]`}
      >
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-5 py-12 text-center md:py-16 print:bg-white print:py-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hero-banners/faq-hero.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-80 print:hidden"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#17171B]/55 via-[#17171B]/45 to-[#17171B]/75 print:hidden" />
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#78D94F]/15 blur-3xl print:hidden" />
          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#78D94F]/10 blur-3xl print:hidden" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] print:hidden" />

          <div className="relative mx-auto max-w-3xl">
            <p
              {...reveal(100)}
              className={`${revealCls} flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#78D94F] print:text-green-700`}
            >
              <span className="h-0.5 w-8 bg-[#78D94F]" />
              Your Privacy Matters
              <span className="h-0.5 w-8 bg-[#78D94F]" />
            </p>

            <h1
              {...reveal(200)}
              className={`${revealCls} ${head} mt-4 text-4xl font-extrabold uppercase leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl print:text-[#17171B]`}
            >
              Privacy <span className="text-[#78D94F]">Policy</span>
            </h1>

            <p
              {...reveal(300)}
              className={`${revealCls} mx-auto mt-5 max-w-xl leading-7 text-gray-400 print:text-gray-600`}
            >
              Your trust is important to us. Learn how Epic Store collects,
              uses, manages, and protects your personal information when you use
              our website.
            </p>

            <div
              {...reveal(400)}
              className={`${revealCls} mt-9 inline-flex flex-col items-stretch rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-5 text-left backdrop-blur-sm sm:flex-row sm:items-center sm:gap-8 print:border-gray-200 print:bg-gray-50`}
            >
              <div>
                <p className="m-0 text-xs uppercase tracking-[0.18em] text-gray-400">
                  Effective Date
                </p>
                <p
                  className={`${head} m-0 mt-1 text-lg font-bold text-white print:text-[#17171B]`}
                >
                  To be confirmed
                </p>
              </div>

              <div className="my-4 h-px w-full bg-white/10 sm:my-0 sm:h-10 sm:w-px" />

              <div>
                <p className="m-0 text-xs uppercase tracking-[0.18em] text-gray-400">
                  Sections
                </p>
                <p
                  className={`${head} m-0 mt-1 text-lg font-bold text-white print:text-[#17171B]`}
                >
                  {privacySections.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left: intro + sections */}
            <div className="space-y-6 lg:col-span-2">
              {/* Introduction */}
              <div {...reveal(100)} className={`${card} ${revealCls}`}>
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#78D94F]/20 text-[#17171B]">
                    <Lock className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <h2
                    className={`${head} m-0 text-xl font-extrabold text-[#17171B] md:text-2xl`}
                  >
                    Our Commitment to Your Privacy
                  </h2>
                </div>

                <p className="mb-0 mt-6 leading-8 text-gray-500">
                  This Privacy Policy explains how Epic Store handles personal
                  information when customers visit our website, browse products,
                  place orders, or contact our team. We aim to use customer
                  information responsibly and transparently, in accordance with
                  applicable laws.
                </p>
              </div>

              {/* Section heading */}
              <div {...reveal(150)} className={`${revealCls} px-1 pt-4`}>
                <p className="m-0 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-green-700">
                  <span className="h-0.5 w-8 bg-[#78D94F]" />
                  Privacy Details
                </p>
                <h2
                  className={`${head} m-0 mt-3 text-3xl font-extrabold text-[#17171B]`}
                >
                  How We Handle Your Information
                </h2>
                <p className="m-0 mt-3 leading-7 text-gray-500">
                  The following sections explain how we collect, use, and
                  safeguard your data across Epic Store.
                </p>
              </div>

              {/* Privacy list */}
              {privacySections.map((section, index) => (
                <article
                  key={section.number}
                  id={`section-${section.number}`}
                  {...reveal(200 + Math.min(index, 4) * 60)}
                  className={`${card} ${revealCls} group flex scroll-mt-28 flex-col gap-5 hover:border-[#78D94F] hover:shadow-[0_10px_30px_rgba(120,217,79,0.12)] md:flex-row`}
                >
                  <div
                    className={`${head} grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#78D94F]/15 text-sm font-bold text-[#17171B] transition-colors duration-300 group-hover:bg-[#78D94F]`}
                  >
                    {section.number}
                  </div>

                  <div>
                    <h3
                      className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}
                    >
                      {section.title}
                    </h3>
                    <p className="m-0 mt-3 leading-8 text-gray-500">
                      {section.content}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Right: sticky contents + help */}
            <aside className="print:hidden">
              <div
                {...reveal(250)}
                className={`${revealCls} rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] lg:sticky lg:top-28`}
              >
                <h2
                  className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}
                >
                  On This Page
                </h2>

                <nav
                  aria-label="Privacy sections"
                  className="mt-5 max-h-[50vh] space-y-1 overflow-y-auto pr-1"
                >
                  {privacySections.map((section) => (
                    <a
                      key={section.number}
                      href={`#section-${section.number}`}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-500 no-underline transition hover:bg-[#F7F8F5] hover:text-[#17171B] ${focus}`}
                    >
                      <span
                        className={`${head} text-xs font-bold text-[#78D94F] group-hover:text-green-700`}
                      >
                        {section.number}
                      </span>
                      <span className="leading-5">{section.title}</span>
                    </a>
                  ))}
                </nav>

                <div className="my-6 border-t border-dashed border-gray-200" />

                <div className="rounded-2xl bg-[#F7F8F5] p-4">
                  <p
                    className={`${head} m-0 text-sm font-bold text-[#17171B]`}
                  >
                    Need Help?
                  </p>
                  <p className="m-0 mt-2 text-xs leading-5 text-gray-500">
                    Contact our support team if you have questions or requests
                    about your personal data.
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
            </aside>
          </div>

          {/* ================= RELATED POLICIES ================= */}
          <div className="mt-12 print:hidden">
            <div className="mb-8 text-center">
              <p className="m-0 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-green-700">
                <span className="h-0.5 w-8 bg-[#78D94F]" />
                More Information
                <span className="h-0.5 w-8 bg-[#78D94F]" />
              </p>
              <h2
                className={`${head} m-0 mt-3 text-3xl font-extrabold text-[#17171B]`}
              >
                Explore Our Policies
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {relatedPolicies.map((policy) => {
                const PolicyIcon = policy.icon;
                return (
                  <Link
                    key={policy.href}
                    href={policy.href}
                    className={`${card} group block no-underline transition duration-300 hover:-translate-y-1 hover:border-[#78D94F] hover:shadow-[0_10px_30px_rgba(120,217,79,0.15)] ${focus}`}
                  >
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F7F8F5] text-[#17171B] transition-colors duration-300 group-hover:bg-[#78D94F]/20">
                      <PolicyIcon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <h3
                      className={`${head} m-0 mt-5 text-xl font-extrabold text-[#17171B]`}
                    >
                      {policy.title}
                    </h3>
                    <p className="m-0 mt-3 text-sm leading-7 text-gray-500">
                      {policy.text}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#17171B]">
                      Read Policy
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ================= CONTACT BANNER ================= */}
          <div className="relative mt-12 overflow-hidden rounded-3xl bg-[#17171B] px-8 py-12 text-center md:px-16 print:hidden">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#78D94F]/15 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[#78D94F]/10 blur-3xl" />

            <div className="relative">
              <h2
                className={`${head} m-0 text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl`}
              >
                Questions About{" "}
                <span className="text-[#78D94F]">Your Privacy?</span>
              </h2>

              <p className="mx-auto mb-0 mt-5 max-w-xl leading-7 text-gray-400">
                If you have questions or requests regarding your personal
                information, please get in touch with our support team.
              </p>

              <Link
                href="/contact"
                className={`group mt-9 inline-flex items-center justify-center gap-3 rounded-full bg-[#78D94F] px-9 py-4 text-sm font-bold tracking-[0.1em] text-[#17171B] no-underline shadow-[0_10px_30px_rgba(120,217,79,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-white ${focus}`}
              >
                CONTACT US
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
