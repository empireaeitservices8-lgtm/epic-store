"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Inter, Montserrat } from "next/font/google";
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

/* Official store email and business contact details */
const EMAIL = "store.epicsports@gmail.com";
const PHONE_DISPLAY = "+91 98765 43210";
const PHONE_HREF = "tel:+919876543210";
const HOURS = "Mon – Sat, 9 AM – 6 PM";

const subjects = [
  "General Enquiry",
  "Product Enquiry",
  "Order Status",
  "Shipping and Delivery",
  "Return and Refund",
  "Custom Prints",
  "Other",
];

const MAX_MESSAGE = 1000;

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "General Enquiry",
  message: "",
};

const head = `${montserrat.className} font-[family-name:var(--font-montserrat)]`;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";
/* Scroll-reveal: an observer sets data-in="1" on [data-reveal] elements */
const rv =
  "opacity-0 translate-y-8 transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] data-[in=1]:translate-y-0 data-[in=1]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100";
const eyebrow =
  "flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em]";

function validate(name: string, value: string): string {
  const v = value.trim();
  if (name === "name" && !v) return "Please enter your name.";
  if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    return "Please enter a valid email address.";
  if (name === "phone" && v && !/^[6-9]\d{9}$/.test(v))
    return "Please enter a valid 10-digit mobile number.";
  if (name === "message" && !v) return "Please enter your message.";
  return "";
}

async function sendMessage(data: typeof initialForm) {
  const res = await fetch("/api/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "contact", ...data }),
  });
  const json = (await res.json()) as { ok?: boolean };
  return { ok: Boolean(res.ok && json.ok) };
}

const icons = {
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  send: <path d="M4 12 20 4l-4 16-4-6-8-2z" />,
};

function Icon({ name, size = 22 }: { name: keyof typeof icons; size?: number }) {
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

export default function ContactPage() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const pageRef = useRef<HTMLElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  /* "Open now" indicator, based on the listed hours in Indian Standard Time */
  useEffect(() => {
    const check = () => {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        hour: "numeric",
        hourCycle: "h23",
      }).formatToParts(new Date());
      const day = parts.find((p) => p.type === "weekday")?.value;
      const hour = Number(parts.find((p) => p.type === "hour")?.value);
      setIsOpen(day !== "Sun" && hour >= 9 && hour < 18);
    };
    check();
    const t = setInterval(check, 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    []
  );

  const setField = (name: string, raw: string) => {
    const value = name === "phone" ? raw.replace(/\D/g, "") : raw;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => (p[name] ? { ...p, [name]: "" } : p));
  };

  const onBlur = (name: keyof typeof initialForm) =>
    setErrors((p) => ({ ...p, [name]: validate(name, formData[name]) }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fields = ["name", "email", "phone", "message"] as const;
    const next: Record<string, string> = {};
    fields.forEach((f) => {
      const msg = validate(f, formData[f]);
      if (msg) next[f] = msg;
    });
    setErrors(next);

    const firstInvalid = fields.find((f) => next[f]);
    if (firstInvalid) {
      const el = document.getElementById(firstInvalid);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }

    setSending(true);
    try {
      const res = await sendMessage(formData);
      if (!res.ok) throw new Error("failed");
      setSubmitted(true);
    } catch {
      setErrors({ message: "Something went wrong. Please try again." });
    } finally {
      setSending(false);
    }
  };

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard unavailable: ignore */
    }
  };

  const delay = (ms: number) => ({ transitionDelay: `${ms}ms` });

  const inputCls = (err?: string) =>
    `w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-[#17171B] outline-none transition placeholder:text-gray-400 focus:ring-2 ${
      err
        ? "border-red-400 focus:border-red-400 focus:ring-red-400/25"
        : "border-gray-200 hover:border-gray-300 focus:border-[#78D94F] focus:ring-[#78D94F]/25"
    }`;

  const errLine = (name: string) => (
    <p
      id={`${name}-err`}
      role={errors[name] ? "alert" : undefined}
      className={`mt-1.5 min-h-4 text-xs text-red-500 transition-opacity duration-300 ${
        errors[name] ? "opacity-100" : "opacity-0"
      }`}
    >
      {errors[name]}
    </p>
  );

  const labelCls = "mb-2 block text-sm font-semibold text-[#17171B]";

  const infoCards = [
    {
      icon: "mail" as const,
      title: "Email Us",
      description: "Send us your questions anytime.",
      detail: EMAIL,
      href: `mailto:${EMAIL}`,
      copyValue: EMAIL,
    },
    {
      icon: "phone" as const,
      title: "Call Us",
      description: "Talk to our customer support team.",
      detail: PHONE_DISPLAY,
      href: PHONE_HREF,
      copyValue: PHONE_DISPLAY,
    },
    {
      icon: "clock" as const,
      title: "Working Hours",
      description: "Our customer support availability.",
      detail: HOURS,
      href: undefined,
      copyValue: undefined,
    },
  ];

  return (
    <>
      <Header />

      <main
        ref={pageRef}
        className={`${montserrat.variable} ${inter.variable} bg-white font-[family-name:var(--font-inter)]`}
      >
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-4 py-20 sm:px-6 md:py-28 lg:px-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hero-banners/contact-hero.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right opacity-85"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#17171B]/90 via-[#17171B]/55 to-[#17171B]/15" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-[#78D94F]/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_left,black,transparent_75%)]" />
          <span
            aria-hidden="true"
            className={`${head} pointer-events-none absolute -right-6 bottom-0 select-none text-[clamp(90px,18vw,280px)] font-extrabold leading-[0.8] text-white/[0.04]`}
          >
            HELLO
          </span>

          <div className="relative mx-auto max-w-7xl">
            <nav
              aria-label="Breadcrumb"
              data-reveal
              className={`${rv} mb-6 flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-gray-400`}
            >
              <Link
                href="/"
                className={`text-gray-400 no-underline transition hover:text-[#78D94F] ${focus}`}
              >
                HOME
              </Link>
              <span>/</span>
              <span className="text-white">CONTACT US</span>
            </nav>

            <p
              data-reveal
              style={delay(80)}
              className={`${rv} ${eyebrow} text-[#78D94F]`}
            >
              <span className="h-0.5 w-10 bg-[#78D94F]" />
              We Are Here to Help
            </p>

            <h1
              data-reveal
              style={delay(160)}
              className={`${rv} ${head} mt-5 max-w-3xl text-3xl font-semibold uppercase leading-[1.06] tracking-tight text-white sm:text-4xl md:text-5xl`}
            >
              Let&apos;s Start a
              <br />
              <span className="text-[#78D94F]">Conversation.</span>
            </h1>

            <p
              data-reveal
              style={delay(260)}
              className={`${rv} mt-6 max-w-2xl text-base leading-8 text-gray-300`}
            >
              Have a question about our products, orders or custom prints? Our
              team is ready to help you find the right solution.
            </p>
          </div>
        </section>

        {/* ================= CONTACT CARDS ================= */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
          <div className="grid gap-6 md:grid-cols-3">
            {infoCards.map((item, i) => (
              <div
                key={item.title}
                data-reveal
                style={delay(i * 100)}
                className={`${rv} group rounded-3xl border border-gray-200 bg-white p-7 hover:-translate-y-1.5 hover:border-[#78D94F] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]`}
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#78D94F]/15 text-[#17171B] transition duration-300 group-hover:rotate-[-6deg] group-hover:bg-[#78D94F]">
                    <Icon name={item.icon} size={26} />
                  </span>

                  {item.title === "Working Hours" && isOpen !== null && (
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.1em] ${
                        isOpen
                          ? "bg-[#78D94F]/20 text-green-800"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isOpen ? "bg-[#78D94F]" : "bg-gray-400"
                        }`}
                      />
                      {isOpen ? "OPEN NOW" : "CLOSED NOW"}
                    </span>
                  )}
                </div>

                <h2 className={`${head} m-0 mt-6 text-xl font-extrabold text-[#17171B]`}>
                  {item.title}
                </h2>
                <p className="mt-3 text-sm text-gray-500">{item.description}</p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {item.href ? (
                    <a
                      href={item.href}
                      className={`break-all font-semibold text-[#17171B] no-underline transition hover:text-green-700 ${focus}`}
                    >
                      {item.detail}
                    </a>
                  ) : (
                    <p className="m-0 font-semibold text-[#17171B]">{item.detail}</p>
                  )}

                  {item.copyValue && (
                    <button
                      type="button"
                      onClick={() => copy(item.copyValue!, item.title)}
                      aria-label={`Copy ${item.title.toLowerCase()} details`}
                      className={`cursor-pointer rounded-full border border-gray-200 bg-transparent px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-gray-500 transition duration-300 hover:border-[#78D94F] hover:bg-[#78D94F] hover:text-[#17171B] ${focus}`}
                    >
                      {copied === item.title ? "COPIED ✓" : "COPY"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FORM + INFO ================= */}
        <section className="bg-[#F7F8F5] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Form */}
            <div
              data-reveal
              className={`${rv} rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)] md:p-10`}
            >
              <p className={`${eyebrow} m-0 text-green-700`}>
                <span className="h-0.5 w-8 bg-[#78D94F]" />
                Send Us a Message
              </p>

              <h2
                className={`${head} mt-3 text-2xl font-semibold text-[#17171B] sm:text-3xl`}
              >
                Get in Touch
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Fill in the form below and tell us how we can help.
              </p>

              {/* Form and success share one cell so height never jumps */}
              <div className="mt-8 grid">
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  aria-hidden={submitted}
                  className={`col-start-1 row-start-1 transition-all duration-500 ${
                    submitted ? "pointer-events-none -translate-y-3 opacity-0" : "opacity-100"
                  }`}
                >
                  <div>
                    <label htmlFor="name" className={labelCls}>
                      Full Name <span className="text-[#78D94F]">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setField("name", e.target.value)}
                      onBlur={() => onBlur("name")}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby="name-err"
                      className={inputCls(errors.name)}
                    />
                    {errLine("name")}
                  </div>

                  <div className="grid gap-x-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="email" className={labelCls}>
                        Email Address <span className="text-[#78D94F]">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setField("email", e.target.value)}
                        onBlur={() => onBlur("email")}
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby="email-err"
                        className={inputCls(errors.email)}
                      />
                      {errLine("email")}
                    </div>

                    <div>
                      <label htmlFor="phone" className={labelCls}>
                        Mobile Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        onBlur={() => onBlur("phone")}
                        maxLength={10}
                        inputMode="numeric"
                        placeholder="10-digit mobile number"
                        autoComplete="tel-national"
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby="phone-err"
                        className={inputCls(errors.phone)}
                      />
                      {errLine("phone")}
                    </div>
                  </div>

                  {/* Subject pills */}
                  <fieldset className="m-0 mb-5 border-0 p-0">
                    <legend className={`${labelCls} p-0`}>Subject</legend>
                    <div role="radiogroup" className="flex flex-wrap gap-2.5">
                      {subjects.map((s) => {
                        const on = formData.subject === s;
                        return (
                          <label
                            key={s}
                            className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition duration-300 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#78D94F] ${
                              on
                                ? "border-[#17171B] bg-[#17171B] text-white"
                                : "border-gray-200 bg-white text-gray-600 hover:border-[#78D94F] hover:text-[#17171B]"
                            }`}
                          >
                            <input
                              type="radio"
                              name="subject"
                              value={s}
                              checked={on}
                              onChange={() => setField("subject", s)}
                              className="sr-only"
                            />
                            {s}
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="message" className={labelCls}>
                      Your Message <span className="text-[#78D94F]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={(e) => setField("message", e.target.value)}
                      onBlur={() => onBlur("message")}
                      rows={5}
                      maxLength={MAX_MESSAGE}
                      placeholder="Tell us how we can help..."
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby="message-err"
                      className={`${inputCls(errors.message)} resize-none`}
                    />
                    <div className="flex items-start justify-between gap-4">
                      {errLine("message")}
                      <span className="mt-1.5 shrink-0 text-xs text-gray-400">
                        {formData.message.length}/{MAX_MESSAGE}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className={`group mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border-0 bg-[#78D94F] px-8 py-4 text-sm font-bold tracking-[0.1em] text-[#17171B] shadow-[0_10px_30px_rgba(120,217,79,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#17171B] hover:text-white disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0 disabled:hover:bg-[#78D94F] disabled:hover:text-[#17171B] ${focus}`}
                  >
                    {sending ? (
                      <>
                        <span
                          className="h-4 w-4 animate-spin rounded-full border-2 border-[#17171B]/30 border-t-[#17171B]"
                          aria-hidden="true"
                        />
                        SENDING
                      </>
                    ) : (
                      <>
                        SEND MESSAGE
                        <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                          <Icon name="send" size={18} />
                        </span>
                      </>
                    )}
                  </button>

                  <p className="mb-0 mt-4 text-center text-xs text-gray-400">
                    Demo form only. Connect a backend before accepting real
                    customer enquiries.
                  </p>
                </form>

                <div
                  role="status"
                  aria-live="polite"
                  aria-hidden={!submitted}
                  className={`col-start-1 row-start-1 flex flex-col items-center justify-center rounded-2xl bg-[#78D94F]/10 p-7 text-center transition-all duration-500 ${
                    submitted
                      ? "translate-y-0 opacity-100 delay-200"
                      : "pointer-events-none translate-y-3 opacity-0"
                  }`}
                >
                  <span
                    className={`grid h-16 w-16 place-items-center rounded-full bg-[#78D94F] text-3xl font-bold text-[#17171B] transition-transform duration-500 ${
                      submitted ? "scale-100 delay-300" : "scale-0"
                    }`}
                  >
                    ✓
                  </span>
                  <h3 className={`${head} m-0 mt-5 text-xl font-extrabold text-[#17171B]`}>
                    Message Submitted!
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Your message passed the frontend demo form validation. No
                    email or support ticket has been sent yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData(initialForm);
                      setErrors({});
                    }}
                    className={`mt-6 cursor-pointer rounded-full border-0 bg-[#17171B] px-6 py-3 text-xs font-bold tracking-[0.14em] text-white transition hover:bg-[#78D94F] hover:text-[#17171B] ${focus}`}
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              </div>
            </div>

            {/* Business information */}
            <div className="flex flex-col gap-7">
              <div data-reveal style={delay(100)} className={rv}>
                <p className={`${eyebrow} m-0 text-green-700`}>
                  <span className="h-0.5 w-8 bg-[#78D94F]" />
                  Contact Information
                </p>

                <h2
                  className={`${head} mt-3 text-2xl font-semibold text-[#17171B] sm:text-3xl`}
                >
                  We&apos;d Love to Hear From You
                </h2>

                <p className="mt-5 leading-8 text-gray-600">
                  Whether you need help choosing the perfect artwork, tracking
                  an order or creating a custom design, get in touch with our
                  team.
                </p>
              </div>

              <div
                data-reveal
                style={delay(200)}
                className={`${rv} relative overflow-hidden rounded-3xl bg-[#17171B] p-8 text-white`}
              >
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#78D94F]/15 blur-3xl" />

                <h3 className={`${head} relative m-0 text-xl font-extrabold`}>
                  Epic Store
                </h3>
                <p className="relative mt-4 text-sm leading-7 text-gray-300">
                  Creative products and stylish designs to make every space
                  more personal.
                </p>

                <ul className="relative m-0 mt-8 list-none space-y-5 p-0">
                  {[
                    { icon: "pin" as const, label: "Our Location", value: "Business address to be added" },
                    { icon: "mail" as const, label: "Email", value: EMAIL },
                    { icon: "phone" as const, label: "Phone", value: PHONE_DISPLAY },
                  ].map((row) => (
                    <li key={row.label} className="flex gap-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#78D94F]/15 text-[#78D94F]">
                        <Icon name={row.icon} size={18} />
                      </span>
                      <div>
                        <p className="m-0 font-semibold">{row.label}</p>
                        <p className="m-0 mt-1 break-all text-sm text-gray-400">{row.value}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Map placeholder */}
              <div
                data-reveal
                style={delay(300)}
                className={`${rv} relative flex min-h-56 flex-1 flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
                <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#78D94F]/20 text-[#17171B]">
                  <Icon name="pin" size={26} />
                </span>
                <h3 className={`${head} relative m-0 mt-4 font-bold text-[#17171B]`}>
                  Find Epic Store
                </h3>
                <p className="relative mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  Add the client&apos;s actual business address and Google Maps
                  embed here.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FAQ SHORTCUT ================= */}
        <section className="px-4 py-16 sm:px-6 lg:px-10">
          <div
            data-reveal
            className={`${rv} relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl bg-[#78D94F] p-8 text-center md:flex-row md:p-12 md:text-left`}
          >
            <span
              aria-hidden="true"
              className={`${head} pointer-events-none absolute -bottom-6 right-6 select-none text-[160px] font-extrabold leading-none text-[#17171B]/[0.06]`}
            >
              ?
            </span>

            <div className="relative">
              <p className="m-0 text-xs font-bold uppercase tracking-[0.25em] text-[#17171B]/60">
                Need Quick Answers?
              </p>
              <h2
                className={`${head} mt-3 text-2xl font-extrabold text-[#17171B] md:text-3xl`}
              >
                Check Our Frequently Asked Questions
              </h2>
              <p className="mt-3 text-sm text-[#17171B]/70">
                Find helpful information about orders, delivery, payments and
                returns.
              </p>
            </div>

            <Link
              href="/faq"
              className={`group relative inline-flex shrink-0 items-center gap-3 rounded-full bg-[#17171B] px-8 py-4 text-sm font-bold tracking-[0.1em] text-white no-underline transition duration-300 hover:-translate-y-0.5 hover:bg-black ${focus}`}
            >
              VISIT FAQS
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}