"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Inter, Montserrat } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { clearStoreCart, useStoreCart } from "@/lib/store";

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

const fallbackProducts = [
  {
    id: 1,
    name: "Football Stadium Legends Metal Poster (A3)",
    price: 699,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&q=85",
  },
  {
    id: 2,
    name: "F1 Circuit Telemetry XXL Desk Pad",
    price: 899,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=300&q=85",
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
  halfMobile?: boolean;
};

const contactFields: Field[] = [
  { name: "firstName", label: "First Name", placeholder: "First name", auto: "given-name", required: true, half: true, halfMobile: true },
  { name: "lastName", label: "Last Name", placeholder: "Last name", auto: "family-name", required: true, half: true, halfMobile: true },
  { name: "email", label: "Email Address", type: "email", placeholder: "example@email.com", auto: "email", required: true, half: true },
  { name: "phone", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile", auto: "tel-national", numeric: true, maxLength: 10, required: true, half: true },
];

const addressFields: Field[] = [
  { name: "address", label: "House / Building / Street", placeholder: "Complete street address", auto: "street-address", required: true },
  { name: "landmark", label: "Landmark", placeholder: "Nearby landmark (optional)" },
  { name: "city", label: "City", placeholder: "City", auto: "address-level2", required: true, half: true, halfMobile: true },
  { name: "pincode", label: "PIN Code", placeholder: "6-digit PIN", auto: "postal-code", numeric: true, maxLength: 6, required: true, half: true, halfMobile: true },
  { name: "state", label: "State", type: "select", auto: "address-level1", required: true, half: true },
];

const billingFields: Field[] = [
  { name: "billingAddress", label: "Billing Address", placeholder: "Complete billing address", required: true },
  { name: "billingCity", label: "City", placeholder: "City", required: true, half: true, halfMobile: true },
  { name: "billingPincode", label: "PIN Code", placeholder: "6-digit PIN", numeric: true, maxLength: 6, required: true, half: true, halfMobile: true },
  { name: "billingState", label: "State", type: "select", required: true, half: true },
];

const emptyForm: Record<string, string> = {
  firstName: "", lastName: "", email: "", phone: "", address: "", landmark: "",
  city: "", state: "", pincode: "",
  billingAddress: "", billingCity: "", billingState: "", billingPincode: "",
};

const steps = ["Cart", "Checkout", "Confirmation"];

const head = `${montserrat.className} font-[family-name:var(--font-montserrat)]`;
const valueFont = `${inter.className} font-[family-name:var(--font-inter)] tabular-nums`;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";
const rupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const card =
  "rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:rounded-3xl sm:p-6 md:p-8";

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
  const storeCart = useStoreCart();
  const products = storeCart.length > 0 ? storeCart : fallbackProducts;
  const [checkoutMode, setCheckoutMode] = useState<"guest" | "account">("guest");
  const [saveGuestInfo, setSaveGuestInfo] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [placing, setPlacing] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem("epic_store_guest_profile_v1");
        if (saved) {
          const parsed = JSON.parse(saved) as Record<string, string>;
          if (parsed && typeof parsed === "object") {
            setFormData((prev) => ({ ...prev, ...parsed }));
          }
        }
      } catch {
        /* ignore storage read errors */
      }
      setReady(true);
    });
    return () => cancelAnimationFrame(raf);
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

    setPlacing(true);
    void (async () => {
      const now = new Date();
      const datePart = `${now.getFullYear()}${String(
        now.getMonth() + 1
      ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
      let generatedId = `IFE-${datePart}`;
      try {
        const res = await fetch("/api/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "order",
            checkoutMode,
            ...formData,
            paymentMethod,
            items: products,
            subtotal,
            delivery,
            total,
          }),
        });
        const data = (await res.json()) as { ok?: boolean; orderId?: string };
        if (data?.orderId) generatedId = data.orderId;
      } catch {
        /* Fallback cleanly if offline */
      } finally {
        try {
          if (saveGuestInfo && checkoutMode === "guest") {
            localStorage.setItem(
              "epic_store_guest_profile_v1",
              JSON.stringify({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                landmark: formData.landmark,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
              })
            );
          } else if (!saveGuestInfo) {
            localStorage.removeItem("epic_store_guest_profile_v1");
          }
          const prevOrders = JSON.parse(
            localStorage.getItem("epic_store_guest_orders_v1") || "[]"
          ) as Array<Record<string, unknown>>;
          localStorage.setItem(
            "epic_store_guest_orders_v1",
            JSON.stringify([
              {
                orderId: generatedId,
                checkoutMode,
                email: formData.email,
                total,
                paymentMethod,
                createdAt: new Date().toISOString(),
              },
              ...(Array.isArray(prevOrders) ? prevOrders.slice(0, 9) : []),
            ])
          );
        } catch {
          /* ignore storage write errors */
        }
        clearStoreCart();
        setOrderId(generatedId);
        setPlacing(false);
        setOrderPlaced(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    })();
  };

  /* Render one form field (helper, not a component) */
  const field = (f: Field) => {
    const err = errors[f.name];
    const base = `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#17171B] outline-none transition placeholder:text-gray-400 focus:ring-2 sm:px-4 sm:py-3 ${
      err
        ? "border-red-400 focus:border-red-400 focus:ring-red-400/25"
        : "border-gray-200 hover:border-gray-300 focus:border-[#78D94F] focus:ring-[#78D94F]/25"
    }`;
    const spanCls = f.halfMobile
      ? "col-span-1"
      : f.half
        ? "col-span-2 sm:col-span-1"
        : "col-span-2";
    return (
      <div key={f.name} className={spanCls}>
        <label
          htmlFor={f.name}
          className="mb-1.5 block text-xs font-semibold text-[#17171B] sm:text-sm"
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
              className={`${base} cursor-pointer appearance-none pr-9 sm:pr-10 ${
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
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon name="chevron" size={16} />
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

        {err && (
          <p
            id={`${f.name}-err`}
            role="alert"
            className="mt-1 text-[11px] font-medium text-red-500 sm:text-xs"
          >
            {err}
          </p>
        )}
      </div>
    );
  };

  const sectionHead = (step: string, title: string, text: string) => (
    <div className="mb-4 sm:mb-6">
      <p className="m-0 flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-green-700 sm:gap-3 sm:text-xs sm:tracking-[0.25em]">
        <span className="h-0.5 w-6 bg-[#78D94F] sm:w-8" />
        {step}
      </p>
      <h2 className={`${head} mt-1.5 text-lg font-extrabold text-[#17171B] sm:mt-2.5 sm:text-2xl`}>
        {title}
      </h2>
      <p className="mt-1 text-xs text-gray-500 sm:mt-1.5 sm:text-sm">{text}</p>
    </div>
  );

  /* Order summary content, used in the sidebar and the mobile accordion */
  const summary = (
    <div>
      <ul className="m-0 list-none space-y-3.5 p-0 sm:space-y-4">
        {products.map((p) => (
          <li key={p.id} className="flex items-center gap-3.5">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-20 sm:w-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
              <span className={`${valueFont} absolute -right-0 -top-0 grid h-5 w-5 place-items-center rounded-bl-lg bg-[#17171B] text-[11px] font-bold text-white sm:h-6 sm:w-6 sm:rounded-bl-xl sm:text-xs`}>
                {p.quantity}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <h3 className={`${head} m-0 line-clamp-2 text-xs font-bold text-[#17171B] sm:text-sm`}>{p.name}</h3>
              <p className={`${valueFont} mt-1 text-xs font-bold text-[#17171B] sm:mt-1.5 sm:text-sm`}>
                {rupee(p.price * p.quantity)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="my-4 border-t border-gray-200 sm:my-6" />

      <dl className="m-0 space-y-2.5 text-xs sm:space-y-3.5 sm:text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-500">Subtotal</dt>
          <dd className={`${valueFont} m-0 font-semibold`}>{rupee(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Delivery</dt>
          <dd className={`${valueFont} m-0 font-semibold`}>
            {delivery === 0 ? <span className="text-green-700">FREE</span> : rupee(delivery)}
          </dd>
        </div>
      </dl>

      <div className="my-4 border-t border-dashed border-gray-200 sm:my-6" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[#17171B] sm:text-base">Total</span>
        <span className={`${valueFont} text-2xl font-extrabold text-[#17171B] sm:text-3xl`}>
          {rupee(total)}
        </span>
      </div>
      <p className="mt-2 text-[11px] text-gray-400 sm:mt-3 sm:text-xs">
        Inclusive of all taxes • Free shipping on orders ₹999+
      </p>
    </div>
  );

  const wrapperCls = `${montserrat.variable} ${inter.variable} ${inter.className} font-[family-name:var(--font-inter)]`;

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
              Order Confirmed
              <span className="h-0.5 w-8 bg-[#78D94F]" />
            </p>

            <h1 className={`${head} mt-4 text-3xl font-extrabold text-[#17171B] sm:text-4xl`}>
              Thank You for Your Order!
            </h1>

            <p className="mt-4 leading-7 text-gray-500">
              An automatic order confirmation email has been sent to{" "}
              <strong className="text-[#17171B]">{formData.email}</strong> from{" "}
              <strong className="text-[#17171B]">store.epicsports@gmail.com</strong>.
            </p>

            <div className="mt-6 space-y-3 rounded-2xl bg-[#F7F8F5] p-4 text-left sm:mt-8 sm:p-5">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Checkout Type</span>
                <span className="rounded-full bg-[#17171B] px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-[#78D94F]">
                  {checkoutMode === "guest" ? "Guest Checkout" : "Account Order"}
                </span>
              </div>
              {orderId && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Order ID</span>
                  <span className={`${valueFont} font-bold text-[#17171B]`}>{orderId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Order Amount</span>
                <span className={`${valueFont} font-bold text-[#17171B]`}>{rupee(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Payment Method</span>
                <span className="font-semibold text-[#17171B]">
                  {paymentMethod === "razorpay" ? "Razorpay (Online Payment)" : "Cash on Delivery"}
                </span>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/track-order?orderId=${encodeURIComponent(orderId)}&email=${encodeURIComponent(formData.email)}`}
                className={`inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#17171B] bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-[#17171B] no-underline transition hover:bg-[#17171B] hover:text-white ${focus}`}
              >
                Track Guest Order →
              </Link>
              <Link
                href="/shop"
                className={`group inline-flex items-center justify-center gap-3 rounded-full bg-[#78D94F] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-[#17171B] no-underline shadow-[0_10px_30px_rgba(120,217,79,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#17171B] hover:text-white ${focus}`}
              >
                CONTINUE SHOPPING
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
            </div>
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

      <main className={`${wrapperCls} min-h-screen bg-[#F7F8F5] pb-24 lg:pb-0`}>
        {/* Heading */}
        <section className="relative overflow-hidden bg-[#17171B] px-4 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hero-banners/cart-hero.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right opacity-85"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#17171B]/90 via-[#17171B]/55 to-[#17171B]/15" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_left,black,transparent_75%)]" />

          <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="mb-1.5 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#78D94F] sm:mb-2.5 sm:gap-3 sm:text-xs sm:tracking-[0.25em]">
                <span className="h-0.5 w-7 bg-[#78D94F] sm:w-10" />
                Almost There
              </p>
              <h1
                className={`${head} text-2xl font-extrabold uppercase leading-[1.04] tracking-tight text-white sm:text-4xl lg:text-5xl`}
              >
                Check<span className="text-[#78D94F]">out.</span>
              </h1>
            </div>

            <ol
              aria-label="Checkout progress"
              className="m-0 flex list-none items-center gap-2 p-0 text-[10px] font-bold tracking-[0.12em] sm:gap-3 sm:text-xs sm:tracking-[0.14em]"
            >
              {steps.map((s, i) => (
                <li key={s} className="flex items-center gap-2 sm:gap-3">
                  {i === 0 ? (
                    <Link
                      href="/cart"
                      className={`flex items-center gap-2 text-gray-300 no-underline transition hover:text-white sm:gap-3 ${focus}`}
                    >
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-[#78D94F]/25 text-[#78D94F] sm:h-8 sm:w-8">
                        ✓
                      </span>
                      {s.toUpperCase()}
                    </Link>
                  ) : (
                    <>
                      <span
                        className={`${valueFont} grid h-6 w-6 place-items-center rounded-full sm:h-8 sm:w-8 ${
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
                  {i < steps.length - 1 && <span className="h-px w-4 bg-white/20 sm:w-10" />}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-3.5 py-5 sm:gap-6 sm:px-6 sm:py-9 lg:grid-cols-3 lg:gap-8 lg:px-10 lg:py-12">
          {/* Mobile order summary accordion */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setSummaryOpen((o) => !o)}
              aria-expanded={summaryOpen}
              className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-left shadow-sm ${focus}`}
            >
              <span className="flex items-center gap-2.5 text-xs font-bold text-[#17171B] sm:text-sm">
                Order summary (<span className={valueFont}>{itemCount}</span>{" "}
                {itemCount === 1 ? "item" : "items"})
                <span
                  className={`transition-transform duration-300 ${summaryOpen ? "rotate-180" : ""}`}
                >
                  <Icon name="chevron" size={16} />
                </span>
              </span>
              <span className={`${valueFont} text-base font-extrabold text-[#17171B] sm:text-lg`}>
                {rupee(total)}
              </span>
            </button>

            <div
              className={`grid transition-all duration-500 ease-out ${
                summaryOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="mt-2.5 rounded-2xl border border-gray-200 bg-white p-4">
                  {summary}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-2">
            {/* Guest vs Account Checkout Mode */}
            <div
              className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:rounded-3xl sm:p-5`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="m-0 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-green-700">
                    <span className="h-0.5 w-5 bg-[#78D94F]" />
                    Express Checkout
                  </p>
                  <h2 className={`${head} mt-1 text-base font-extrabold text-[#17171B] sm:text-lg`}>
                    {checkoutMode === "guest"
                      ? "Checking Out as Guest"
                      : "Account Checkout"}
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {checkoutMode === "guest"
                      ? "No account or password needed — track your order anytime via email."
                      : "Sign in to sync your order with your Epic Store account."}
                  </p>
                </div>

                <div
                  role="tablist"
                  aria-label="Checkout mode"
                  className="inline-flex shrink-0 rounded-full border border-gray-200 bg-[#F7F8F5] p-1"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={checkoutMode === "guest"}
                    onClick={() => setCheckoutMode("guest")}
                    className={`${head} cursor-pointer rounded-full border-0 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.1em] transition ${
                      checkoutMode === "guest"
                        ? "bg-[#17171B] text-[#78D94F]"
                        : "bg-transparent text-gray-600 hover:text-[#17171B]"
                    } ${focus}`}
                  >
                    Guest
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={checkoutMode === "account"}
                    onClick={() => setCheckoutMode("account")}
                    className={`${head} cursor-pointer rounded-full border-0 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.1em] transition ${
                      checkoutMode === "account"
                        ? "bg-[#17171B] text-[#78D94F]"
                        : "bg-transparent text-gray-600 hover:text-[#17171B]"
                    } ${focus}`}
                  >
                    Sign In
                  </button>
                </div>
              </div>

              {checkoutMode === "account" && (
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-[#F7F8F5] px-4 py-3 text-xs">
                  <span className="text-gray-600">
                    Have an Epic Store account? Sign in with your mobile OTP or continue as guest.
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      className={`${head} rounded-full bg-[#78D94F] px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#17171B] no-underline transition hover:bg-[#17171B] hover:text-white`}
                    >
                      Go to Sign In →
                    </Link>
                    <button
                      type="button"
                      onClick={() => setCheckoutMode("guest")}
                      className="cursor-pointer border-0 bg-transparent text-[11px] font-bold text-gray-500 underline hover:text-[#17171B]"
                    >
                      Use Guest Instead
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Contact */}
            <div
              className={`${card} transition-all duration-700 ${
                ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              {sectionHead("Step 01", "Contact Information", "Enter your details for order updates.")}
              <div className="grid grid-cols-2 gap-3 sm:gap-x-5 sm:gap-y-4">{contactFields.map(field)}</div>
              {checkoutMode === "guest" && (
                <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-xs font-medium text-gray-600 sm:mt-4 sm:text-sm">
                  <input
                    type="checkbox"
                    checked={saveGuestInfo}
                    onChange={(e) => setSaveGuestInfo(e.target.checked)}
                    className="h-4 w-4 cursor-pointer accent-[#78D94F]"
                  />
                  Save my contact &amp; delivery details on this device for faster guest checkout
                </label>
              )}
            </div>

            {/* Delivery address */}
            <div
              style={{ transitionDelay: "100ms" }}
              className={`${card} transition-all duration-700 ${
                ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              {sectionHead("Step 02", "Delivery Address", "Where should we deliver your order?")}
              <div className="grid grid-cols-2 gap-3 sm:gap-x-5 sm:gap-y-4">{addressFields.map(field)}</div>

              <label className="mt-3.5 flex cursor-pointer items-center gap-2.5 text-xs font-medium text-gray-600 sm:mt-4 sm:gap-3 sm:text-sm">
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
                    <div className="mt-4 border-t border-dashed border-gray-200 pt-4 sm:mt-6 sm:pt-6">
                      <h3 className={`${head} mb-3.5 text-sm font-bold text-[#17171B] sm:mb-5 sm:text-base`}>
                        Billing Address
                      </h3>
                      <div className="grid grid-cols-2 gap-3 sm:gap-x-5 sm:gap-y-4">
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

              <div role="radiogroup" aria-label="Payment method" className="space-y-3 sm:space-y-4">
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
                    text: "Pay when your order is delivered, if available for your PIN.",
                  },
                ].map((o) => {
                  const on = paymentMethod === o.value;
                  return (
                    <label
                      key={o.value}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition duration-300 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#78D94F] sm:gap-4 sm:rounded-2xl sm:p-5 ${
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
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition duration-300 sm:h-11 sm:w-11 ${
                          on ? "bg-[#78D94F] text-[#17171B]" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Icon name={o.icon} size={18} />
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className={`${head} m-0 text-sm font-bold text-[#17171B] sm:text-base`}>{o.title}</h3>
                          {o.tag && (
                            <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-gray-600 sm:px-3 sm:py-1 sm:text-xs">
                              {o.tag}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500 sm:mt-1.5 sm:text-sm">{o.text}</p>
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

              <div className="mt-4 rounded-xl bg-[#F7F8F5] p-3 text-[11px] leading-5 text-gray-500 sm:mt-5 sm:p-4 sm:text-xs sm:leading-6">
                Demo interface: Razorpay has not been connected yet. No payment
                will be collected from this page.
              </div>
            </div>

            {/* Place order */}
            <div className="flex flex-col-reverse items-center justify-between gap-3.5 pt-1 sm:flex-row sm:gap-4">
              <Link
                href="/cart"
                className={`group inline-flex items-center gap-2 text-sm font-semibold text-gray-500 no-underline transition hover:text-[#17171B] ${focus}`}
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                Back to Cart
              </Link>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placing}
                className={`${head} group inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border-0 bg-[#78D94F] px-8 py-3.5 text-xs font-extrabold tracking-[0.12em] text-[#17171B] shadow-[0_10px_30px_rgba(120,217,79,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#17171B] hover:text-white disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0 disabled:hover:bg-[#78D94F] disabled:hover:text-[#17171B] sm:w-auto sm:py-4 sm:text-sm ${focus}`}
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
                    PLACE ORDER · <span className={valueFont}>{rupee(total)}</span>
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

      {/* Sticky Mobile Checkout Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-gray-200 bg-white/95 px-4 py-2.5 backdrop-blur-md shadow-[0_-8px_24px_rgba(23,23,27,0.08)] lg:hidden">
        <div>
          <p className="text-[11px] font-semibold text-gray-500">
            Total (<span className={valueFont}>{itemCount}</span> {itemCount === 1 ? "item" : "items"})
          </p>
          <p className={`${valueFont} text-lg font-extrabold leading-tight text-[#17171B]`}>
            {rupee(total)}
          </p>
        </div>
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={placing}
          className={`${head} inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-[#78D94F] px-6 text-xs font-extrabold uppercase tracking-[0.14em] text-[#17171B] transition disabled:opacity-80 ${focus}`}
        >
          {placing ? "Placing..." : "Place Order →"}
        </button>
      </div>

      <Footer />
    </>
  );
}