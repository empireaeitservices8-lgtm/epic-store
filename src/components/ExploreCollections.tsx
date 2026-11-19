"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

const collections = [
  {
    name: "Minimalist Art",
    subtitle: "Simple designs. Bold impact.",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=85",
  },
  {
    name: "Nature Collection",
    subtitle: "Bring nature into your space.",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900&q=85",
  },
  {
    name: "Modern Aesthetic",
    subtitle: "Art that defines your style.",
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=900&q=85",
  },
  {
    name: "Creative Spaces",
    subtitle: "Make every wall inspiring.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=85",
  },
];

const head = "font-[family-name:var(--font-syne)]";

export default function ExploreCollections() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  /* Reveal on scroll */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="collections"
      className={`${syne.variable} ${inter.variable} overflow-hidden bg-white px-4 py-10 font-[family-name:var(--font-inter)] sm:px-6 sm:py-14 lg:px-10 lg:py-16`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-green-700 sm:mb-3 sm:tracking-[0.25em]">
              <span className="h-0.5 w-8 bg-[#78D94F] sm:w-10" />
              Curated for you
            </p>

            <h2
              className={`${head} text-3xl font-extrabold leading-[1.04] tracking-tight text-[#17171B] sm:text-4xl lg:text-5xl`}
            >
              Explore Collections<span className="text-[#78D94F]">.</span>
            </h2>

            <p className="mt-2.5 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Discover carefully selected designs to match your style,
              personality, and space.
            </p>
          </div>

          <Link
            href="/collections"
            className="group inline-flex w-fit items-center gap-2.5 rounded-full border border-[#17171B]/15 bg-white px-5 py-2.5 text-xs font-bold tracking-[0.14em] text-[#17171B] transition duration-300 hover:border-[#17171B] hover:bg-[#17171B] hover:text-white"
          >
            VIEW ALL COLLECTIONS
            <span className="text-base transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>

        {/* Expanding collection panels (2-col grid on mobile/tablet, expanding row on desktop) */}
        <div
          ref={wrapRef}
          onMouseLeave={() => setActive(0)}
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:flex lg:h-[420px] lg:flex-row"
        >
          {collections.map((c, i) => {
            const open = active === i;
            return (
              <Link
                key={c.name}
                href={`/collections?category=${encodeURIComponent(c.name)}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-label={`${c.name}: ${c.subtitle}`}
                style={{ transitionDelay: visible ? `${i * 90}ms` : "0ms" }}
                className={`group relative block h-[175px] overflow-hidden rounded-2xl bg-[#17171B] shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#78D94F] sm:h-[210px] lg:h-auto ${
                  open ? "lg:flex-[3.2]" : "lg:flex-1"
                } ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
              >
                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt=""
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-out group-hover:scale-105 ${
                    open ? "lg:brightness-100" : "lg:brightness-75"
                  }`}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/5" />

                {/* Number */}
                <span
                  className={`${head} absolute left-3.5 top-3.5 text-xs font-bold tracking-[0.2em] text-white/80 sm:left-6 sm:top-6 sm:text-sm`}
                >
                  0{i + 1}
                </span>

                {/* Collapsed state: vertical title (desktop only) */}
                <span
                  className={`${head} absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-lg font-bold uppercase tracking-[0.18em] text-white transition-opacity duration-300 [writing-mode:vertical-rl] lg:block ${
                    open ? "opacity-0" : "opacity-100 delay-300"
                  }`}
                >
                  {c.name}
                </span>

                {/* Expanded content (always shown on mobile) */}
                <div
                  className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5 transition-all duration-500 sm:gap-4 sm:p-6 lg:p-8 ${
                    open
                      ? "translate-y-0 opacity-100 lg:delay-200"
                      : "translate-y-0 opacity-100 lg:translate-y-6 lg:opacity-0"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#78D94F] sm:mb-1.5 sm:text-[11px] sm:tracking-[0.2em]">
                      EPIC STORE COLLECTION
                    </p>

                    <h3
                      className={`${head} truncate text-base font-extrabold text-white sm:text-2xl lg:whitespace-nowrap lg:text-4xl`}
                    >
                      {c.name}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-xs text-gray-200 sm:mt-1.5 sm:text-sm lg:whitespace-nowrap">
                      {c.subtitle}
                    </p>
                  </div>

                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-sm text-[#17171B] transition duration-300 group-hover:rotate-45 group-hover:bg-[#78D94F] sm:h-10 sm:w-10 sm:text-base lg:h-12 lg:w-12 lg:text-xl">
                    ↗
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}