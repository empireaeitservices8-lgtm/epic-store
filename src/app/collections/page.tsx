"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Inter, Montserrat } from "next/font/google";
import { ArrowRight } from "lucide-react";
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

const collections = [
  {
    name: "Football",
    subtitle: "Iconic stadium moments & legends.",
    description:
      "Celebrate the beautiful game with metal posters, signed jersey frames, and desk pads featuring football legends and iconic clubs.",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&q=85",
    count: "Explore Football Collection",
  },
  {
    name: "Cricket",
    subtitle: "Championship glory & historic knocks.",
    description:
      "Tribute prints, framed jersey displays, and collector artwork dedicated to world cricket icons and unforgettable matches.",
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1000&q=85",
    count: "Explore Cricket Collection",
  },
  {
    name: "Movie, Series & Characters (DC, Marvel)",
    subtitle: "Superheroes, cinema icons & multiverse legends.",
    description:
      "Action-packed DC, Marvel, and cult cinema artwork printed on vibrant HD metal posters and wide desk pads.",
    image:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1000&q=85",
    count: "Explore DC, Marvel & Cinema",
  },
  {
    name: "Anime",
    subtitle: "Legendary arcs & neon shonen battles.",
    description:
      "High-contrast anime metal posters and desk pads inspired by iconic characters, battles, and anime worlds.",
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&q=85",
    count: "Explore Anime Collection",
  },
  {
    name: "Cars, Bike & F1",
    subtitle: "Supercars, superbikes & F1 telemetry.",
    description:
      "High-octane Formula 1 racers, JDM legends, hypercars, and superbikes rendered on metallic wall art and desk pads.",
    image:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1000&q=85",
    count: "Explore Cars, Bike & F1",
  },
  {
    name: "Games and Characters",
    subtitle: "30+ designs from next-gen gaming worlds.",
    description:
      "30+ signature gaming designs spanning open-world epics, esports classics, and legendary game characters.",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&q=85",
    count: "Explore 30+ Gaming Designs",
  },
  {
    name: "Lady Boss",
    subtitle: "Fierce ambition, elegance & leadership.",
    description:
      "Bold, modern wall art and workspace pieces celebrating women leaders, entrepreneurs, and unstoppable confidence.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&q=85",
    count: "Explore Lady Boss Collection",
  },
  {
    name: "Gym and Motivation",
    subtitle: "Discipline, hustle & relentless mindset.",
    description:
      "High-impact motivational typography and physique artwork engineered for home gyms, studios, and offices.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&q=85",
    count: "Explore Gym & Motivation",
  },
];

const head = `${montserrat.className} font-[family-name:var(--font-montserrat)]`;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

const revealCls =
  "translate-y-8 opacity-0 transition-all duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none data-[in=1]:translate-y-0 data-[in=1]:opacity-100";

export default function CollectionsPage() {
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
      { threshold: 0.12 }
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const reveal = (delay: number) => ({
    "data-reveal": "",
    style: { transitionDelay: `${delay}ms` },
  });

  return (
    <>
      <Header />

      <main
        ref={pageRef}
        className={`${montserrat.variable} ${inter.variable} min-h-screen bg-[#F7F8F5] font-[family-name:var(--font-inter)]`}
      >
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-5 py-12 text-center md:py-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hero-banners/collections-hero.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-80"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#17171B]/55 via-[#17171B]/45 to-[#17171B]/75" />
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#78D94F]/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

          <div className="relative mx-auto max-w-3xl">
            <p
              {...reveal(100)}
              className={`${revealCls} flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#78D94F]`}
            >
              <span className="h-0.5 w-8 bg-[#78D94F]" />
              Curated For Your Space
              <span className="h-0.5 w-8 bg-[#78D94F]" />
            </p>

            <h1
              {...reveal(200)}
              className={`${revealCls} ${head} mt-4 text-2xl font-semibold uppercase leading-[1.06] tracking-tight text-white sm:text-3xl md:text-4xl`}
            >
              Explore Our
              <span className="block text-[#78D94F]">Collections</span>
            </h1>

            <p
              {...reveal(300)}
              className={`${revealCls} mx-auto mt-5 max-w-xl leading-7 text-gray-400`}
            >
              Discover artwork and creative designs selected to bring
              personality, inspiration, and style into your space.
            </p>

            <div {...reveal(400)} className={revealCls}>
              <Link
                href="/shop"
                className={`group mt-7 inline-flex items-center justify-center gap-3 rounded-full bg-[#78D94F] px-9 py-4 text-sm font-bold tracking-[0.1em] text-[#17171B] no-underline shadow-[0_10px_30px_rgba(120,217,79,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-white ${focus}`}
              >
                EXPLORE ALL PRODUCTS
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* ================= COLLECTION GRID ================= */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="m-0 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-green-700">
                <span className="h-0.5 w-8 bg-[#78D94F]" />
                Our Selection
              </p>
              <h2
                className={`${head} m-0 mt-3 text-2xl font-semibold text-[#17171B] md:text-3xl`}
              >
                Discover Collections
              </h2>
            </div>

            <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-500">
              {collections.length} curated collections
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection, index) => (
              <article
                key={collection.name}
                {...reveal(120 + Math.min(index, 5) * 60)}
                className={`${revealCls} group flex flex-col overflow-hidden rounded-2xl border border-gray-200/75 bg-white p-3 shadow-[0_2px_14px_rgba(23,23,27,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#17171B]/20 hover:shadow-[0_18px_40px_-12px_rgba(23,23,27,0.12)] sm:rounded-3xl`}
              >
                <Link
                  href={`/shop?collection=${encodeURIComponent(collection.name)}`}
                  className="relative block aspect-[16/10] overflow-hidden rounded-xl bg-[#F3F4F1] sm:rounded-2xl"
                >
                  <LoadingImage
                    src={collection.image}
                    alt={collection.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>

                <div className="flex flex-1 flex-col justify-between p-3.5 pt-4 sm:p-4 sm:pt-5">
                  <div>
                    <p className="m-0 text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-700">
                      {collection.subtitle}
                    </p>
                    <Link
                      href={`/shop?collection=${encodeURIComponent(collection.name)}`}
                      className="no-underline"
                    >
                      <h3
                        className={`${head} m-0 mt-1.5 text-base font-semibold text-[#17171B] transition hover:text-emerald-700 sm:text-lg`}
                      >
                        {collection.name}
                      </h3>
                    </Link>
                    <p className="m-0 mt-2 text-sm font-normal leading-6 text-gray-500">
                      {collection.description}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-3.5">
                    <Link
                      href={`/shop?collection=${encodeURIComponent(collection.name)}`}
                      className={`inline-flex items-center gap-2 rounded-full bg-[#F7F8F5] px-4 py-2 text-xs font-semibold text-[#17171B] no-underline transition hover:bg-[#78D94F] ${focus}`}
                    >
                      {collection.count}
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ================= CUSTOM COLLECTION BANNER ================= */}
        <section className="mx-auto max-w-7xl px-4 pb-12 pt-2 sm:px-6 lg:px-10 lg:pb-14">
          <div
            {...reveal(100)}
            className={`${revealCls} relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-3xl bg-[#17171B] p-7 text-center text-white md:flex-row md:p-12 md:text-left`}
          >
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#78D94F]/15 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[#78D94F]/10 blur-3xl" />

            <div className="relative max-w-2xl">
              <p className="m-0 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#78D94F] md:justify-start">
                <span className="h-0.5 w-8 bg-[#78D94F]" />
                Make It Personal
              </p>
              <h2
                className={`${head} m-0 mt-3 text-2xl font-semibold uppercase tracking-tight text-white md:text-3xl`}
              >
                Have Your Own{" "}
                <span className="text-[#78D94F]">Design in Mind?</span>
              </h2>
              <p className="mb-0 mt-4 leading-7 text-gray-400">
                Create something unique with personalized prints made around
                your ideas.
              </p>
            </div>

            <Link
              href="/custom-prints"
              className={`group relative inline-flex shrink-0 items-center gap-3 rounded-full bg-[#78D94F] px-9 py-4 text-sm font-bold tracking-[0.1em] text-[#17171B] no-underline shadow-[0_10px_30px_rgba(120,217,79,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-white ${focus}`}
            >
              EXPLORE CUSTOM PRINTS
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
