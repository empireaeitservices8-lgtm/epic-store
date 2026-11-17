"use client";

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

const testimonials = [
  {
    name: "Ananya Menon",
    location: "Kochi, Kerala",
    initials: "AM",
    rating: 5,
    product: "Custom Wall Prints",
    review:
      "Absolutely loved the quality! The print looks beautiful on my bedroom wall. The colours and finishing were exactly what I expected.",
  },
  {
    name: "Rahul Nair",
    location: "Bengaluru, Karnataka",
    initials: "RN",
    rating: 5,
    product: "Minimalist Art Poster",
    review:
      "Great collection and a smooth shopping experience. The design looks premium and adds a completely different feel to my workspace.",
  },
  {
    name: "Meera Krishnan",
    location: "Chennai, Tamil Nadu",
    initials: "MK",
    rating: 5,
    product: "Aesthetic Wall Art",
    review:
      "I ordered a print for my living room and I am really happy with it. Beautiful design, lovely presentation, and great attention to detail.",
  },
];

const INTERVAL = 7000;
const head = "font-[family-name:var(--font-syne)]";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (dir: 1 | -1) =>
      setIndex((i) => (i + dir + testimonials.length) % testimonials.length),
    []
  );

  /* Reveal on scroll */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Auto-advance */
  useEffect(() => {
    if (paused || !visible) return;
    const t = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, visible, go]);

  return (
    <section
      className={`${syne.variable} ${inter.variable} relative overflow-hidden bg-[#17171B] px-4 py-16 font-[family-name:var(--font-inter)] sm:px-6 lg:px-10 lg:py-24`}
    >
      {/* Decoration */}
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-[#78D94F]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#78D94F]/10 blur-3xl" />

      <div
        ref={sectionRef}
        className={`relative mx-auto max-w-7xl transition-all duration-700 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Section heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
          <p className="mb-4 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#78D94F]">
            <span className="h-0.5 w-10 bg-[#78D94F]" />
            Customer Stories
            <span className="h-0.5 w-10 bg-[#78D94F]" />
          </p>

          <h2
            className={`${head} text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl`}
          >
            Loved by Our Customers<span className="text-[#78D94F]">.</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-400">
            Every print tells a story. Here is what our customers say about
            their Epic Store experience.
          </p>

          {/* Rating summary */}
          <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3">
            <span className={`${head} text-xl font-extrabold text-white`}>5.0</span>
            <span className="text-lg tracking-widest text-[#78D94F]">★★★★★</span>
            <span className="text-xs font-medium text-gray-400">
              Customer satisfaction
            </span>
          </div>
        </div>

        {/* Featured testimonial */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="relative mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-12"
        >
          {/* Big quote mark */}
          <span
            aria-hidden="true"
            className={`${head} pointer-events-none absolute right-6 top-2 select-none text-[120px] font-extrabold leading-none text-[#78D94F]/15 sm:right-10 sm:text-[180px]`}
          >
            ”
          </span>

          {/* Stacked slides: the tallest sets the height, so nothing jumps */}
          <div className="grid" aria-live="polite">
            {testimonials.map((t, i) => (
              <article
                key={t.name}
                aria-hidden={i !== index}
                className={`col-start-1 row-start-1 transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
                  i === index
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-4 opacity-0"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xl tracking-widest text-[#78D94F]">
                    {"★".repeat(t.rating)}
                  </div>
                  <span className="rounded-full bg-[#78D94F]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#78D94F]">
                    Verified Review*
                  </span>
                </div>

                <p
                  className={`${head} mt-7 text-xl font-semibold leading-relaxed text-white sm:text-2xl lg:text-[28px]`}
                >
                  “{t.review}”
                </p>

                <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Purchased: {t.product}
                </p>

                <div className="my-6 h-px bg-white/10" />

                <div className="flex items-center gap-4">
                  <div
                    className={`${head} grid h-12 w-12 place-items-center rounded-full bg-[#78D94F] text-sm font-bold text-[#17171B]`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <h3 className={`${head} font-bold text-white`}>{t.name}</h3>
                    <p className="mt-1 text-xs text-gray-400">{t.location}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Selector + controls */}
        <div className="mx-auto mt-8 flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-stretch">
          <div
            role="tablist"
            aria-label="Choose a testimonial"
            className="grid flex-1 grid-cols-3 gap-3"
          >
            {testimonials.map((t, i) => {
              const on = i === index;
              return (
                <button
                  key={t.name}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setIndex(i)}
                  className={`relative cursor-pointer overflow-hidden rounded-2xl border p-3 text-left transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F] sm:p-4 ${
                    on
                      ? "border-[#78D94F] bg-white/[0.08]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`${head} grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors duration-300 ${
                        on ? "bg-[#78D94F] text-[#17171B]" : "bg-white/10 text-[#78D94F]"
                      }`}
                    >
                      {t.initials}
                    </span>
                    <span className="hidden min-w-0 sm:block">
                      <span className="block truncate text-sm font-bold text-white">
                        {t.name}
                      </span>
                      <span className="block truncate text-[11px] text-gray-400">
                        {t.location}
                      </span>
                    </span>
                  </div>

                  {/* Progress bar on the active tab */}
                  <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/5">
                    {on && (
                      <span
                        key={`bar-${index}`}
                        style={{
                          transitionDuration: paused ? "0ms" : `${INTERVAL}ms`,
                        }}
                        className={`block h-full bg-[#78D94F] transition-[width] ease-linear ${
                          visible ? "w-full" : "w-0"
                        }`}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-2 sm:justify-end">
            {[
              { label: "Previous testimonial", icon: "←", dir: -1 as const },
              { label: "Next testimonial", icon: "→", dir: 1 as const },
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                aria-label={b.label}
                onClick={() => go(b.dir)}
                className="grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-white/20 bg-transparent text-lg text-white transition duration-300 hover:scale-105 hover:border-[#78D94F] hover:bg-[#78D94F] hover:text-[#17171B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]"
              >
                {b.icon}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          *Sample testimonial content for the homepage design. Replace with
          genuine customer reviews and verified-purchase status before launch.
        </p>
      </div>
    </section>
  );
}