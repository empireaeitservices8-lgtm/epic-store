"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Inter, Syne } from "next/font/google";
import {
  ArrowRight,
  Award,
  Heart,
  LogOut,
  Package,
  Truck,
  User,
} from "lucide-react";
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

const accountLinks = [
  {
    title: "My Orders",
    description: "View and manage your purchases",
    href: "/my-orders",
    icon: Package,
  },
  {
    title: "My Wishlist",
    description: "View your saved products",
    href: "/wishlist",
    icon: Heart,
  },
  {
    title: "Track Order",
    description: "Check your delivery progress",
    href: "/track-order",
    icon: Truck,
  },
  {
    title: "Edit Profile",
    description: "Update your personal information",
    href: "/account",
    icon: User,
  },
];

const stats = [
  { label: "Total Orders", value: "05", icon: Package, href: "/my-orders" },
  { label: "Wishlist Items", value: "04", icon: Heart, href: "/wishlist" },
  { label: "Rewards Points", value: "250", icon: Award, href: "/shop" },
];

const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";
const revealCls =
  "translate-y-8 opacity-0 transition-all duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none data-[in=1]:translate-y-0 data-[in=1]:opacity-100";

export default function AccountPage() {
  const [signedOutNotice, setSignedOutNotice] = useState(false);
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
  }, []);

  return (
    <>
      <Header />

      <main
        ref={pageRef}
        className={`${syne.variable} ${inter.variable} min-h-screen bg-[#F7F8F5] font-[family-name:var(--font-inter)]`}
      >
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-5 py-12 text-white md:py-16">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#78D94F]/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

          <div className="relative mx-auto max-w-7xl">
            <p
              data-reveal
              style={{ transitionDelay: "80ms" }}
              className={`${revealCls} m-0 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#78D94F]`}
            >
              <span className="h-0.5 w-8 bg-[#78D94F]" />
              Customer Dashboard
            </p>
            <h1
              data-reveal
              style={{ transitionDelay: "160ms" }}
              className={`${revealCls} ${head} m-0 mt-4 text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-5xl`}
            >
              My <span className="text-[#78D94F]">Account</span>
            </h1>
            <p
              data-reveal
              style={{ transitionDelay: "240ms" }}
              className={`${revealCls} m-0 mt-4 max-w-xl text-sm leading-7 text-gray-400 sm:text-base`}
            >
              Manage your profile, purchases, and saved products.
            </p>
          </div>
        </section>

        {/* ================= DASHBOARD ================= */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            {/* Sidebar */}
            <aside
              data-reveal
              className={`${revealCls} h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)]`}
            >
              <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#78D94F]/20 text-[#17171B]">
                  <User className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2
                    className={`${head} m-0 truncate text-lg font-extrabold text-[#17171B]`}
                  >
                    Alex Johnson
                  </h2>
                  <p className="m-0 mt-1 truncate text-sm text-gray-500">
                    alex@example.com
                  </p>
                </div>
              </div>

              <nav aria-label="Account navigation" className="mt-5 space-y-1.5">
                {accountLinks.map((item) => {
                  const NavIcon = item.icon;
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-600 no-underline transition hover:bg-[#78D94F]/15 hover:text-[#17171B] ${focus}`}
                    >
                      <NavIcon
                        className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:text-[#17171B]"
                        aria-hidden="true"
                      />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>

              <button
                type="button"
                className={`mt-5 inline-flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-red-100 bg-transparent px-4 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50 ${focus}`}
                onClick={() => setSignedOutNotice(true)}
              >
                <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                Sign Out
              </button>

              {signedOutNotice && (
                <p
                  role="status"
                  className="mt-4 rounded-xl border border-gray-200 bg-[#F7F8F5] px-4 py-3 text-xs leading-5 text-gray-600"
                >
                  Demo sign out. Connect authentication to enable session sign
                  out.
                </p>
              )}
            </aside>

            {/* Main Content */}
            <div className="space-y-8">
              <div data-reveal className={revealCls}>
                <h2
                  className={`${head} m-0 text-2xl font-extrabold text-[#17171B] sm:text-3xl`}
                >
                  Welcome back, Alex!
                </h2>
                <p className="m-0 mt-2 text-sm text-gray-500">
                  Here is an overview of your Epic Store account.
                </p>
              </div>

              {/* Stats */}
              <div className="grid gap-5 sm:grid-cols-3">
                {stats.map((item, idx) => {
                  const StatIcon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      data-reveal
                      style={{ transitionDelay: `${idx * 70}ms` }}
                      className={`${revealCls} group block rounded-3xl border border-gray-200 bg-white p-6 no-underline shadow-[0_6px_20px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-1 hover:border-[#78D94F] hover:shadow-[0_10px_30px_rgba(120,217,79,0.12)] ${focus}`}
                    >
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#78D94F]/15 text-[#17171B] transition-colors duration-300 group-hover:bg-[#78D94F]">
                        <StatIcon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                      </div>
                      <p
                        className={`${head} m-0 mt-4 text-3xl font-extrabold text-[#17171B]`}
                      >
                        {item.value}
                      </p>
                      <p className="m-0 mt-1 text-sm text-gray-500">
                        {item.label}
                      </p>
                    </Link>
                  );
                })}
              </div>

              {/* Personal Info */}
              <div
                data-reveal
                className={`${revealCls} rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:p-8`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3
                    className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}
                  >
                    Personal Information
                  </h3>
                  <span className="rounded-full bg-[#78D94F]/20 px-3.5 py-1 text-xs font-bold text-green-800">
                    Demo profile
                  </span>
                </div>

                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                  {[
                    ["Full Name", "Alex Johnson"],
                    ["Email Address", "alex@example.com"],
                    ["Mobile Number", "+91 98765 43210"],
                    ["Account Type", "Customer"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl bg-[#F7F8F5] px-5 py-4"
                    >
                      <p className="m-0 text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
                        {label}
                      </p>
                      <p className="m-0 mt-1.5 font-semibold text-[#17171B]">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mb-0 mt-6 rounded-2xl border border-gray-100 bg-[#F7F8F5]/60 p-4 text-sm leading-6 text-gray-500">
                  This profile contains sample information for the website
                  demonstration. Customer profile editing will be connected to
                  the backend later.
                </p>
              </div>

              {/* Promo CTA */}
              <div
                data-reveal
                className={`${revealCls} relative overflow-hidden rounded-3xl bg-[#17171B] p-7 text-white sm:p-10`}
              >
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#78D94F]/15 blur-3xl" />
                <div className="relative">
                  <p className="m-0 text-xs font-bold uppercase tracking-[0.22em] text-[#78D94F]">
                    Discover Something New
                  </p>
                  <h3
                    className={`${head} m-0 mt-3 text-2xl font-extrabold uppercase tracking-tight sm:text-3xl`}
                  >
                    Make your space more{" "}
                    <span className="text-[#78D94F]">personal.</span>
                  </h3>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-gray-400">
                    Explore our latest prints and creative collections.
                  </p>
                  <Link
                    href="/shop"
                    className={`group mt-6 inline-flex items-center gap-2 rounded-full bg-[#78D94F] px-7 py-3.5 text-sm font-bold tracking-[0.08em] text-[#17171B] no-underline transition hover:-translate-y-0.5 hover:bg-white ${focus}`}
                  >
                    EXPLORE SHOP
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
