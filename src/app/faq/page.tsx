"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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

const faqData = [
  {
    category: "Orders",
    questions: [
      {
        question: "How can I place an order?",
        answer:
          "Browse our products, select the design you like, add it to your cart, and proceed to checkout. Enter your delivery details and choose an available payment method to complete your order.",
      },
      {
        question: "Can I modify or cancel my order?",
        answer:
          "If you need to modify or cancel an order, please contact our support team as soon as possible. Changes may not be possible once your order has been processed or dispatched.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Once your order is dispatched, tracking information will be shared through your registered contact details, subject to the tracking service being available.",
      },
    ],
  },
  {
    category: "Payments",
    questions: [
      {
        question: "What payment methods are accepted?",
        answer:
          "We plan to support secure online payments through Razorpay, including eligible UPI, debit cards, credit cards, net banking, and other available payment options.",
      },
      {
        question: "Is online payment secure?",
        answer:
          "Online payments will be processed through our payment gateway. Your payment details should be handled securely by the payment provider.",
      },
      {
        question: "Can I pay using Cash on Delivery?",
        answer:
          "Cash on Delivery availability depends on the delivery location and the order. Available payment methods will be displayed during checkout.",
      },
    ],
  },
  {
    category: "Shipping",
    questions: [
      {
        question: "How long does delivery take?",
        answer:
          "Delivery timelines depend on the product, delivery location, and courier availability. The estimated delivery information will be shared when the order is confirmed.",
      },
      {
        question: "Do you offer free shipping?",
        answer:
          "Shipping charges and any free-shipping offers will be displayed during checkout before you place your order.",
      },
      {
        question: "Do you deliver across India?",
        answer:
          "Delivery availability depends on the serviceability of your location. Enter your PIN code during checkout to check whether delivery is available.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        question: "Can I return a product?",
        answer:
          "Return eligibility depends on the product condition and the applicable return policy. Please contact our support team with your order details if you receive a damaged, defective, or incorrect product.",
      },
      {
        question: "What should I do if I receive a damaged product?",
        answer:
          "Please contact our support team as soon as possible with your order number and clear photographs of the damaged product and packaging.",
      },
      {
        question: "How long do refunds take?",
        answer:
          "Approved refunds are processed through the applicable payment method. The time taken for the amount to reflect depends on your bank or payment provider.",
      },
    ],
  },
  {
    category: "Custom Prints",
    questions: [
      {
        question: "Can I order a personalized print?",
        answer:
          "Yes, Epic Store plans to offer personalized print options. You will be able to share your preferred design or image and select available customization options.",
      },
      {
        question: "Can I upload my own image?",
        answer:
          "Custom image uploads will depend on the available customization options. Please contact our team for assistance with personalized orders.",
      },
      {
        question: "Can I return a customized product?",
        answer:
          "Customized products may have different return conditions from standard products. Please review the custom-order policy before placing your order.",
      },
    ],
  },
  {
    category: "Account & Support",
    questions: [
      {
        question: "Do I need an account to place an order?",
        answer:
          "Account requirements will depend on the checkout options enabled on the website. Follow the checkout process to see the available options.",
      },
      {
        question: "How can I contact customer support?",
        answer:
          "You can reach our team through the Contact Us page. Share your order number and details so we can assist you more quickly.",
      },
      {
        question: "I have not received my order confirmation. What should I do?",
        answer:
          "Please check your email inbox and spam folder. If you still cannot find the confirmation, contact our support team with your registered email address and payment details.",
      },
    ],
  },
];

const categories = [
  "All Questions",
  "Orders",
  "Payments",
  "Shipping",
  "Returns & Refunds",
  "Custom Prints",
  "Account & Support",
];

/* Quick searches shown under the search bar */
const quickSearches = ["Track order", "Payment", "Delivery", "Refund", "Custom"];

const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

const icons = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.01" />
    </>
  ),
};

function Icon({ name, size = 20 }: { name: keyof typeof icons; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

/* Wrap search matches in <mark> */
function highlight(text: string, query: string): ReactNode {
  const q = query.trim();
  if (!q) return text;
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${safe})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="rounded bg-[#78D94F]/40 px-0.5 text-inherit">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All Questions");
  const [search, setSearch] = useState("");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, "yes" | "no">>({});
  const [ready, setReady] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  /* Press "/" anywhere to jump to the search box */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      "All Questions": faqData.reduce((n, g) => n + g.questions.length, 0),
    };
    faqData.forEach((g) => (c[g.category] = g.questions.length));
    return c;
  }, []);

  const filteredFaqs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return faqData
      .filter((g) => activeCategory === "All Questions" || g.category === activeCategory)
      .map((g) => ({
        ...g,
        questions: g.questions
          .map((item, index) => ({ ...item, id: `${g.category}-${index}` }))
          .filter(
            (item) =>
              !q ||
              item.question.toLowerCase().includes(q) ||
              item.answer.toLowerCase().includes(q)
          ),
      }))
      .filter((g) => g.questions.length > 0);
  }, [activeCategory, search]);

  const totalResults = filteredFaqs.reduce((n, g) => n + g.questions.length, 0);

  const resetAll = () => {
    setSearch("");
    setActiveCategory("All Questions");
    setOpenQuestion(null);
  };

  const pickCategory = (c: string) => {
    setActiveCategory(c);
    setOpenQuestion(null);
  };

  return (
    <>
      <Header />

      <main
        className={`${syne.variable} ${inter.variable} min-h-screen bg-white font-[family-name:var(--font-inter)]`}
      >
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-4 py-20 text-white sm:px-6 md:py-28">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#78D94F]/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
          <span
            aria-hidden="true"
            className={`${head} pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(160px,34vw,520px)] font-extrabold leading-none text-white/[0.025]`}
          >
            ?
          </span>

          <div
            className={`relative mx-auto max-w-5xl text-center transition-all duration-700 ${
              ready ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex items-center justify-center gap-2 text-xs font-medium tracking-[0.14em] text-gray-400"
            >
              <Link
                href="/"
                className={`text-gray-400 no-underline transition hover:text-[#78D94F] ${focus}`}
              >
                HOME
              </Link>
              <span>/</span>
              <span className="text-white">FAQ</span>
            </nav>

            <span className="mb-5 inline-flex items-center rounded-full border border-[#78D94F]/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#78D94F]">
              Help Centre
            </span>

            <h1
              className={`${head} text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-5xl md:text-6xl`}
            >
              Frequently Asked
              <span className="mt-2 block text-[#78D94F]">Questions</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
              Have questions about shopping with Epic Store? Find answers about
              orders, payments, shipping, returns, and more.
            </p>

            {/* Search */}
            <div className="mx-auto mt-9 flex max-w-2xl items-center rounded-2xl bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition focus-within:ring-4 focus-within:ring-[#78D94F]/40">
              <span className="pl-3 text-gray-400">
                <Icon name="search" size={22} />
              </span>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setOpenQuestion(null);
                }}
                placeholder="Search your question..."
                aria-label="Search frequently asked questions"
                className="w-full border-0 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className={`grid h-11 shrink-0 cursor-pointer place-items-center rounded-xl border-0 bg-[#78D94F] px-4 text-[#17171B] transition hover:bg-[#17171B] hover:text-white ${focus}`}
                >
                  <Icon name="close" size={18} />
                </button>
              ) : (
                <kbd
                  aria-hidden="true"
                  className="mr-2 hidden h-8 w-8 shrink-0 place-items-center rounded-lg border border-gray-200 bg-gray-50 font-sans text-xs font-bold text-gray-400 sm:grid"
                >
                  /
                </kbd>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-gray-500">
                TRY
              </span>
              {quickSearches.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setSearch(q);
                    setOpenQuestion(null);
                  }}
                  className={`cursor-pointer rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-gray-300 transition duration-300 hover:border-[#78D94F] hover:bg-[#78D94F] hover:text-[#17171B] ${focus}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FAQ CONTENT ================= */}
        <section className="px-4 py-14 sm:px-6 md:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center lg:text-left">
              <p className="m-0 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-green-700 lg:justify-start">
                <span className="h-0.5 w-10 bg-[#78D94F]" />
                We're Here to Help
              </p>
              <h2
                className={`${head} mt-3 text-3xl font-extrabold text-[#17171B] md:text-4xl`}
              >
                How Can We Help You?
              </h2>
              <p className="mt-3 text-gray-500">
                Browse questions by category or search for a specific topic.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">
              {/* Categories: scrolling chips on mobile, sticky list on desktop */}
              <nav aria-label="FAQ categories" className="lg:sticky lg:top-28 lg:h-fit">
                <ul className="m-0 -mx-4 flex list-none gap-2.5 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
                  {categories.map((c) => {
                    const on = activeCategory === c;
                    return (
                      <li key={c} className="shrink-0">
                        <button
                          type="button"
                          onClick={() => pickCategory(c)}
                          aria-pressed={on}
                          className={`group flex w-full cursor-pointer items-center justify-between gap-4 whitespace-nowrap rounded-full border px-5 py-3 text-left text-sm font-semibold transition duration-300 lg:rounded-2xl lg:border-transparent ${focus} ${
                            on
                              ? "border-[#17171B] bg-[#17171B] text-white"
                              : "border-gray-200 bg-white text-gray-600 hover:border-[#78D94F] hover:text-[#17171B] lg:hover:bg-[#F7F8F5]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`hidden h-1.5 rounded-full bg-[#78D94F] transition-all duration-300 lg:block ${
                                on ? "w-4" : "w-0"
                              }`}
                            />
                            {c}
                          </span>
                          <span
                            className={`text-xs ${on ? "text-[#78D94F]" : "text-gray-400"}`}
                          >
                            {counts[c]}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6 hidden rounded-3xl bg-[#F7F8F5] p-5 lg:block">
                  <p className={`${head} m-0 text-sm font-bold text-[#17171B]`}>
                    Can't find it?
                  </p>
                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    Our team is happy to help with anything not covered here.
                  </p>
                  <Link
                    href="/contact"
                    className={`group mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#17171B] no-underline transition hover:text-green-700 ${focus}`}
                  >
                    Contact us
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </nav>

              {/* Questions */}
              <div>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h3 className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}>
                    {activeCategory}
                  </h3>
                  <span className="text-sm text-gray-500" aria-live="polite">
                    {totalResults} {totalResults === 1 ? "question" : "questions"}
                    {search.trim() && (
                      <>
                        {" "}
                        for “<span className="font-semibold text-[#17171B]">{search.trim()}</span>”
                      </>
                    )}
                  </span>
                </div>

                {filteredFaqs.length > 0 ? (
                  <div className="space-y-10">
                    {filteredFaqs.map((group) => (
                      <div key={group.category}>
                        {activeCategory === "All Questions" && (
                          <h4
                            className={`${head} mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] text-green-700`}
                          >
                            <span className="h-0.5 w-6 bg-[#78D94F]" />
                            {group.category}
                          </h4>
                        )}

                        <div className="space-y-3">
                          {group.questions.map((item) => {
                            const isOpen = openQuestion === item.id;
                            const fb = feedback[item.id];
                            return (
                              <div
                                key={item.id}
                                className={`overflow-hidden rounded-2xl border bg-white transition duration-300 ${
                                  isOpen
                                    ? "border-[#78D94F] shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <h5 className="m-0">
                                  <button
                                    type="button"
                                    onClick={() => setOpenQuestion(isOpen ? null : item.id)}
                                    aria-expanded={isOpen}
                                    aria-controls={`${item.id}-panel`}
                                    id={`${item.id}-btn`}
                                    className={`flex w-full cursor-pointer items-center justify-between gap-5 border-0 bg-transparent px-5 py-5 text-left sm:px-6 ${focus}`}
                                  >
                                    <span
                                      className={`${head} text-base font-bold leading-7 text-[#17171B]`}
                                    >
                                      {highlight(item.question, search)}
                                    </span>

                                    <span
                                      aria-hidden="true"
                                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xl transition duration-300 ${
                                        isOpen
                                          ? "rotate-45 bg-[#78D94F] text-[#17171B]"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      +
                                    </span>
                                  </button>
                                </h5>

                                <div
                                  id={`${item.id}-panel`}
                                  role="region"
                                  aria-labelledby={`${item.id}-btn`}
                                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
                                    isOpen
                                      ? "grid-rows-[1fr] opacity-100"
                                      : "grid-rows-[0fr] opacity-0"
                                  }`}
                                >
                                  <div className="min-h-0 overflow-hidden">
                                    <div className="border-t border-gray-100 bg-[#F7F8F5] px-5 py-5 sm:px-6">
                                      <p className="m-0 text-sm leading-8 text-gray-600">
                                        {highlight(item.answer, search)}
                                      </p>

                                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                        {fb ? (
                                          <span className="font-semibold text-green-700">
                                            Thanks for your feedback!
                                          </span>
                                        ) : (
                                          <>
                                            <span>Was this helpful?</span>
                                            {(["yes", "no"] as const).map((v) => (
                                              <button
                                                key={v}
                                                type="button"
                                                tabIndex={isOpen ? 0 : -1}
                                                onClick={() =>
                                                  setFeedback((f) => ({ ...f, [item.id]: v }))
                                                }
                                                className={`cursor-pointer rounded-full border border-gray-200 bg-white px-4 py-1.5 font-semibold text-[#17171B] transition duration-300 hover:border-[#78D94F] hover:bg-[#78D94F] ${focus}`}
                                              >
                                                {v === "yes" ? "Yes" : "No"}
                                              </button>
                                            ))}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-gray-300 bg-[#F7F8F5] px-6 py-16 text-center">
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#78D94F]/20 text-[#17171B]">
                      <Icon name="search" size={28} />
                    </span>
                    <h3 className={`${head} mt-5 text-xl font-extrabold text-[#17171B]`}>
                      No questions found
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Try another search term or select a different category.
                    </p>
                    <button
                      type="button"
                      onClick={resetAll}
                      className={`mt-6 cursor-pointer rounded-full border-0 bg-[#78D94F] px-6 py-3 text-xs font-bold tracking-[0.14em] text-[#17171B] transition hover:bg-[#17171B] hover:text-white ${focus}`}
                    >
                      CLEAR FILTERS
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================= CONTACT CTA ================= */}
        <section className="bg-[#F7F8F5] px-4 py-16 sm:px-6 md:py-20">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#17171B] px-8 py-12 text-center text-white md:px-16 md:py-16">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#78D94F]/15 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

            <div className="relative">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#78D94F] text-[#17171B] shadow-[0_10px_30px_rgba(120,217,79,0.4)] transition-transform duration-500 hover:-rotate-6 hover:scale-110">
                <Icon name="help" size={30} />
              </span>

              <h2
                className={`${head} mt-6 text-3xl font-extrabold uppercase tracking-tight md:text-4xl`}
              >
                Still Have <span className="text-[#78D94F]">Questions?</span>
              </h2>

              <p className="mx-auto mt-4 max-w-xl leading-8 text-gray-300">
                Can't find what you're looking for? Our support team is ready
                to help you with your questions and concerns.
              </p>

              <Link
                href="/contact"
                className={`group relative mt-8 inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#78D94F] px-8 py-4 text-sm font-bold tracking-[0.1em] text-[#17171B] no-underline shadow-[0_10px_30px_rgba(120,217,79,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-white ${focus}`}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-[120%] bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.6)_50%,transparent_70%)] transition-transform duration-700 group-hover:translate-x-[120%]"
                />
                <span className="relative">CONTACT OUR TEAM</span>
                <span className="relative transition-transform duration-300 group-hover:translate-x-1.5">
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