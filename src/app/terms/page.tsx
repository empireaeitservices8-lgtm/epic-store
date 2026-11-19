"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Inter, Syne } from "next/font/google";
import { ArrowRight, FileText, Lock, RotateCcw, Truck } from "lucide-react";
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

const termsSections = [
  {
    number: "01",
    title: "Acceptance of Terms",
    content:
      "By accessing or using the Epic Store website, you agree to comply with these Terms and Conditions and applicable laws. If you do not agree with these terms, please do not use the website.",
  },
  {
    number: "02",
    title: "Website Usage",
    content:
      "You agree to use this website only for lawful purposes. You must not misuse the website, attempt unauthorized access, interfere with its operation, or use it in a way that may harm other customers or our business.",
  },
  {
    number: "03",
    title: "Products and Descriptions",
    content:
      "We aim to display accurate product descriptions, images, prices, and availability. However, minor variations in colors, appearance, or display may occur due to device settings, product materials, or manufacturing differences.",
  },
  {
    number: "04",
    title: "Pricing and Availability",
    content:
      "Product prices, promotional offers, and availability may change without prior notice. Applicable taxes, shipping charges, and other fees will be displayed during checkout where required.",
  },
  {
    number: "05",
    title: "Orders and Confirmation",
    content:
      "Submitting an order constitutes a purchase request. An order may be subject to availability, payment authorization, address verification, and other checks. We reserve the right to contact you if additional information is required or to cancel an order where permitted by law.",
  },
  {
    number: "06",
    title: "Payments",
    content:
      "Payments may be processed through third-party payment providers. Customers must provide accurate payment and billing information. Orders may not be processed if payment authorization fails or payment cannot be confirmed.",
  },
  {
    number: "07",
    title: "Shipping and Delivery",
    content:
      "Delivery timelines are estimates and may vary depending on location, product availability, courier operations, and other circumstances. Shipping charges and delivery details will be communicated during checkout or through order updates.",
  },
  {
    number: "08",
    title: "Returns, Refunds and Cancellations",
    content:
      "Returns, refunds, exchanges, and cancellations are governed by our applicable Returns & Refund Policy. Please review that policy before placing an order. Certain products, including customized products, may have specific conditions.",
  },
  {
    number: "09",
    title: "Custom and Personalized Products",
    content:
      "Customers are responsible for ensuring that uploaded images, text, and other customization details are accurate and that they have the necessary rights or permissions to use submitted material. Custom orders may be subject to additional terms.",
  },
  {
    number: "10",
    title: "Intellectual Property",
    content:
      "Website content, branding, logos, graphics, product descriptions, and other materials may be protected by intellectual property laws. You may not reproduce, distribute, or commercially use these materials without appropriate permission.",
  },
  {
    number: "11",
    title: "Limitation of Liability",
    content:
      "To the extent permitted by applicable law, Epic Store will not be responsible for indirect or consequential losses arising from website use, service interruptions, or circumstances outside our reasonable control. Nothing in these terms excludes liability that cannot legally be excluded.",
  },
  {
    number: "12",
    title: "Third-Party Services and Links",
    content:
      "The website may contain links to or integrations with third-party services. We are not responsible for the content, availability, or independent policies of those services. Your use of them may be subject to their own terms.",
  },
  {
    number: "13",
    title: "Changes to These Terms",
    content:
      "We may revise these Terms and Conditions when our services, website, or legal requirements change. Updated terms will be published on this page. Continued use of the website after changes take effect may be subject to the revised terms.",
  },
  {
    number: "14",
    title: "Governing Law",
    content:
      "These terms are subject to applicable laws in India. Any jurisdiction or dispute-resolution provisions must be finalized according to the business's registered location and applicable legal requirements.",
  },
];

const relatedPolicies = [
  {
    href: "/privacy",
    icon: Lock,
    title: "Privacy Policy",
    text: "Learn how we handle your personal information.",
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

const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";
const card =
  "rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] md:p-8";

const revealCls =
  "translate-y-8 opacity-0 transition-all duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none data-[in=1]:translate-y-0 data-[in=1]:opacity-100";

export default function TermsPage() {
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
        className={`${syne.variable} ${inter.variable} min-h-screen bg-[#F7F8F5] font-[family-name:var(--font-inter)]`}
      >
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-5 py-12 text-center md:py-16 print:bg-white print:py-8">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#78D94F]/15 blur-3xl print:hidden" />
          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#78D94F]/10 blur-3xl print:hidden" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] print:hidden" />

          <div className="relative mx-auto max-w-3xl">
            <p
              {...reveal(100)}
              className={`${revealCls} flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#78D94F] print:text-green-700`}
            >
              <span className="h-0.5 w-8 bg-[#78D94F]" />
              Website Guidelines
              <span className="h-0.5 w-8 bg-[#78D94F]" />
            </p>

            <h1
              {...reveal(200)}
              className={`${revealCls} ${head} mt-4 text-4xl font-extrabold uppercase leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl print:text-[#17171B]`}
            >
              Terms & <span className="text-[#78D94F]">Conditions</span>
            </h1>

            <p
              {...reveal(300)}
              className={`${revealCls} mx-auto mt-5 max-w-xl leading-7 text-gray-400 print:text-gray-600`}
            >
              Please read these terms carefully before using Epic Store. They
              explain the guidelines and conditions that apply when browsing
              our website and purchasing our products.
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
                  {termsSections.length}
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
                    <FileText className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <h2
                    className={`${head} m-0 text-xl font-extrabold text-[#17171B] md:text-2xl`}
                  >
                    Welcome to Epic Store
                  </h2>
                </div>

                <p className="mb-0 mt-6 leading-8 text-gray-500">
                  These Terms and Conditions govern your access to and use of
                  the Epic Store website and services. They cover product
                  information, orders, payments, shipping, returns, and
                  customer responsibilities.
                </p>
              </div>

              {/* Section heading */}
              <div {...reveal(150)} className={`${revealCls} px-1 pt-4`}>
                <p className="m-0 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-green-700">
                  <span className="h-0.5 w-8 bg-[#78D94F]" />
                  Terms of Service
                </p>
                <h2
                  className={`${head} m-0 mt-3 text-3xl font-extrabold text-[#17171B]`}
                >
                  Our Website Policies
                </h2>
                <p className="m-0 mt-3 leading-7 text-gray-500">
                  The following sections explain the conditions that apply to
                  your use of our website.
                </p>
              </div>

              {/* Terms list */}
              {termsSections.map((section, index) => (
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
                  aria-label="Terms sections"
                  className="mt-5 max-h-[50vh] space-y-1 overflow-y-auto pr-1"
                >
                  {termsSections.map((section) => (
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
                    Contact our support team if you have questions about these
                    terms.
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
                Have Questions About{" "}
                <span className="text-[#78D94F]">Our Terms?</span>
              </h2>

              <p className="mx-auto mb-0 mt-5 max-w-xl leading-7 text-gray-400">
                If you need clarification about our website policies, orders,
                or services, please contact our support team.
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