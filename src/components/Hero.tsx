"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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

const SLIDE_DURATION = 6000;

const slides = [
  {
    eyebrow: "DISCOVER YOUR STYLE",
    line1: "MAKE YOUR",
    line2: "WALLS EPIC.",
    description:
      "Transform your space with premium posters, creative wall art and unique collections. Find something that speaks to you.",
    tag: "ART THAT INSPIRES",
    image: "/Home-page/hero-slide-1.jpg",
    position: "object-center lg:object-right",
  },
  {
    eyebrow: "CURATED COLLECTIONS",
    line1: "FRAME YOUR",
    line2: "STORY.",
    description:
      "From bold typography to calm minimal prints, explore collections made to fit the way you live.",
    tag: "MADE TO BE SEEN",
    image: "/Home-page/hero-slide-2.jpg",
    position: "object-center lg:object-right",
  },
  {
    eyebrow: "PREMIUM PRINTS",
    line1: "LIVE WITH",
    line2: "BOLD IDEAS.",
    description:
      "Rich colours, crisp detail and long-lasting prints that keep their character year after year.",
    tag: "PRINTED TO LAST",
    image: "/Home-page/hero-slide-3.jpg",
    position: "object-center lg:object-right",
  },
  {
    eyebrow: "FRESH ARRIVALS",
    line1: "NEW DROPS",
    line2: "EVERY WEEK.",
    description:
      "New artwork lands regularly. Be the first to find the piece that finally completes your wall.",
    tag: "NEW THIS WEEK",
    image: "/Home-page/epic-store-hero-bg.png",
    position: "object-center lg:object-right",
  },
];

const benefits = [
  { icon: "✧", title: "Premium Quality", description: "Long Lasting Prints" },
  { icon: "↗", title: "Fast & Reliable Shipping", description: "Across India" },
  { icon: "✓", title: "Secure Payments", description: "Shop with Confidence" },
  { icon: "♡", title: "Dedicated Support", description: "We're Here to Help" },
];

const ticker = [
  "PREMIUM POSTERS",
  "CREATIVE WALL ART",
  "MINIMAL PRINTS",
  "BOLD TYPOGRAPHY",
  "NEW DROPS",
  "SHIPPING ACROSS INDIA",
];

/* Reusable class strings (kept in this file) */
const head = "font-[family-name:var(--font-syne)]";
const reveal =
  "opacity-0 animate-[rise_0.8s_cubic-bezier(0.2,0.7,0.2,1)_forwards] motion-reduce:animate-none motion-reduce:opacity-100";

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  const go = useCallback(
    (dir: 1 | -1) =>
      setIndex((i) => (i + dir + slides.length) % slides.length),
    []
  );

  /* Auto-advance */
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(1), SLIDE_DURATION);
    return () => clearTimeout(t);
  }, [index, paused, go]);

  /* Mouse parallax (no re-renders) */
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };

  const onLeave = () => {
    const el = heroRef.current;
    if (el) {
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    }
    setPaused(false);
  };

  /* Magnetic button */
  const onBtnMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const b = btnRef.current;
    if (!b) return;
    const r = b.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.25;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.35;
    b.style.transform = `translate(${x}px, ${y - 3}px)`;
  };
  const onBtnLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = "";
  };

  const slide = slides[index];

  return (
    <div
      className={`${syne.variable} ${inter.variable} bg-[#111114] font-[family-name:var(--font-inter)] text-white [&_*]:box-border`}
    >
      {/* Keyframes only: Tailwind has no built-in equivalents */}
      <style>{`
        @keyframes rise { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
        @keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes marquee { to { transform: translateX(-50%); } }
      `}</style>

      <section
        ref={heroRef}
        onMouseMove={onMove}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={onLeave}
        aria-roledescription="carousel"
        aria-label="Featured collections"
        style={{ ["--mx" as string]: 0, ["--my" as string]: 0 }}
        className="relative isolate flex min-h-[420px] w-full items-center overflow-hidden bg-[#111114] sm:min-h-[480px] lg:min-h-[540px]"
      >
        {/* Background images with parallax & 6s crossfade */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 -z-30 w-full transition-transform duration-300 ease-out will-change-transform [transform:translate3d(calc(var(--mx)*-10px),calc(var(--my)*-8px),0)] lg:w-[62%]"
        >
          {slides.map((s, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={s.tag}
              src={s.image}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out lg:object-contain ${s.position} ${i === index ? "opacity-100" : "opacity-0"
                }`}
            />
          ))}
        </div>

        {/* Gradient overlays */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(17,17,20,0.92)_0%,rgba(17,17,20,0.78)_45%,rgba(17,17,20,0.45)_100%)] lg:bg-[radial-gradient(50%_80%_at_15%_50%,rgba(120,217,79,0.10),transparent_70%),linear-gradient(90deg,#111114_0%,#111114_36%,rgba(17,17,20,0.85)_46%,rgba(17,17,20,0.22)_58%,transparent_72%)]"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 py-10 sm:px-[5%] sm:py-16">
          {/* Eyebrow */}
          <div
            key={`e-${index}`}
            className={`${reveal} mb-4 flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] text-[#78d94f] sm:mb-5 sm:gap-[22px] sm:text-[13px] sm:tracking-[0.32em]`}
          >
            <span>{slide.eyebrow}</span>
            <span className="h-0.5 w-10 origin-left animate-[grow_0.9s_0.2s_cubic-bezier(0.2,0.7,0.2,1)_both] bg-[#78d94f] sm:w-[90px]" />
          </div>

          {/* Heading */}
          <h1
            key={`h-${index}`}
            aria-live="polite"
            className={`${head} mb-4 text-[clamp(36px,10.5vw,56px)] font-extrabold uppercase leading-none tracking-[-0.035em] sm:mb-5 sm:text-[clamp(46px,6.4vw,96px)]`}
          >
            <span className={`${reveal} block [animation-delay:80ms]`}>
              {slide.line1}
            </span>
            <span
              className={`${reveal} block text-[#78d94f] [animation-delay:160ms] [text-shadow:0_0_60px_rgba(120,217,79,0.25)]`}
            >
              {slide.line2}
            </span>
          </h1>

          {/* Description */}
          <p
            key={`p-${index}`}
            className={`${reveal} mb-6 min-h-[72px] max-w-[520px] text-[14px] leading-[1.65] text-[#dedede] [animation-delay:260ms] sm:mb-8 sm:min-h-[62px] sm:text-lg`}
          >
            {slide.description}
          </p>

          {/* Actions */}
          <div
            className={`${reveal} flex flex-col items-start gap-4 [animation-delay:340ms] sm:flex-row sm:flex-wrap sm:items-center sm:gap-[30px]`}
          >
            <Link
              href="/shop"
              ref={btnRef}
              onMouseMove={onBtnMove}
              onMouseLeave={onBtnLeave}
              className="group relative inline-flex items-center gap-4 overflow-hidden rounded-[10px] bg-[#78d94f] px-6 py-3.5 text-[13px] font-bold tracking-[0.08em] text-[#17171b] no-underline shadow-[0_10px_30px_rgba(120,217,79,0.25)] transition-[transform,background-color,box-shadow] duration-300 hover:bg-white hover:shadow-[0_14px_36px_rgba(255,255,255,0.2)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#78d94f] sm:gap-[18px] sm:px-8 sm:py-[18px] sm:text-sm"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-[120%] bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.55)_50%,transparent_70%)] transition-transform duration-700 group-hover:translate-x-[120%]"
              />
              <span className="relative">SHOP NOW</span>
              <span className="relative text-[22px] transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </Link>

            <Link
              href="/collections"
              className="group inline-flex items-center gap-3.5 text-[13px] font-semibold tracking-[0.08em] text-white no-underline transition-colors duration-300 hover:text-[#78d94f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#78d94f]"
            >
              <span className="relative grid h-[46px] w-[46px] place-items-center rounded-full border border-white/70 pl-[3px] text-xs transition-colors duration-300 group-hover:border-[#78d94f] group-hover:bg-[#78d94f] group-hover:text-[#17171b]">
                ▶
              </span>
              EXPLORE COLLECTIONS
            </Link>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div
        aria-hidden="true"
        className="group overflow-hidden border-t border-black/10 bg-[#78d94f] text-[#17171b]"
      >
        <div className="flex w-max animate-[marquee_32s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...ticker, ...ticker, ...ticker, ...ticker].map((t, i) => (
            <span
              key={i}
              className={`${head} inline-flex items-center gap-5 whitespace-nowrap py-2.5 pr-5 text-[11px] font-bold tracking-[0.16em] sm:gap-7 sm:py-3.5 sm:pr-7 sm:text-[13px] sm:tracking-[0.2em]`}
            >
              {t}
              <i className="text-[11px] not-italic">✦</i>
            </span>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <section className="grid grid-cols-4 gap-1 bg-[#17171b] px-2 py-3 sm:gap-3 sm:px-[4%] sm:py-5">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="group flex flex-col items-center justify-center gap-1.5 border-r border-[#3a3a3f] px-1 py-1.5 text-center transition duration-300 last:border-r-0 hover:-translate-y-[3px] hover:bg-white/[0.03] sm:rounded-xl sm:px-3 sm:py-3 lg:flex-row lg:gap-[18px] lg:text-left"
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#78d94f]/15 text-sm text-[#78d94f] transition duration-300 group-hover:-rotate-[8deg] group-hover:scale-[1.06] group-hover:bg-[#78d94f] group-hover:text-[#17171b] sm:h-12 sm:w-12 sm:text-xl lg:h-14 lg:w-14 lg:text-2xl">
              {b.icon}
            </div>
            <div className="min-w-0">
              <h3 className={`${head} m-0 text-[10px] font-bold leading-tight tracking-[-0.01em] text-white sm:mb-1 sm:text-xs lg:text-[15px]`}>
                {b.title}
              </h3>
              <p className="m-0 hidden text-[10px] text-[#bdbdbd] sm:block sm:text-[11px] lg:text-[13px]">
                {b.description}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}