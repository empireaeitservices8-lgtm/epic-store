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

/* TODO: replace with your real cart data */
const products = [
  {
    id: 1,
    name: "Astronaut Space Poster",
    price: 499,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=300",
  },
  {
    id: 2,
    name: "Abstract Modern Art",
    price: 599,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300",
  },
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "select";
  auto?: string;
  numeric?: boolean;
  maxLength?: number;
  required?: boolean;
  half?: boolean;
};

const contactFields: Field[] = [
  { name: "firstName", label: "First Name", placeholder: "Enter first name", auto: "given-name", required: true, half: true },
  { name: "lastName", label: "Last Name", placeholder: "Enter last name", auto: "family-name", required: true, half: true },
  { name: "email", label: "Email Address", type: "email", placeholder: "example@email.com", auto: "email", required: true, half: true },
  { name: "phone", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile number", auto: "tel-national", numeric: true, maxLength: 10, required: true, half: true },
];

const addressFields: Field[] = [
  { name: "address", label: "House / Building / Street Address", placeholder: "Enter complete address", auto: "street-address", required: true },
  { name: "landmark", label: "Landmark", placeholder: "Nearby landmark (optional)" },
  { name: "city", label: "City", placeholder: "Enter city", auto: "address-level2", required: true, half: true },
  { name: "state", label: "State", type: "select", auto: "address-level1", required: true, half: true },
  { name: "pincode", label: "PIN Code", placeholder: "6-digit PIN code", auto: "postal-code", numeric: true, maxLength: 6, required: true, half: true },
];

const billingFields: Field[] = [
  { name: "billingAddress", label: "Billing Address", placeholder: "Enter complete billing address", required: true },
  { name: "billingCity", label: "City", placeholder: "Enter city", required: true, half: true },
  { name: "billingState", label: "State", type: "select", required: true, half: true },
  { name: "billingPincode", label: "PIN Code", placeholder: "6-digit PIN code", numeric: true, maxLength: 6, required: true, half: true },
];

const emptyForm: Record<string, string> = {
  firstName: "", lastName: "", email: "", phone: "", address: "", landmark: "",
  city: "", state: "", pincode: "",
  billingAddress: "", billingCity: "", billingState: "", billingPincode: "",
};

const steps = ["Cart", "Checkout", "Confirmation"];

const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";
const rupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const card =
  "rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] md:p-8";

/* Validate one field; returns an error message or "" */
function validateField(name: string, value: string, billing: boolean): string {
  const v = value.trim();
  const isBilling = name.startsWith("billing");
  if (isBilling && !billing) return "";
  const required = ![ "landmark" ].includes(name);
  if (required && !v) return "This field is required";
  if (name === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    return "Enter a valid email address";
  if (name === "phone" && v && !/^[6-9]\d{9}$/.test(v))
    return "Enter a valid 10-digit Indian mobile number";
  if ((name === "pincode" || name === "billingPincode") && v && !/^\d{6}$/.test(v))
    return "Enter a valid 6-digit PIN code";
  return "";
}

const icons = {
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2.5" />
      <path d="M3 10h18M7 15h3" />
    </>
  ),
  cash: (
    <>
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
};

function Icon({ name, size = 20 }: { name: keyof typeof icons; size?: number }) {
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

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const placeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true));
    return () => {
      cancelAnimationFrame(raf);
      if (placeTimer.current) clearTimeout(placeTimer.current);
    };
  }, []);

  const subtotal = products.reduce((t, i) => t + i.price * i.quantity, 0);
  const delivery = subtotal >= 999 ? 0 : 49;
  const total = subtotal + delivery;
  const itemCount = products.reduce((n, i) => n + i.quantity, 0);

  const setValue = (f: Field, raw: string) => {
    const value = f.numeric ? raw.replace(/\D/g, "") : raw;
    setFormData((p) => ({ ...p, [f.name]: value }));
    setErrors((p) => (p[f.name] ? { ...p, [f.name]: "" } : p));
  };

  const onBlur = (name: string) => {
    const msg = validateField(name, formData[name], !sameAsBilling);
    setErrors((p) => ({ ...p, [name]: msg }));
  };

  const handlePlaceOrder = () => {
    const all = [...contactFields, ...addressFields, ...(sameAsBilling ? [] : billingFields)];
    const next: Record<string, string> = {};
    all.forEach((f) => {
      const msg = validateField(f.name, formData[f.name], !sameAsBilling);
      if (msg) next[f.name] = msg;
    });
    setErrors(next);

    const firstInvalid = all.find((f) => next[f.name]);
    if (firstInvalid) {
      const el = document.getElementById(firstInvalid.name);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }

    /* Demo only: no real payment or order is created. */
    setPlacing(true);
    placeTimer.current = setTimeout(() => {
      setPlacing(false);
      setOrderPlaced(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1100);
  };

  /* Render one form field (helper, not a component) */
  const field = (f: Field) => {
    const err = errors[f.name];
    const base = `w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-[#17171B] outline-none transition placeholder:text-gray-400 focus:ring-2 ${
      err
        ? "border-red-400 focus:border-red-400 focus:ring-red-400/25"
        : "border-gray-200 hover:border-gray-300 focus:border-[#78D94F] focus:ring-[#78D94F]/25"
    }`;
    return (
      <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
        <label
          htmlFor={f.name}
          className="mb-2 block text-sm font-semibold text-[#17171B]"
        >
          {f.label}
          {f.required && <span className="text-[#78D94F]"> *</span>}
        </label>

        {f.type === "select" ? (
          <div className="relative">
            <select
              id={f.name}
              name={f.name}
              value={formData[f.name]}
              onChange={(e) => setValue(f, e.target.value)}
              onBlur={() => onBlur(f.name)}
              autoComplete={f.auto}
              aria-invalid={Boolean(err)}
              aria-describedby={err ? `${f.name}-err` : undefined}
              className={`${base} cursor-pointer appearance-none pr-10 ${
                formData[f.name] ? "" : "text-gray-400"
              }`}
            >
              <option value="">Select state</option>
              {indianStates.map((s) => (
                <option key={s} value={s} className="text-[#17171B]">
                  {s}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon name="chevron" size={18} />
            </span>
          </div>
        ) : (
          <input
            id={f.name}
            name={f.name}
            type={f.type ?? "text"}
            value={formData[f.name]}
            onChange={(e) => setValue(f, e.target.value)}
            onBlur={() => onBlur(f.name)}
            placeholder={f.placeholder}
            autoComplete={f.auto}
            inputMode={f.numeric ? "numeric" : undefined}
            maxLength={f.maxLength}
            aria-invalid={Boolean(err)}
            aria-describedby={err ? `${f.name}-err` : undefined}
            className={base}
          />
        )}

        <p
          id={`${f.name}-err`}
          role={err ? "alert" : undefined}
          className={`mt-1.5 min-h-4 text-xs text-red-500 transition-opacity duration-300 ${
            err ? "opacity-100" : "opacity-0"
          }`}
        >
          {err}
        </p>
      </div>
    );
  };

  const sectionHead = (step: string, title: string, text: string) => (
    <div className="mb-7">
      <p className="m-0 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-green-700">
        <span className="h-0.5 w-8 bg-[#78D94F]" />
        {step}
      </p>
      <h2 className={`${head} mt-3 text-xl font-extrabold text-[#17171B] sm:text-2xl`}>
        {title}
      </h2>
      <p className="mt-2 text-sm text-gray-500">{text}</p>
    </div>
  );

  /* Order summary content, used in the sidebar and the mobile accordion */
  const summary = (
    <div>
      <ul className="m-0 list-none space-y-5 p-0">
        {products.map((p) => (
          <li key={p.id} className="flex gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
              <span className="absolute -right-0 -top-0 grid h-6 w-6 place-items-center rounded-bl-xl bg-[#17171B] text-xs font-bold text-white">
                {p.quantity}
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <h3 className={`${head} m-0 text-sm font-bold text-[#17171B]`}>{p.name}</h3>
              <p className="mt-2 text-sm font-bold text-[#17171B]">
                {rupee(p.price * p.quantity)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="my-6 border-t border-gray-200" />

      <dl className="m-0 space-y-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-500">Subtotal</dt>
          <dd className="m-0 font-semibold">{rupee(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Delivery</dt>
          <dd className="m-0 font-semibold">
            {delivery === 0 ? <span className="text-green-700">FREE</span> : rupee(delivery)}
          </dd>
        </div>
      </dl>

      <div className="my-6 border-t border-dashed border-gray-200" />

      <div className="flex items-center justify-between">
        <span className="font-bold text-[#17171B]">Total</span>
        <span className={`${head} text-3xl font-extrabold text-[#17171B]`}>
          {rupee(total)}
        </span>
      </div>
      <p className="mt-3 text-xs text-gray-400">
        Inclusive of applicable charges in this demo calculation.
      </p>
    </div>
  );

  const wrapperCls = `${syne.variable} ${inter.variable} font-[family-name:var(--font-inter)]`;

  /* ================= SUCCESS ================= */
  if (orderPlaced) {
    return (
      <>
        <Header />

        <main
          className={`${wrapperCls} relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#F7F8F5] px-5 py-16`}
        >
          <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#78D94F]/10 blur-3xl" />

          <div
            className={`relative w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-700 md:p-12 ${
              ready ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#78D94F] text-4xl font-bold text-[#17171B] shadow-[0_10px_30px_rgba(120,217,79,0.4)]">
              ✓
            </div>

            <p className="mt-7 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-green-700">
              <span className="h-0.5 w-8 bg-[#78D94F]" />
              Demo Order Confirmation
              <span className="h-0.5 w-8 bg-[#78D94F]" />
            </p>

            <h1 className={`${head} mt-4 text-3xl font-extrabold text-[#17171B] sm:text-4xl`}>
              Thank You for Your Order!
            </h1>

            <p className="mt-4 leading-7 text-gray-500">
              Your checkout form has been submitted successfully in this
              frontend demo. No real order or payment has been created.
            </p>

            <div className="mt-8 space-y-3 rounded-2xl bg-[#F7F8F5] p-5 text-left">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Demo Order Amount</span>
                <span className="font-bold text-[#17171B]">{rupee(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Payment Method</span>
                <span className="font-semibold text-[#17171B]">
                  {paymentMethod === "razorpay" ? "Razorpay (not connected)" : "Cash on Delivery"}
                </span>
              </div>
            </div>

            <Link
              href="/shop"
              className={`group mt-8 inline-flex items-center gap-3 rounded-full bg-[#78D94F] px-8 py-4 text-sm font-bold tracking-[0.1em] text-[#17171B] no-underline shadow-[0_10px_30px_rgba(120,217,79,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#17171B] hover:text-white ${focus}`}
            >
              CONTINUE SHOPPING
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  /* ================= CHECKOUT ================= */
  return (
    <>
      <Header />

      <main className={`${wrapperCls} min-h-screen bg-[#F7F8F5]`}>
        {/* Heading */}
        <section className="relative overflow-hidden bg-[#17171B] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_left,black,transparent_75%)]" />

          <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#78D94F]">
                <span className="h-0.5 w-10 bg-[#78D94F]" />
                Almost There
              </p>
              <h1
                className={`${head} text-4xl font-extrabold uppercase leading-[1.02] tracking-tight text-white sm:text-5xl`}
              >
                Check<span className="text-[#78D94F]">out.</span>
              </h1>
            </div>

            <ol
              aria-label="Checkout progress"
              className="m-0 flex list-none items-center gap-3 p-0 text-xs font-bold tracking-[0.14em]"
            >
              {steps.map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  {i === 0 ? (
                    <Link
                      href="/cart"
                      className={`flex items-center gap-3 text-gray-300 no-underline transition hover:text-white ${focus}`}
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#78D94F]/25 text-[#78D94F]">
                        ✓
                      </span>
                      {s.toUpperCase()}
                    </Link>
                  ) : (
                    <>
                      <span
                        className={`${head} grid h-8 w-8 place-items-center rounded-full ${
                          i === 1
                            ? "bg-[#78D94F] text-[#17171B]"
                            : "border border-white/20 text-gray-400"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className={i === 1 ? "text-white" : "hidden text-gray-500 sm:inline"}>
                        {s.toUpperCase()}
                      </span>
                    </>
                  )}
                  {i < steps.length - 1 && <span className="h-px w-5 bg-white/20 sm:w-10" />}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-10 lg:py-14">
          {/* Mobile order summary accordion */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setSummaryOpen((o) => !o)}
              aria-expanded={summaryOpen}
              className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left ${focus}`}
            >
              <span className="flex items-center gap-3 text-sm font-bold text-[#17171B]">
                Order summary ({itemCount} {itemCount === 1 ? "item" : "items"})
                <span
                  className={`transition-transform duration-300 ${summaryOpen ? "rotate-180" : ""}`}
                >
                  <Icon name="chevron" size={18} />
                </span>
              </span>
              <span className={`${head} text-lg font-extrabold text-[#17171B]`}>
                {rupee(total)}
              </span>
            </button>

            <div
              className={`grid transition-all duration-500 ease-out ${
                summaryOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-5">
                  {summary}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Contact */}
            <div
              className={`${card} transition-all duration-700 ${
                ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              {sectionHead("Step 01", "Contact Information", "Enter your details for order updates.")}
              <div className="grid gap-x-5 sm:grid-cols-2">{contactFields.map(field)}</div>
            </div>

            {/* Delivery address */}
            <div
              style={{ transitionDelay: "100ms" }}
              className={`${card} transition-all duration-700 ${
                ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              {sectionHead("Step 02", "Delivery Address", "Where should we deliver your order?")}
              <div className="grid gap-x-5 sm:grid-cols-2">{addressFields.map(field)}</div>

              <label className="mt-2 flex cursor-pointer items-center gap-3 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={(e) => setSameAsBilling(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-[#78D94F]"
                />
                Use this address as my billing address
              </label>

              {/* Billing address, revealed when unchecked */}
              <div
                className={`grid transition-all duration-500 ease-out ${
                  sameAsBilling ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  {!sameAsBilling && (
                    <div className="mt-6 border-t border-dashed border-gray-200 pt-6">
                      <h3 className={`${head} mb-5 text-base font-bold text-[#17171B]`}>
                        Billing Address
                      </h3>
                      <div className="grid gap-x-5 sm:grid-cols-2">
                        {billingFields.map(field)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div
              style={{ transitionDelay: "200ms" }}
              className={`${card} transition-all duration-700 ${
                ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              {sectionHead("Step 03", "Payment Method", "Select your preferred payment method.")}

              <div role="radiogroup" aria-label="Payment method" className="space-y-4">
                {[
                  {
                    value: "razorpay",
                    icon: "card" as const,
                    title: "Online Payment",
                    tag: "Razorpay",
                    text: "UPI, Debit Card, Credit Card, Net Banking and Wallets.",
                  },
                  {
                    value: "cod",
                    icon: "cash" as const,
                    title: "Cash on Delivery",
                    tag: "",
                    text: "Pay when your order is delivered, if this option is available for your location.",
                  },
                ].map((o) => {
                  const on = paymentMethod === o.value;
                  return (
                    <label
                      key={o.value}
                      className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition duration-300 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#78D94F] ${
                        on
                          ? "border-[#78D94F] bg-[#78D94F]/10 shadow-[0_10px_30px_rgba(120,217,79,0.15)]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={o.value}
                        checked={on}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition duration-300 ${
                          on ? "bg-[#78D94F] text-[#17171B]" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Icon name={o.icon} />
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className={`${head} m-0 font-bold text-[#17171B]`}>{o.title}</h3>
                          {o.tag && (
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600">
                              {o.tag}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{o.text}</p>
                      </div>
                      <span
                        aria-hidden="true"
                        className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition duration-300 ${
                          on ? "border-[#78D94F] bg-[#78D94F]" : "border-gray-300"
                        }`}
                      >
                        {on && <span className="h-1.5 w-1.5 rounded-full bg-[#17171B]" />}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-5 rounded-xl bg-[#F7F8F5] p-4 text-xs leading-6 text-gray-500">
                Demo interface: Razorpay has not been connected yet. No payment
                will be collected from this page.
              </div>
            </div>

            {/* Place order */}
            <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
              <Link
                href="/cart"
                className={`group inline-flex items-center gap-2 font-semibold text-gray-500 no-underline transition hover:text-[#17171B] ${focus}`}
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                Back to Cart
              </Link>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placing}
                className={`group inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border-0 bg-[#78D94F] px-8 py-4 text-sm font-bold tracking-[0.1em] text-[#17171B] shadow-[0_10px_30px_rgba(120,217,79,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#17171B] hover:text-white disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0 disabled:hover:bg-[#78D94F] disabled:hover:text-[#17171B] sm:w-auto ${focus}`}
              >
                {placing ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-[#17171B]/30 border-t-[#17171B]"
                      aria-hidden="true"
                    />
                    PLACING ORDER
                  </>
                ) : (
                  <>
                    PLACE ORDER · {rupee(total)}
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                      →
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Desktop order summary */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <h2 className={`${head} mb-6 text-xl font-extrabold text-[#17171B]`}>
                Your Order
              </h2>

              {summary}

              <div className="mt-7 rounded-2xl bg-[#F7F8F5] p-4">
                <div className="flex items-center gap-2 text-[#17171B]">
                  <Icon name="lock" size={16} />
                  <p className="m-0 text-sm font-bold">Secure Checkout</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Your checkout details are shown in this frontend demo.
                  Production checkout requires secure server-side order
                  processing.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}