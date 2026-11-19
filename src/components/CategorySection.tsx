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

const categories = [
  {
    name: "Posters",
    subtitle: "Art that speaks your style",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=900&q=85",
    href: "/shop?category=posters",
    number: "01",
    span: "col-span-2 sm:col-span-1",
  },
  {
    name: "Canvas Prints",
    subtitle: "Bring your walls to life",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=85",
    href: "/shop?category=canvas-prints",
    number: "02",
    span: "",
  },
  {
    name: "Metal Posters",
    subtitle: "Bold art. Modern finish.",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=900&q=85",
    href: "/shop?category=metal-posters",
    number: "03",
    span: "",
  },
  {
    name: "Custom Prints",
    subtitle: "Make it personal",
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?w=900&q=85",
    href: "/custom-prints",
    number: "04",
    span: "",
  },
  {
    name: "Tapestries",
    subtitle: "Give your space a new vibe",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=85",
    href: "/shop?category=tapestries",
    number: "05",
    span: "",
  },
  {
    name: "Stickers",
    subtitle: "Little details. Big personality.",
    image:
      "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=900&q=85",
    href: "/shop?category=stickers",
    number: "06",
    span: "col-span-2 sm:col-span-1",
  },
];

const head = "font-[family-name:var(--font-syne)]";

/* Cursor spotlight + subtle 3D tilt (no re-renders) */
function onCardMove(e: React.MouseEvent<HTMLAnchorElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top) / r.height;
  el.style.setProperty("--x", `${px * 100}%`);
  el.style.setProperty("--y", `${py * 100}%`);
  el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 5}deg) rotateY(${(px - 0.5) * 6}deg) translateY(-4px)`;
}
function onCardLeave(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.transform = "";
}

export default function CategorySection() {
  const [visible, setVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  /* Reveal cards when they scroll into view */
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="categories"
      className={`${syne.variable} ${inter.variable} w-full overflow-hidden bg-[#fafaf7] px-4 py-10 font-[family-name:var(--font-inter)] sm:px-8 sm:py-14 lg:px-16 lg:py-16`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-green-700 sm:tracking-[0.25em]">
              <span className="h-0.5 w-8 bg-[#78D94F] sm:w-10" />
              Explore our collections
            </p>

            <h2
              className={`${head} text-3xl font-extrabold leading-[1.04] tracking-tight text-[#17171B] sm:text-4xl lg:text-5xl`}
            >
              SHOP BY <span className="text-[#78D94F]">CATEGORY.</span>
            </h2>
          </div>

          <Link
            href="/categories"
            className="group inline-flex w-fit items-center gap-2.5 rounded-full border border-[#17171B]/15 bg-white px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-[#17171B] no-underline transition duration-300 hover:border-[#17171B] hover:bg-[#17171B] hover:text-white"
          >
            VIEW ALL CATEGORIES
            <span className="text-base transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>

        {/* Compact Category Grid (2 rows on desktop, 2-col on mobile) */}
        <div
          ref={gridRef}
          className="grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:gap-4 lg:auto-rows-[220px] lg:grid-cols-3 lg:gap-5"
        >
          {categories.map((c, i) => (
            <Link
              key={c.number}
              href={c.href}
              onMouseMove={onCardMove}
              onMouseLeave={onCardLeave}
              style={{ transitionDelay: visible ? `${i * 70}ms` : "0ms" }}
              className={`group relative overflow-hidden rounded-2xl bg-[#17171B] shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-[opacity,transform,box-shadow] duration-500 will-change-transform hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#78D94F] ${
                c.span
              } ${
                visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[900ms] ease-out group-hover:scale-110"
                style={{ backgroundImage: `url("${c.image}")` }}
              />

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5 transition-colors duration-300 group-hover:from-black/95" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),rgba(120,217,79,0.22),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Number */}
              <span
                className={`${head} absolute right-3 top-3 rounded-full border border-white/40 bg-black/25 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm transition-colors duration-300 group-hover:border-[#78D94F] group-hover:bg-[#78D94F] group-hover:text-[#17171B] sm:right-4 sm:top-4 sm:px-3 sm:text-xs`}
              >
                {c.number}
              </span>

              {/* Details */}
              <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5">
                <p className="mb-1 hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-[#78D94F] sm:block">
                  EPIC COLLECTION
                </p>

                <h3
                  className={`${head} m-0 text-base font-extrabold text-white transition-transform duration-500 group-hover:-translate-y-0.5 sm:text-2xl`}
                >
                  {c.name}
                </h3>

                <p className="m-0 mt-1 hidden text-xs text-white/75 sm:block">
                  {c.subtitle}
                </p>

                <div className="mt-2 flex items-center gap-2 text-[10px] font-bold tracking-[0.12em] text-white sm:mt-3 sm:gap-2.5 sm:text-xs">
                  <span className="relative h-px w-5 bg-white/50 transition-all duration-500 group-hover:w-10 group-hover:bg-[#78D94F] sm:w-7" />
                  EXPLORE
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#78D94F] text-xs text-[#17171B] transition duration-300 group-hover:translate-x-1.5 group-hover:bg-white sm:h-7 sm:w-7 sm:text-sm">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}