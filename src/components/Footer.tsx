"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Inter, Syne } from "next/font/google";

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

const columns = [
  {
    title: "Quick Links",
    links: [
      { name: "Home", href: "/" },
      { name: "About Us", href: "/about" },
      { name: "Shop", href: "/shop" },
      { name: "Collections", href: "/collections" },
      { name: "Custom Prints", href: "/custom-prints" },
      { name: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Shop Categories",
    links: [
      { name: "Posters", href: "/shop?category=posters" },
      { name: "Canvas Prints", href: "/shop?category=canvas-prints" },
      { name: "Metal Posters", href: "/shop?category=metal-posters" },
      { name: "Stickers", href: "/shop?category=stickers" },
      { name: "Tapestries", href: "/shop?category=tapestries" },
      { name: "Custom Designs", href: "/custom-prints" },
    ],
  },
  {
    title: "Customer Support",
    links: [
      { name: "FAQs", href: "/faq" },
      { name: "Shipping Information", href: "/shipping" },
      { name: "Returns & Refunds", href: "/returns" },
      { name: "Track Your Order", href: "/track-order" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms & Conditions", href: "/terms" },
    ],
  },
];

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/" },
  { name: "Facebook", href: "https://www.facebook.com/" },
  { name: "Pinterest", href: "https://www.pinterest.com/" },
];

const payments = ["UPI", "Cards", "Net Banking", "Wallets"];

const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#78D94F]";

const subscribe = () => () => {};
const getClientYear = () => new Date().getFullYear();
const getServerYear = () => 2026;

export default function Footer() {
  const [openCol, setOpenCol] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  /* Current year is read on the client (reading the date during render breaks prerendering) */
  const year = useSyncExternalStore(subscribe, getClientYear, getServerYear);

  /* Reveal on scroll */
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Show back-to-top button after scrolling */
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const reveal = (delay: number) => ({
    style: { transitionDelay: visible ? `${delay}ms` : "0ms" },
  });
  const revealCls = `transition-all duration-700 ${
    visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
  }`;

  return (
    <footer
      className={`${syne.variable} ${inter.variable} relative overflow-hidden bg-[#17171B] font-[family-name:var(--font-inter)] text-white`}
    >
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#78D94F]/60 to-transparent" />
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#78D94F]/[0.07] blur-3xl" />

      {/* Main footer */}
      <div
        ref={footerRef}
        className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-10 lg:pt-20"
      >
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand information */}
          <div
            {...reveal(0)}
            className={`sm:col-span-2 ${revealCls}`}
          >
            <Link
              href="/"
              className={`${head} inline-flex items-center text-3xl font-extrabold tracking-tight ${focus}`}
            >
              EPIC
              <span className="text-[#BDBDBD]">STORE</span>
              <span className="text-[#78D94F]">.</span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
              Discover creative designs, beautiful wall art, and personalized
              prints. At Epic Store, we bring your ideas and spaces to life
              with products that reflect your style.
            </p>

            {/* Social links */}
            <div className="mt-7">
              <h3
                className={`${head} text-xs font-bold tracking-[0.2em] text-white`}
              >
                FOLLOW US
              </h3>

              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className={`group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-gray-300 transition duration-300 hover:-translate-y-0.5 hover:border-[#78D94F] hover:bg-[#78D94F] hover:text-[#17171B] ${focus}`}
                  >
                    {s.name}
                    <span className="transition-transform duration-300 group-hover:rotate-45">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns: accordion on mobile, always open from sm up */}
          {columns.map((col, i) => {
            const open = openCol === col.title;
            return (
              <div
                key={col.title}
                {...reveal(100 + i * 100)}
                className={`border-b border-white/10 pb-4 sm:border-0 sm:pb-0 ${revealCls}`}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenCol(open ? null : col.title)}
                  className={`flex w-full cursor-pointer items-center justify-between border-0 bg-transparent p-0 text-left sm:pointer-events-none sm:cursor-default ${focus}`}
                >
                  <h3
                    className={`${head} text-sm font-bold uppercase tracking-[0.16em] text-white`}
                  >
                    {col.title}
                  </h3>
                  <span
                    aria-hidden="true"
                    className={`text-xl text-[#78D94F] transition-transform duration-300 sm:hidden ${
                      open ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-500 sm:!grid-rows-[1fr] ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <ul className="m-0 min-h-0 list-none space-y-4 overflow-hidden p-0 pt-0 sm:pt-6">
                    {col.links.map((l, idx) => (
                      <li key={l.name} className={idx === 0 ? "pt-6 sm:pt-0" : ""}>
                        <Link
                          href={l.href}
                          className={`group inline-flex items-center gap-0 text-sm text-gray-400 no-underline transition-all duration-300 hover:gap-2 hover:text-[#78D94F] ${focus}`}
                        >
                          <span className="w-0 overflow-hidden text-[#78D94F] opacity-0 transition-all duration-300 group-hover:w-3 group-hover:opacity-100">
                            →
                          </span>
                          {l.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact information */}
        <div
          {...reveal(400)}
          className={`mt-16 grid grid-cols-1 gap-8 border-t border-white/10 pt-8 sm:grid-cols-3 ${revealCls}`}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#78D94F]">
              Email Support
            </p>
            <a
              href="mailto:support@epicstore.com"
              className={`mt-2 inline-block text-sm text-gray-300 no-underline transition hover:text-[#78D94F] ${focus}`}
            >
              support@epicstore.com
            </a>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#78D94F]">
              Customer Care
            </p>
            <p className="mt-2 text-sm text-gray-300">Monday – Saturday</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#78D94F]">
              Payment Options
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {payments.map((m) => (
                <span
                  key={m}
                  className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-gray-300 transition duration-300 hover:border-[#78D94F]/60 hover:text-white"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative select-none overflow-hidden px-4"
      >
        <p
          className={`${head} m-0 whitespace-nowrap text-center text-[clamp(56px,17vw,260px)] font-extrabold leading-[0.8] tracking-tighter text-white/[0.04]`}
        >
          EPICSTORE<span className="text-[#78D94F]/20">.</span>
        </p>
      </div>

      {/* Bottom footer */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-center sm:px-6 md:flex-row lg:px-10">
          <p className="m-0 text-xs text-gray-500">
            © {year} Epic Store. All rights reserved.
          </p>

          <p className="m-0 text-xs text-gray-500">
            Designed with <span className="text-[#78D94F]">♥</span> for creative
            spaces.
          </p>

          <div className="flex gap-5">
            <Link
              href="/privacy-policy"
              className={`text-xs text-gray-500 no-underline transition hover:text-[#78D94F] ${focus}`}
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className={`text-xs text-gray-500 no-underline transition hover:text-[#78D94F] ${focus}`}
            >
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-40 grid h-12 w-12 cursor-pointer place-items-center rounded-full border-0 bg-[#78D94F] text-xl font-bold text-[#17171B] shadow-[0_10px_30px_rgba(120,217,79,0.35)] transition-all duration-300 hover:-translate-y-1 hover:bg-white ${focus} ${
          showTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        ↑
      </button>
    </footer>
  );
}