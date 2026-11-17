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

type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  image: string;
  quantity: number;
};

/* TODO: replace with your real cart state / API */
const initialCart: CartItem[] = [
  {
    id: 1,
    name: "Astronaut Space Poster",
    category: "Posters",
    price: 499,
    oldPrice: 799,
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=500",
    quantity: 1,
  },
  {
    id: 2,
    name: "Abstract Modern Art",
    category: "Canvas Prints",
    price: 599,
    oldPrice: 899,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500",
    quantity: 1,
  },
];

const FREE_DELIVERY_AT = 999; /* same rule as before */
const DELIVERY_CHARGE = 49;
const MAX_QTY = 10;

const steps = ["Cart", "Checkout", "Done"];

const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";
const rupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const icons = {
  truck: (
    <>
      <path d="M3 6h11v10H3z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  returns: (
    <>
      <path d="M4 9h11a5 5 0 0 1 0 10H8" />
      <path d="M8 5 4 9l4 4" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M10 11v6M14 11v6" />
      <path d="M6 7l1 13h10l1-13M9 7V4h6v3" />
    </>
  ),
  bag: (
    <>
      <path d="M5.5 8h13l1 12h-15l1-12z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </>
  ),
};

function Icon({
  name,
  size = 20,
}: {
  name: keyof typeof icons;
  size?: number;
}) {
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

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);
  const [removing, setRemoving] = useState<number | null>(null);
  const [undo, setUndo] = useState<{ item: CartItem; index: number } | null>(null);
  const [ready, setReady] = useState(false);
  const removeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setReady(true);
    return () => {
      if (removeTimer.current) clearTimeout(removeTimer.current);
      if (undoTimer.current) clearTimeout(undoTimer.current);
    };
  }, []);

  const updateQuantity = (id: number, amount: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(MAX_QTY, Math.max(1, item.quantity + amount)) }
          : item
      )
    );
  };

  /* Collapse the row, then remove it and offer Undo */
  const removeItem = (id: number) => {
    setRemoving(id);
    if (removeTimer.current) clearTimeout(removeTimer.current);
    removeTimer.current = setTimeout(() => {
      setCartItems((items) => {
        const index = items.findIndex((i) => i.id === id);
        if (index === -1) return items;
        setUndo({ item: items[index], index });
        return items.filter((i) => i.id !== id);
      });
      setRemoving(null);
      if (undoTimer.current) clearTimeout(undoTimer.current);
      undoTimer.current = setTimeout(() => setUndo(null), 6000);
    }, 320);
  };

  const undoRemove = () => {
    if (!undo) return;
    setCartItems((items) => {
      const next = [...items];
      next.splice(Math.min(undo.index, next.length), 0, undo.item);
      return next;
    });
    setUndo(null);
  };

  const itemCount = cartItems.reduce((n, i) => n + i.quantity, 0);
  const subtotal = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const originalTotal = cartItems.reduce((t, i) => t + i.oldPrice * i.quantity, 0);
  const deliveryCharge = subtotal === 0 || subtotal >= FREE_DELIVERY_AT ? 0 : DELIVERY_CHARGE;
  const total = subtotal + deliveryCharge;
  const totalSavings = originalTotal - subtotal;

  const remaining = Math.max(FREE_DELIVERY_AT - subtotal, 0);
  const progress = Math.min(subtotal / FREE_DELIVERY_AT, 1) * 100;

  return (
    <>
      <Header />

      <main
        className={`${syne.variable} ${inter.variable} min-h-screen bg-[#F7F8F5] font-[family-name:var(--font-inter)]`}
      >
        {/* ================= PAGE HEADING ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_left,black,transparent_75%)]" />

          <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <nav
                aria-label="Breadcrumb"
                className="mb-5 flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-gray-400"
              >
                <Link
                  href="/"
                  className={`text-gray-400 no-underline transition hover:text-[#78D94F] ${focus}`}
                >
                  HOME
                </Link>
                <span>/</span>
                <span className="text-white">CART</span>
              </nav>

              <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#78D94F]">
                <span className="h-0.5 w-10 bg-[#78D94F]" />
                Your Shopping Bag
              </p>

              <h1
                className={`${head} text-4xl font-extrabold uppercase leading-[1.02] tracking-tight text-white sm:text-5xl`}
              >
                Shopping <span className="text-[#78D94F]">Cart.</span>
              </h1>

              <p className="mt-4 max-w-lg text-gray-400">
                Review your selected products before proceeding to checkout.
              </p>
            </div>

            {/* Progress steps */}
            <ol
              aria-label="Checkout progress"
              className="m-0 flex list-none items-center gap-3 p-0 text-xs font-bold tracking-[0.14em]"
            >
              {steps.map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full ${head} ${
                      i === 0
                        ? "bg-[#78D94F] text-[#17171B]"
                        : "border border-white/20 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={i === 0 ? "text-white" : "text-gray-500"}>
                    {s.toUpperCase()}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="h-px w-6 bg-white/20 sm:w-10" />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ================= CART ================= */}
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-10 lg:py-14">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className={`${head} text-xl font-extrabold text-[#17171B]`}>
                Cart Items ({cartItems.length})
              </h2>

              <Link
                href="/shop"
                className={`group inline-flex items-center gap-2 text-sm font-semibold text-[#17171B] no-underline transition hover:text-green-700 ${focus}`}
              >
                Continue Shopping
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            {/* Free delivery progress */}
            {cartItems.length > 0 && (
              <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-3 text-sm">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#78D94F]/20 text-[#17171B]">
                    <Icon name="truck" />
                  </span>
                  <p className="m-0 text-gray-600" aria-live="polite">
                    {remaining > 0 ? (
                      <>
                        Add{" "}
                        <strong className="text-[#17171B]">{rupee(remaining)}</strong>{" "}
                        more to get <strong className="text-[#17171B]">free delivery</strong>.
                      </>
                    ) : (
                      <strong className="text-green-700">
                        You've unlocked free delivery!
                      </strong>
                    )}
                  </p>
                </div>
                <div
                  className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                  aria-label="Progress to free delivery"
                >
                  <div
                    style={{ width: `${progress}%` }}
                    className="h-full rounded-full bg-[#78D94F] transition-all duration-700 ease-out"
                  />
                </div>
              </div>
            )}

            {cartItems.length > 0 ? (
              <ul className="m-0 list-none p-0">
                {cartItems.map((item, i) => {
                  const isRemoving = removing === item.id;
                  const off = Math.round((1 - item.price / item.oldPrice) * 100);
                  return (
                    <li
                      key={item.id}
                      className={`grid transition-all duration-300 ease-out ${
                        isRemoving ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
                      }`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div
                          style={{ transitionDelay: ready ? `${i * 80}ms` : "0ms" }}
                          className={`group mb-4 flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-700 hover:border-[#78D94F] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] sm:flex-row ${
                            ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                          }`}
                        >
                          {/* Image */}
                          <Link
                            href={`/products/${item.id}`}
                            aria-label={item.name}
                            className={`relative block h-44 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-36 sm:w-36 ${focus}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image}
                              alt={item.name}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <span className="absolute left-2 top-2 rounded-full bg-[#17171B] px-2.5 py-1 text-[10px] font-bold text-white">
                              {off}% OFF
                            </span>
                          </Link>

                          {/* Info */}
                          <div className="flex flex-1 flex-col justify-between">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                                  {item.category}
                                </p>

                                <Link
                                  href={`/products/${item.id}`}
                                  className={`${head} mt-2 block text-base font-bold leading-snug text-[#17171B] no-underline transition-colors hover:text-green-700 ${focus}`}
                                >
                                  {item.name}
                                </Link>

                                <div className="mt-2 flex items-center gap-2">
                                  <span className="font-bold text-[#17171B]">
                                    {rupee(item.price)}
                                  </span>
                                  <span className="text-sm text-gray-400 line-through">
                                    {rupee(item.oldPrice)}
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                aria-label={`Remove ${item.name} from cart`}
                                className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-gray-400 transition duration-300 hover:bg-red-50 hover:text-red-500 ${focus}`}
                              >
                                <Icon name="trash" />
                              </button>
                            </div>

                            {/* Quantity + line total */}
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                              <div
                                className="flex h-11 items-center rounded-full border border-gray-200 bg-white"
                                role="group"
                                aria-label={`Quantity for ${item.name}`}
                              >
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, -1)}
                                  disabled={item.quantity <= 1}
                                  aria-label="Decrease quantity"
                                  className={`grid h-11 w-11 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-lg text-[#17171B] transition hover:bg-[#78D94F] disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent ${focus}`}
                                >
                                  −
                                </button>

                                <span
                                  aria-live="polite"
                                  className="w-8 text-center text-sm font-bold"
                                >
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, 1)}
                                  disabled={item.quantity >= MAX_QTY}
                                  aria-label="Increase quantity"
                                  className={`grid h-11 w-11 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-lg text-[#17171B] transition hover:bg-[#78D94F] disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent ${focus}`}
                                >
                                  +
                                </button>
                              </div>

                              <p
                                className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}
                              >
                                {rupee(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
                <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#78D94F]/20 text-[#17171B]">
                  <Icon name="bag" size={34} />
                </span>
                <h2 className={`${head} mt-6 text-2xl font-extrabold text-[#17171B]`}>
                  Your cart is empty
                </h2>
                <p className="mt-3 text-gray-500">
                  Looks like you haven't added anything to your cart yet.
                </p>

                <Link
                  href="/shop"
                  className={`group mt-8 inline-flex items-center gap-3 rounded-full bg-[#78D94F] px-8 py-4 text-sm font-bold tracking-[0.1em] text-[#17171B] no-underline transition duration-300 hover:-translate-y-0.5 hover:bg-[#17171B] hover:text-white ${focus}`}
                >
                  EXPLORE PRODUCTS
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Order summary */}
          <aside>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] lg:sticky lg:top-28">
              <h2 className={`${head} text-xl font-extrabold text-[#17171B]`}>
                Order Summary
              </h2>

              <dl className="m-0 mt-7 space-y-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">
                    Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                  </dt>
                  <dd className="m-0 font-semibold text-[#17171B]">{rupee(subtotal)}</dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-gray-500">Delivery Charge</dt>
                  <dd className="m-0 font-semibold text-[#17171B]">
                    {deliveryCharge === 0 ? (
                      <span className="text-green-700">FREE</span>
                    ) : (
                      rupee(deliveryCharge)
                    )}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-gray-500">Discount Savings</dt>
                  <dd className="m-0 font-semibold text-green-700">
                    -{rupee(totalSavings)}
                  </dd>
                </div>
              </dl>

              <div className="my-6 border-t border-dashed border-gray-200" />

              <div className="flex items-center justify-between">
                <span className="font-bold text-[#17171B]">Total Amount</span>
                <span className={`${head} text-3xl font-extrabold text-[#17171B]`}>
                  {rupee(total)}
                </span>
              </div>

              {totalSavings > 0 && (
                <p className="mt-4 rounded-xl bg-[#78D94F]/15 px-4 py-3 text-center text-xs font-semibold text-[#17171B]">
                  🎉 You're saving {rupee(totalSavings)} on this order
                </p>
              )}

              <p className="mt-3 text-xs text-gray-400">
                Delivery charges are calculated using the demo pricing rule.
              </p>

              <Link
                href={cartItems.length > 0 ? "/checkout" : "/shop"}
                className={`group relative mt-6 flex items-center justify-center gap-3 overflow-hidden rounded-full px-6 py-4 text-center text-sm font-bold tracking-[0.1em] no-underline transition duration-300 ${focus} ${
                  cartItems.length > 0
                    ? "bg-[#78D94F] text-[#17171B] shadow-[0_10px_30px_rgba(120,217,79,0.3)] hover:-translate-y-0.5 hover:bg-[#17171B] hover:text-white"
                    : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                }`}
              >
                {cartItems.length > 0 ? "PROCEED TO CHECKOUT" : "CONTINUE SHOPPING"}
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Icon name="lock" size={14} />
                Secure checkout experience
              </div>
            </div>
          </aside>
        </section>

        {/* ================= BENEFITS ================= */}
        <section className="border-t border-gray-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-10">
            {[
              { icon: "truck", title: "Reliable Delivery", description: "Delivery options for your order" },
              { icon: "lock", title: "Secure Payments", description: "Safe payment experience" },
              { icon: "returns", title: "Easy Returns", description: "Subject to our return policy" },
            ].map((b) => (
              <div
                key={b.title}
                className="group flex flex-col items-center text-center transition duration-300 hover:-translate-y-1"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[#78D94F]/15 text-[#17171B] transition duration-300 group-hover:bg-[#78D94F]">
                  <Icon name={b.icon as keyof typeof icons} size={24} />
                </span>
                <h3 className={`${head} mt-4 font-bold text-[#17171B]`}>{b.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{b.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* Undo toast (bottom-left so it doesn't cover the back-to-top button) */}
      <div
        role="status"
        aria-live="polite"
        className={`${inter.variable} fixed bottom-5 left-5 z-50 flex items-center gap-4 rounded-2xl bg-[#17171B] px-5 py-4 font-[family-name:var(--font-inter)] text-sm font-semibold text-white shadow-2xl transition-all duration-300 ${
          undo
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <span>
          {undo ? `${undo.item.name} removed` : ""}
        </span>
        <button
          type="button"
          onClick={undoRemove}
          className="cursor-pointer border-0 bg-transparent font-bold text-[#78D94F] hover:underline"
        >
          Undo
        </button>
      </div>
    </>
  );
}