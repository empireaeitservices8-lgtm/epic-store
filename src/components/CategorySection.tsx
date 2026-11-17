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
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=900&q=85",
    href: "/shop?category=posters",
    number: "01",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    name: "Canvas Prints",
    subtitle: "Bring your walls to life",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=85",
    href: "/shop?category=canvas-prints",
    number: "02",
    span: "",
  },
  {
    name: "Metal Posters",
    subtitle: "Bold art. Modern finish.",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=900&q=85",
    href: "/shop?category=metal-posters",
    number: "03",
    span: "",
  },
  {
    name: "Custom Prints",
    subtitle: "Make it personal",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=900&q=85",
    href: "/shop?category=custom-prints",
    number: "04",
    span: "",
  },
  {
    name: "Tapestries",
    subtitle: "Give your space a new vibe",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=85",
    href: "/shop?category=tapestries",
    number: "05",
    span: "",
  },
  {
    name: "Stickers",
    subtitle: "Little details. Big personality.",
    image: "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=900&q=85",
    href: "/shop?category=stickers",
    number: "06",
    span: "lg:col-span-4",
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
      className={`${syne.variable} ${inter.variable} w-full bg-[#fafaf7] px-5 py-16 font-[family-name:var(--font-inter)] sm:px-8 sm:py-20 lg:px-16 lg:py-24`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-14 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-green-700">
              <span className="h-0.5 w-10 bg-[#78D94F]" />
              Explore our collections
            </p>

            <h2
              className={`${head} text-4xl font-extrabold leading-[1.02] tracking-tight text-[#17171B] sm:text-5xl lg:text-6xl`}
            >
              SHOP BY <span className="text-[#78D94F]">CATEGORY.</span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
              Discover something that matches your personality. Explore our
              collection of creative art and lifestyle products.
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex w-fit items-center gap-3 rounded-full border border-[#17171B]/15 bg-white px-6 py-3 text-xs font-bold tracking-[0.14em] text-[#17171B] transition duration-300 hover:border-[#17171B] hover:bg-[#17171B] hover:text-white"
          >
            VIEW ALL CATEGORIES
            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>

        {/* Category Grid */}
        <div
          ref={gridRef}
          className="grid auto-rows-[300px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:auto-rows-[280px] lg:grid-cols-4"
        >
          {categories.map((c, i) => (
            <Link
              key={c.number}
              href={c.href}
              onMouseMove={onCardMove}
              onMouseLeave={onCardLeave}
              style={{ transitionDelay: visible ? `${i * 80}ms` : "0ms" }}
              className={`group relative overflow-hidden rounded-2xl bg-[#17171B] shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-[opacity,transform,box-shadow] duration-500 will-change-transform hover:shadow-[0_25px_50px_rgba(0,0,0,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#78D94F] ${
                c.span
              } ${i === 0 ? "sm:col-span-2" : ""} ${
                visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[900ms] ease-out group-hover:scale-110"
                style={{ backgroundImage: `url("${c.image}")` }}
              />

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/5 transition-colors duration-300 group-hover:from-black/95" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),rgba(120,217,79,0.22),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Number */}
              <span
                className={`${head} absolute right-5 top-5 rounded-full border border-white/40 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors duration-300 group-hover:border-[#78D94F] group-hover:bg-[#78D94F] group-hover:text-[#17171B]`}
              >
                {c.number}
              </span>

              {/* Details */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#78D94F]">
                  EPIC COLLECTION
                </p>

                <h3
                  className={`${head} text-2xl font-extrabold text-white transition-transform duration-500 group-hover:-translate-y-1 sm:text-3xl ${
                    i === 0 ? "lg:text-5xl" : ""
                  }`}
                >
                  {c.name}
                </h3>

                <p className="mt-2 text-sm text-white/75">{c.subtitle}</p>

                <div className="mt-5 flex items-center gap-3 text-xs font-bold tracking-[0.14em] text-white">
                  <span className="relative h-px w-8 bg-white/50 transition-all duration-500 group-hover:w-14 group-hover:bg-[#78D94F]" />
                  EXPLORE NOW
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#78D94F] text-lg text-[#17171B] transition duration-300 group-hover:translate-x-2 group-hover:bg-white">
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