"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Inter, Montserrat } from "next/font/google";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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

const collections = [
  {
    name: "Football",
    tag: "Sports",
    subtitle: "Iconic stadium moments, legends, and matchday art.",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&q=85",
  },
  {
    name: "Cricket",
    tag: "Sports",
    subtitle: "Championship glory, legendary knocks, and stadium roar.",
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=900&q=85",
  },
  {
    name: "Movie, Series & Characters (DC, Marvel)",
    tag: "Pop Culture",
    subtitle: "Superheroes, cinema icons, and multiverse legends.",
    image:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=900&q=85",
  },
  {
    name: "Anime",
    tag: "Illustration",
    subtitle: "Legendary arcs, shonen battles, and neon anime art.",
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&q=85",
  },
  {
    name: "Cars, Bike & F1",
    tag: "Motorsport",
    subtitle: "Supercars, motorsport telemetry, and F1 circuits.",
    image:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=85",
  },
  {
    name: "Games and Characters",
    tag: "Gaming",
    subtitle: "30+ signature gaming worlds and iconic protagonists.",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&q=85",
  },
  {
    name: "Lady Boss",
    tag: "Editorial",
    subtitle: "Fierce ambition, elegance, and empowering statement art.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=85",
  },
  {
    name: "Gym and Motivation",
    tag: "Mindset",
    subtitle: "Discipline, hustle, and relentless mindset.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=85",
  },
];

const head = `${montserrat.className} font-[family-name:var(--font-montserrat)]`;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

export default function ExploreCollections() {
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
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="collections"
      className={`${montserrat.variable} ${inter.variable} overflow-hidden bg-white px-4 py-12 font-[family-name:var(--font-inter)] sm:px-8 sm:py-16 lg:px-16 lg:py-20`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-green-700 sm:mb-3 sm:tracking-[0.25em]">
              <span className="h-0.5 w-8 bg-[#78D94F] sm:w-10" />
              Curated for you
            </p>

            <h2
              className={`${head} text-2xl font-semibold leading-[1.06] tracking-tight text-[#17171B] sm:text-3xl lg:text-4xl`}
            >
              EXPLORE <span className="text-[#78D94F]">COLLECTIONS.</span>
            </h2>

            <p className="mt-2.5 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Discover carefully curated worlds designed to match your style,
              passion, and space.
            </p>
          </div>

          <Link
            href="/collections"
            className={`group inline-flex w-fit items-center gap-2 rounded-full border border-[#17171B]/15 bg-white px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-[#17171B] no-underline transition duration-300 hover:border-[#17171B] hover:bg-[#17171B] hover:text-white ${focus}`}
          >
            VIEW ALL COLLECTIONS
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Modern 4-Column Collection Grid */}
        <div
          ref={wrapRef}
          className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4"
        >
          {collections.map((c, i) => (
            <Link
              key={c.name}
              href={`/shop?collection=${encodeURIComponent(c.name)}`}
              aria-label={`${c.name}: ${c.subtitle}`}
              style={{ transitionDelay: visible ? `${i * 60}ms` : "0ms" }}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-[#17171B] shadow-[0_6px_24px_rgba(23,23,27,0.06)] no-underline transition-all duration-500 hover:-translate-y-1.5 hover:border-[#78D94F]/60 hover:shadow-[0_22px_45px_-14px_rgba(23,23,27,0.22)] sm:rounded-3xl ${focus} ${
                visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              {/* Full-bleed Visual Frame */}
              <div className="relative aspect-[4/4.6] w-full overflow-hidden bg-[#1D1D22]">
                <LoadingImage
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Cinematic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#17171B] via-[#17171B]/35 to-black/15 transition-opacity duration-500 group-hover:via-[#17171B]/45" />

                {/* Top Bar: Action Arrow */}
                <div className="absolute right-3 top-3 flex items-center justify-end sm:right-4 sm:top-4">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:border-[#78D94F] group-hover:bg-[#78D94F] group-hover:text-[#17171B] sm:h-9 sm:w-9">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5">
                  <h3
                    className={`${head} line-clamp-2 text-sm font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-[#78D94F] sm:text-lg`}
                  >
                    {c.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-gray-300 sm:text-xs">
                    {c.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
