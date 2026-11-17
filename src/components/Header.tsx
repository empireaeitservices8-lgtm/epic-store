"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
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

const messages = [
  "FREE SHIPPING ON ORDERS ABOVE ₹999",
  "NEW DROPS EVERY WEEK",
  "PREMIUM PRINTS, SHIPPED ACROSS INDIA",
];

const links = [
  { label: "Home", href: "/", id: "home" },
  { label: "Categories", href: "/#categories", id: "categories" },
  { label: "New Arrivals", href: "/#new-arrivals", id: "new-arrivals" },
  { label: "Collections", href: "/#collections", id: "collections" },
  { label: "Custom Prints", href: "/#custom", id: "custom" },
];

const popular = ["Abstract", "Typography", "Minimal", "Nature", "Custom Prints"];

/* Shared Tailwind class strings */
const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78d94f]";
const iconBtn = `group relative grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-white transition-colors duration-300 hover:bg-white/10 hover:text-[#78d94f] sm:h-11 sm:w-11 ${focus}`;

/* Inline icons */
const icons: Record<string, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  heart: (
    <path d="M12 20.5s-7.5-4.6-9.6-9.4A5.4 5.4 0 0 1 12 6.2a5.4 5.4 0 0 1 9.6 4.9c-2.1 4.8-9.6 9.4-9.6 9.4z" />
  ),
  bag: (
    <>
      <path d="M5.5 8h13l1 12h-15l1-12z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
};

function Icon({
  name,
  size = 22,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
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
      className={className}
    >
      {icons[name]}
    </svg>
  );
}

export default function Header({
  cartCount = 0,
  wishlistCount = 0,
}: {
  cartCount?: number;
  wishlistCount?: number;
}) {
  const router = useRouter();
  const [barOpen, setBarOpen] = useState(true);
  const [msg, setMsg] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("home");
  const inputRef = useRef<HTMLInputElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  /* Rotating announcement */
  useEffect(() => {
    if (!barOpen) return;
    const t = setInterval(() => setMsg((m) => (m + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, [barOpen]);

  /* Scroll state + progress line */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${p})`;
      }
      if (window.scrollY < 200) setActive("home");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Highlight the nav link for the section in view */
  useEffect(() => {
    const els = links
      .filter((l) => l.id !== "home")
      .map((l) => document.getElementById(l.id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Lock page scroll while the mobile drawer is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* Focus the search input when the panel opens */
  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  /* Esc closes everything */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submitSearch = (q: string) => {
    const term = q.trim();
    if (!term) return;
    setSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(term)}`);
  };

  const badge = (count: number) =>
    `absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#78d94f] px-1 text-[10px] font-bold text-[#17171b] transition-transform duration-300 ${
      count > 0 ? "scale-100" : "scale-0"
    }`;

  return (
    <div
      className={`contents font-[family-name:var(--font-inter)] ${syne.variable} ${inter.variable}`}
    >
      {/* ============ ANNOUNCEMENT BAR ============ */}
      {barOpen && (
        <div className="relative bg-[#78d94f] text-[#17171b]">
          <div className="mx-auto max-w-[1500px] px-10 py-2 sm:px-12 sm:py-2.5">
            <div className="relative min-h-[20px]">
              {messages.map((m, i) => (
                <p
                  key={m}
                  aria-hidden={i !== msg}
                  className={`absolute inset-0 m-0 flex items-center justify-center text-center text-[10px] font-semibold leading-tight tracking-[0.12em] transition-all duration-500 sm:text-xs sm:tracking-[0.2em] ${
                    i === msg
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-0"
                  }`}
                >
                  {m}
                </p>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label="Close announcement"
            onClick={() => setBarOpen(false)}
            className={`absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[#17171b] transition duration-300 hover:rotate-90 hover:bg-black/10 sm:right-5 ${focus}`}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      {/* ============ HEADER ============ */}
      <header
        className={`sticky top-0 z-50 border-b border-white/[0.06] text-white backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? "bg-[#111114]/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            : "bg-[#111114]/60"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 transition-[height] duration-300 sm:gap-6 sm:px-[5%] ${
            scrolled ? "h-14 sm:h-16" : "h-[68px] sm:h-[76px] lg:h-[88px]"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className={`group flex h-full shrink-0 items-center no-underline ${focus}`}
          >
            <Image
              src="/Logo/logo.png"
              alt="Epic Store"
              width={220}
              height={144}
              priority
              unoptimized
              className={`w-auto object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_16px_rgba(120,217,79,0.35)] ${
                scrolled
                  ? "h-9 sm:h-11"
                  : "h-11 sm:h-14 lg:h-16"
              }`}
            />
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-10 text-[13px] font-medium uppercase tracking-[0.12em] lg:flex"
          >
            {links.map((l) => (
              <Link
                key={l.id}
                href={l.href}
                className={`relative px-0.5 py-2 no-underline transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:rounded after:bg-[#78d94f] after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100 ${focus} ${
                  active === l.id
                    ? "text-white after:scale-x-100"
                    : "text-[#c9c9d0] after:scale-x-0"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label="Search"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((s) => !s)}
              className={iconBtn}
            >
              <Icon
                name={searchOpen ? "close" : "search"}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </button>

            <button
              type="button"
              aria-label="Wishlist"
              className={`${iconBtn} !hidden sm:!grid`}
            >
              <Icon
                name="heart"
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span className={badge(wishlistCount)}>{wishlistCount}</span>
            </button>

            <button type="button" aria-label="Shopping cart" className={iconBtn}>
              <Icon
                name="bag"
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span className={badge(cartCount)}>{cartCount}</span>
            </button>

            <Link
              href="/login"
              className={`ml-2 hidden items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white no-underline transition duration-300 hover:-translate-y-0.5 hover:border-[#78d94f] hover:bg-[#78d94f] hover:text-[#17171b] sm:inline-flex ${focus}`}
            >
              <Icon name="user" size={16} />
              Login
            </Link>

            {/* Hamburger */}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className={`ml-1 flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-[5px] border-0 bg-transparent text-white lg:hidden ${focus}`}
            >
              <span
                className={`block h-0.5 w-5 rounded bg-current transition-all duration-300 ${
                  menuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`ml-auto block h-0.5 w-3.5 rounded bg-current transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded bg-current transition-all duration-300 ${
                  menuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Search panel */}
        <div
          className={`absolute left-0 top-full w-full border-b border-white/[0.08] bg-[#111114]/95 shadow-[0_30px_50px_rgba(0,0,0,0.45)] backdrop-blur-lg transition-all duration-300 ${
            searchOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-3 opacity-0"
          }`}
        >
          <div className="mx-auto max-w-[900px] px-4 py-6 sm:px-[6%] sm:py-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch(query);
              }}
              className="flex items-center gap-4 border-b-2 border-[#3a3a3f] pb-3 transition-colors duration-300 focus-within:border-[#78d94f]"
            >
              <Icon name="search" size={24} />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posters, wall art, collections..."
                aria-label="Search the store"
                className={`${head} w-full border-0 bg-transparent text-xl font-semibold text-white outline-none placeholder:text-[#6d6d76] sm:text-3xl`}
              />
              <button
                type="submit"
                aria-label="Submit search"
                className={`grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[#78d94f] text-[#17171b] transition-transform duration-300 hover:scale-110 ${focus}`}
              >
                <Icon name="arrow" />
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="mr-2 text-[11px] font-semibold tracking-[0.2em] text-[#8d8d96]">
                POPULAR
              </span>
              {popular.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => submitSearch(p)}
                  className={`cursor-pointer rounded-full border border-white/20 bg-transparent px-4 py-2 text-[13px] font-medium text-white transition-colors duration-300 hover:border-[#78d94f] hover:bg-[#78d94f] hover:text-[#17171b] ${focus}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll progress line */}
        <span
          ref={progressRef}
          aria-hidden="true"
          className="absolute -bottom-px left-0 h-0.5 w-full origin-left scale-x-0 bg-[#78d94f]"
        />
      </header>

      {/* ============ MOBILE DRAWER ============ */}
      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-[3px] transition-all duration-300 ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <aside
        aria-label="Mobile menu"
        className={`fixed right-0 top-0 z-[70] flex h-full w-[86%] max-w-[380px] flex-col border-l border-white/[0.08] bg-[#17171b] text-white transition-all duration-500 ${
          menuOpen ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-7 py-6">
          <span className={`${head} text-sm font-bold tracking-[0.25em] text-[#78d94f]`}>
            MENU
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className={iconBtn}
          >
            <Icon
              name="close"
              className="transition-transform duration-300 group-hover:rotate-90"
            />
          </button>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto px-7">
          {links.map((l, i) => (
            <div
              key={l.id}
              style={{ transitionDelay: menuOpen ? `${150 + i * 60}ms` : "0ms" }}
              className={`border-b border-white/[0.07] transition-all duration-500 ${
                menuOpen ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
              }`}
            >
              <Link
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`${head} block py-4 text-[22px] font-bold tracking-tight no-underline transition-[color,padding] duration-300 hover:pl-2 hover:text-[#78d94f] sm:py-5 sm:text-[26px] ${focus} ${
                  active === l.id ? "text-[#78d94f]" : "text-white"
                }`}
              >
                {l.label}
              </Link>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 px-7 py-6">
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className={`mb-4 flex items-center justify-center gap-2 rounded-xl bg-[#78d94f] py-4 text-sm font-bold tracking-[0.14em] text-[#17171b] no-underline transition-colors duration-300 hover:bg-white ${focus}`}
          >
            <Icon name="user" size={18} />
            LOGIN
          </Link>
          <p className="m-0 text-center text-[11px] tracking-[0.18em] text-[#8d8d96]">
            FREE SHIPPING ON ORDERS ABOVE ₹999
          </p>
        </div>
      </aside>
    </div>
  );
}