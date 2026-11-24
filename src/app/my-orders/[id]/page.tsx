"use client";

import { Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Inter, Montserrat } from "next/font/google";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  MapPin,
  Package,
  Truck,
  User,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingImage from "@/components/LoadingImage";

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

type OrderRecord = {
  id: string;
  date: string;
  status: string;
  statusColor: string;
  statusMessage: string;
  paymentMethod: string;
  paymentStatus: string;
  customer: { name: string; email: string; phone: string };
  address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
    image: string;
  }[];
};

const sampleOrders: Record<string, OrderRecord> = {
  EP20261117001: {
    id: "EP20261117001",
    date: "17 November 2026",
    status: "Processing",
    statusColor: "bg-amber-100 text-amber-800",
    statusMessage:
      "We are preparing your items. You can check the sample delivery timeline using the tracking option below.",
    paymentMethod: "Razorpay",
    paymentStatus: "Demo payment information",
    customer: {
      name: "Alex Johnson",
      email: "alex@example.com",
      phone: "+91 98765 43210",
    },
    address: {
      line1: "123 Sample Street",
      city: "Kochi",
      state: "Kerala",
      pincode: "682001",
      country: "India",
    },
    items: [
      {
        id: 1,
        name: "Astronaut Space Poster",
        category: "Posters",
        price: 499,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300",
      },
      {
        id: 2,
        name: "Abstract Modern Art",
        category: "Canvas Prints",
        price: 599,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300",
      },
    ],
  },
  EP20261110002: {
    id: "EP20261110002",
    date: "10 November 2026",
    status: "Delivered",
    statusColor: "bg-[#78D94F]/20 text-green-800",
    statusMessage: "Your order has been delivered to your shipping address.",
    paymentMethod: "Razorpay",
    paymentStatus: "Demo payment information",
    customer: {
      name: "Alex Johnson",
      email: "alex@example.com",
      phone: "+91 98765 43210",
    },
    address: {
      line1: "123 Sample Street",
      city: "Kochi",
      state: "Kerala",
      pincode: "682001",
      country: "India",
    },
    items: [
      {
        id: 3,
        name: "Vintage Aesthetic Poster",
        category: "Posters",
        price: 399,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300",
      },
    ],
  },
  EP20261028003: {
    id: "EP20261028003",
    date: "28 October 2026",
    status: "Shipped",
    statusColor: "bg-sky-100 text-sky-800",
    statusMessage: "Your package has been dispatched and is on its way.",
    paymentMethod: "Razorpay",
    paymentStatus: "Demo payment information",
    customer: {
      name: "Alex Johnson",
      email: "alex@example.com",
      phone: "+91 98765 43210",
    },
    address: {
      line1: "123 Sample Street",
      city: "Kochi",
      state: "Kerala",
      pincode: "682001",
      country: "India",
    },
    items: [
      {
        id: 4,
        name: "Nature Landscape Print",
        category: "Canvas Prints",
        price: 549,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=300",
      },
    ],
  },
};

const head = `${montserrat.className} font-[family-name:var(--font-montserrat)]`;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";
const revealCls =
  "translate-y-8 opacity-0 transition-all duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none data-[in=1]:translate-y-0 data-[in=1]:opacity-100";

function OrderDetailsContent() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;
  const order = sampleOrders[orderId];
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
      { threshold: 0.1 }
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [orderId]);

  const subtotal = order
    ? order.items.reduce((total, item) => total + item.price * item.quantity, 0)
    : 0;
  const shipping = subtotal >= 999 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <>
      <Header />

      <main
        ref={pageRef}
        className={`${montserrat.variable} ${inter.variable} min-h-screen bg-[#F7F8F5] font-[family-name:var(--font-inter)]`}
      >
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-5 py-12 text-white md:py-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hero-banners/collections-hero.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right opacity-85"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#17171B]/90 via-[#17171B]/55 to-[#17171B]/15" />
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#78D94F]/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

          <div className="relative mx-auto max-w-7xl">
            <Link
              href="/my-orders"
              className={`inline-flex items-center gap-2 text-sm font-semibold text-gray-300 no-underline transition hover:text-[#78D94F] ${focus}`}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to My Orders
            </Link>

            <p className="m-0 mt-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#78D94F]">
              <span className="h-0.5 w-8 bg-[#78D94F]" />
              Order Information
            </p>
            <h1
              className={`${head} m-0 mt-3 break-all text-3xl font-extrabold uppercase tracking-tight sm:text-5xl`}
            >
              Order <span className="text-[#78D94F]">Details</span>
            </h1>
            <p className="m-0 mt-3 text-sm text-gray-400">
              Order ID: <span className="font-semibold text-white">{orderId}</span>
            </p>
          </div>
        </section>

        {/* ================= BODY ================= */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
          {!order ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-[0_6px_20px_rgba(0,0,0,0.03)]">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#78D94F]/15 text-[#17171B]">
                <Package className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2
                className={`${head} m-0 mt-5 text-2xl font-extrabold text-[#17171B]`}
              >
                Order not found
              </h2>
              <p className="mt-3 text-sm text-gray-500">
                This demo page only contains sample order records.
              </p>
              <Link
                href="/my-orders"
                className={`mt-6 inline-flex items-center gap-2 rounded-full bg-[#17171B] px-7 py-3.5 text-sm font-bold text-white no-underline transition hover:bg-[#78D94F] hover:text-[#17171B] ${focus}`}
              >
                Back to My Orders
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              <div className="space-y-6">
                {/* Status card */}
                <div
                  data-reveal
                  className={`${revealCls} rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:p-8`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="m-0 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                        Order Status
                      </p>
                      <h2
                        className={`${head} m-0 mt-2 text-2xl font-extrabold text-[#17171B]`}
                      >
                        {order.status}
                      </h2>
                      <p className="m-0 mt-1.5 text-sm text-gray-500">
                        Ordered on {order.date}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-4 py-2 text-xs font-bold ${order.statusColor}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-6 rounded-2xl bg-[#F7F8F5] p-5">
                    <p className={`${head} m-0 font-bold text-[#17171B]`}>
                      Order status update
                    </p>
                    <p className="m-0 mt-2 text-sm leading-6 text-gray-500">
                      {order.statusMessage}
                    </p>

                    <Link
                      href="/track-order"
                      className={`group mt-5 inline-flex items-center gap-2 rounded-full bg-[#17171B] px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white no-underline transition hover:bg-[#78D94F] hover:text-[#17171B] ${focus}`}
                    >
                      <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                      Track This Order
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>

                {/* Items */}
                <div
                  data-reveal
                  className={`${revealCls} rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:p-8`}
                >
                  <h2
                    className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}
                  >
                    Ordered Products
                  </h2>

                  <div className="mt-6 space-y-6">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-wrap items-center gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                      >
                        <LoadingImage
                          src={item.image}
                          alt={item.name}
                          wrapperClassName="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="m-0 text-xs font-bold uppercase tracking-[0.14em] text-green-700">
                            {item.category}
                          </p>
                          <h3
                            className={`${head} m-0 mt-1 text-base font-extrabold text-[#17171B]`}
                          >
                            {item.name}
                          </h3>
                          <p className="m-0 mt-1.5 text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p
                          className={`${head} m-0 text-lg font-extrabold text-[#17171B]`}
                        >
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Info */}
                <div
                  data-reveal
                  className={`${revealCls} rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:p-8`}
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-green-700" aria-hidden="true" />
                    <h2
                      className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}
                    >
                      Customer Information
                    </h2>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[
                      ["Customer Name", order.customer.name],
                      ["Email Address", order.customer.email],
                      ["Mobile Number", order.customer.phone],
                      ["Order ID", order.id],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl bg-[#F7F8F5] px-5 py-4"
                      >
                        <p className="m-0 text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
                          {label}
                        </p>
                        <p className="m-0 mt-1.5 break-all text-sm font-semibold text-[#17171B]">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div
                  data-reveal
                  className={`${revealCls} rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:p-8`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-green-700" aria-hidden="true" />
                    <h2
                      className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}
                    >
                      Delivery Address
                    </h2>
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#F7F8F5] p-5">
                    <p className={`${head} m-0 font-bold text-[#17171B]`}>
                      {order.customer.name}
                    </p>
                    <p className="m-0 mt-2 text-sm leading-7 text-gray-500">
                      {order.address.line1}
                      <br />
                      {order.address.city}, {order.address.state} -{" "}
                      {order.address.pincode}
                      <br />
                      {order.address.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <aside
                data-reveal
                className={`${revealCls} h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:p-8 lg:sticky lg:top-28`}
              >
                <h2
                  className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}
                >
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between gap-3 text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#17171B]">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-gray-500">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-700">
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between gap-3">
                      <span className="font-bold text-[#17171B]">Total</span>
                      <span
                        className={`${head} text-2xl font-extrabold text-[#17171B]`}
                      >
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-7 border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-2">
                    <CreditCard
                      className="h-4 w-4 text-green-700"
                      aria-hidden="true"
                    />
                    <h3
                      className={`${head} m-0 text-base font-bold text-[#17171B]`}
                    >
                      Payment Information
                    </h3>
                  </div>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">Payment Method</span>
                      <span className="font-semibold text-[#17171B]">
                        {order.paymentMethod}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">Payment Info</span>
                      <span className="text-right font-semibold text-gray-600">
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className={`${head} m-0 text-xs font-bold text-amber-900`}>
                    Demo order details
                  </p>
                  <p className="m-0 mt-1.5 text-xs leading-5 text-amber-800">
                    This is sample order information. Actual payment
                    verification, order records, and delivery updates will come
                    from your backend.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className={`mt-6 block w-full rounded-full border border-gray-200 px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.1em] text-[#17171B] no-underline transition hover:border-[#78D94F] ${focus}`}
                >
                  Need Help?
                </Link>
              </aside>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default function OrderDetailsPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="min-h-[60vh] bg-[#F7F8F5]" />
          <Footer />
        </>
      }
    >
      <OrderDetailsContent />
    </Suspense>
  );
}
