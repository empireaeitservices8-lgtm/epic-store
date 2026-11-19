"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Inter, Syne } from "next/font/google";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingImage from "@/components/LoadingImage";

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
    subtitle: "Less clutter. More character.",
    description:
      "Discover clean lines, subtle colors, and elegant artwork for modern spaces.",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1000",
    count: "Explore minimalist designs",
  },
  {
    name: "Nature Collection",
    subtitle: "Bring nature indoors.",
    description:
      "Explore botanical artwork, landscapes, and nature-inspired designs.",
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1000",
    count: "Explore nature designs",
  },
  {
    name: "Modern Aesthetic",
    subtitle: "Make your walls stand out.",
    description:
      "Bold compositions and contemporary artwork for expressive interiors.",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1000",
    count: "Explore modern designs",
  },
  {
    name: "Creative Spaces",
    subtitle: "Create a space that inspires.",
    description:
      "Unique artwork and playful designs for workspaces, studios, and rooms.",
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1000",
    count: "Explore creative designs",
  },
  {
    name: "Abstract Collection",
    subtitle: "Art without boundaries.",
    description:
      "Discover expressive shapes, colors, and abstract compositions.",
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?w=1000",
    count: "Explore abstract designs",
  },
  {
    name: "Vintage Collection",
    subtitle: "A timeless touch.",
    description:
      "Give your interiors a distinctive look with vintage-inspired artwork.",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1000",
    count: "Explore vintage designs",
  },
];

const head = "font-[family-name:var(--font-syne)]";
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
        className={`${syne.variable} ${inter.variable} min-h-screen bg-[#F7F8F5] font-[family-name:var(--font-inter)]`}
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
              className={`${revealCls} ${head} mt-4 text-4xl font-extrabold uppercase leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl`}
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
                className={`${head} m-0 mt-3 text-3xl font-extrabold text-[#17171B] md:text-4xl`}
              >
                Discover Collections
              </h2>
            </div>

            <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-500">
              {collections.length} curated collections
            </span>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection, index) => (
              <article
                key={collection.name}
                {...reveal(120 + Math.min(index, 5) * 60)}
                className={`${revealCls} group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-1 hover:border-[#78D94F] hover:shadow-[0_10px_30px_rgba(120,217,79,0.15)]`}
              >
                <div className="relative h-72 overflow-hidden">
                  <LoadingImage
                    src={collection.image}
                    alt={collection.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span
                    className={`${head} absolute left-5 top-5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#17171B] shadow-sm`}
                  >
                    COLLECTION 0{index + 1}
                  </span>
                </div>

                <div className="p-7">
                  <p className="m-0 text-xs font-bold uppercase tracking-[0.15em] text-green-700">
                    {collection.subtitle}
                  </p>
                  <h3
                    className={`${head} m-0 mt-2 text-2xl font-extrabold text-[#17171B]`}
                  >
                    {collection.name}
                  </h3>
                  <p className="m-0 mt-2.5 text-sm leading-7 text-gray-500">
                    {collection.description}
                  </p>

                  <Link
                    href={`/shop?collection=${encodeURIComponent(collection.name)}`}
                    className={`mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#17171B] no-underline transition hover:text-green-700 ${focus}`}
                  >
                    {collection.count}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                      aria-hidden="true"
                    />
                  </Link>
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
                className={`${head} m-0 mt-3 text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl`}
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
