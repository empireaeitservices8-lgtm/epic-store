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

const categories = [
  {
    name: "Posters",
    description: "Creative designs to make your walls stand out.",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900",
    count: "Explore Posters",
  },
  {
    name: "Canvas Prints",
    description: "Give your favourite artwork a beautiful canvas finish.",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=900",
    count: "Explore Canvas Prints",
  },
  {
    name: "Metal Posters",
    description: "Modern artwork for a bold and distinctive space.",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=900",
    count: "Explore Metal Posters",
  },
  {
    name: "Tapestries",
    description: "Add character and creativity to your interiors.",
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=900",
    count: "Explore Tapestries",
  },
  {
    name: "Stickers",
    description: "Small details that make your everyday items unique.",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900",
    count: "Explore Stickers",
  },
  {
    name: "Custom Prints",
    description: "Create personalized artwork using your own ideas.",
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900",
    count: "Create Custom Prints",
    custom: true,
  },
];

const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

const revealCls =
  "translate-y-8 opacity-0 transition-all duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none data-[in=1]:translate-y-0 data-[in=1]:opacity-100";

export default function CategoriesPage() {
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
        <section className="relative overflow-hidden bg-[#17171B] px-5 py-16 text-center md:py-24">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#78D94F]/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

          <div className="relative mx-auto max-w-3xl">
            <p
              {...reveal(100)}
              className={`${revealCls} flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#78D94F]`}
            >
              <span className="h-0.5 w-8 bg-[#78D94F]" />
              Find What You Love
              <span className="h-0.5 w-8 bg-[#78D94F]" />
            </p>

            <h1
              {...reveal(200)}
              className={`${revealCls} ${head} mt-4 text-4xl font-extrabold uppercase leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl`}
            >
              Shop by
              <span className="block text-[#78D94F]">Categories</span>
            </h1>

            <p
              {...reveal(300)}
              className={`${revealCls} mx-auto mt-5 max-w-xl leading-7 text-gray-400`}
            >
              Explore our product categories and discover artwork, wall decor,
              creative designs, and personalized prints for every space.
            </p>

            <div {...reveal(400)} className={revealCls}>
              <Link
                href="/shop"
                className={`group mt-9 inline-flex items-center justify-center gap-3 rounded-full bg-[#78D94F] px-9 py-4 text-sm font-bold tracking-[0.1em] text-[#17171B] no-underline shadow-[0_10px_30px_rgba(120,217,79,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-white ${focus}`}
              >
                VIEW ALL PRODUCTS
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* ================= CATEGORY GRID ================= */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="m-0 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-green-700">
                <span className="h-0.5 w-8 bg-[#78D94F]" />
                Shop Your Way
              </p>
              <h2
                className={`${head} m-0 mt-3 text-3xl font-extrabold text-[#17171B] md:text-4xl`}
              >
                Browse All Categories
              </h2>
            </div>

            <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-500">
              {categories.length} categories
            </span>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <article
                key={category.name}
                {...reveal(120 + Math.min(index, 5) * 60)}
                className={`${revealCls} group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-1 hover:border-[#78D94F] hover:shadow-[0_10px_30px_rgba(120,217,79,0.15)]`}
              >
                <div className="relative h-72 overflow-hidden">
                  <LoadingImage
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <span
                    className={`${head} absolute left-5 top-5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#17171B] shadow-sm`}
                  >
                    0{index + 1}
                  </span>
                </div>

                <div className="p-7">
                  <h3
                    className={`${head} m-0 text-2xl font-extrabold text-[#17171B]`}
                  >
                    {category.name}
                  </h3>

                  <p className="m-0 mt-3 min-h-14 leading-7 text-gray-500">
                    {category.description}
                  </p>

                  <Link
                    href={
                      category.custom
                        ? "/custom-prints"
                        : `/shop?category=${encodeURIComponent(category.name)}`
                    }
                    className={`mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#17171B] no-underline transition hover:text-green-700 ${focus}`}
                  >
                    {category.count}
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

        {/* ================= PROMOTIONAL BANNER ================= */}
        <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-10">
          <div
            {...reveal(100)}
            className={`${revealCls} grid items-center gap-8 overflow-hidden rounded-3xl bg-[#78D94F] p-7 md:grid-cols-2 md:p-12`}
          >
            <div>
              <p className="m-0 text-xs font-bold uppercase tracking-[0.25em] text-[#17171B]/70">
                Something Unique
              </p>

              <h2
                className={`${head} m-0 mt-3 text-3xl font-extrabold uppercase tracking-tight text-[#17171B] md:text-4xl`}
              >
                Make Your Own Collection
              </h2>

              <p className="mt-5 leading-8 text-[#17171B]/80">
                Have a design in mind? Explore custom prints and create
                something that reflects your personality.
              </p>

              <Link
                href="/custom-prints"
                className={`group mt-8 inline-flex items-center gap-3 rounded-full bg-[#17171B] px-8 py-4 text-sm font-bold tracking-[0.08em] text-white no-underline transition duration-300 hover:-translate-y-0.5 hover:bg-black ${focus}`}
              >
                EXPLORE CUSTOM PRINTS
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <div className="relative">
              <LoadingImage
                src="https://images.unsplash.com/photo-1549490349-8643362247b5?w=1000"
                alt="Creative artwork collection"
                wrapperClassName="relative h-72 w-full overflow-hidden rounded-2xl bg-[#17171B]/10 shadow-lg md:h-96"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* ================= BOTTOM CTA ================= */}
        <section className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-10 lg:pb-14">
          <div
            {...reveal(100)}
            className={`${revealCls} relative overflow-hidden rounded-3xl bg-[#17171B] px-8 py-12 text-center md:px-16`}
          >
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#78D94F]/15 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[#78D94F]/10 blur-3xl" />

            <div className="relative">
              <h2
                className={`${head} m-0 text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl`}
              >
                Ready to Discover{" "}
                <span className="text-[#78D94F]">Something New?</span>
              </h2>

              <p className="mx-auto mb-0 mt-5 max-w-xl leading-7 text-gray-400">
                Explore the complete Epic Store product catalogue.
              </p>

              <Link
                href="/shop"
                className={`group mt-9 inline-flex items-center justify-center gap-3 rounded-full bg-[#78D94F] px-9 py-4 text-sm font-bold tracking-[0.1em] text-[#17171B] no-underline shadow-[0_10px_30px_rgba(120,217,79,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-white ${focus}`}
              >
                SHOP ALL PRODUCTS
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
