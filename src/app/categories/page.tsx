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

const categories = [
  {
    name: "Metal Posters",
    slug: "metal-posters",
    description:
      "HD glossy and matte aluminium metal wall posters available in A4, A3, and A2 sizes with tool-free magnetic wall mounting.",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=85",
    count: "Explore Metal Posters",
  },
  {
    name: "Desk Pad",
    slug: "desk-pad",
    description:
      "Premium XXL anti-fray gaming and workspace desk pads crafted with an ultra-smooth micro-weave surface and non-slip rubber base.",
    image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=900&q=85",
    count: "Explore Desk Pads",
  },
  {
    name: "Signed Jersey Frame",
    slug: "signed-jersey-frame",
    description:
      "Museum-grade shadow-box display frames engineered to showcase and protect autographed football and cricket jerseys.",
    image: "/products/signed-jersey-frame.jpg",
    count: "Explore Jersey Frames",
  },
];

const head = `${montserrat.className} font-[family-name:var(--font-montserrat)]`;
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
        className={`${montserrat.variable} ${inter.variable} min-h-screen bg-[#F7F8F5] font-[family-name:var(--font-inter)]`}
      >
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-5 py-16 text-center md:py-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hero-banners/categories-hero.jpg"
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
              Find What You Love
              <span className="h-0.5 w-8 bg-[#78D94F]" />
            </p>

            <h1
              {...reveal(200)}
              className={`${revealCls} ${head} mt-4 text-2xl font-semibold uppercase leading-[1.06] tracking-tight text-white sm:text-3xl md:text-4xl`}
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
                className={`${head} m-0 mt-3 text-2xl font-semibold text-[#17171B] md:text-3xl`}
              >
                Browse All Categories
              </h2>
            </div>

            <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-500">
              {categories.length} categories
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <article
                key={category.name}
                {...reveal(120 + Math.min(index, 5) * 60)}
                className={`${revealCls} group flex flex-col overflow-hidden rounded-2xl border border-gray-200/75 bg-white p-3 shadow-[0_2px_14px_rgba(23,23,27,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#17171B]/20 hover:shadow-[0_18px_40px_-12px_rgba(23,23,27,0.12)] sm:rounded-3xl`}
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#F3F4F1] sm:rounded-2xl">
                  <LoadingImage
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-3.5 pt-4 sm:p-4 sm:pt-5">
                  <div>
                    <h3
                      className={`${head} m-0 text-base font-semibold text-[#17171B] sm:text-lg`}
                    >
                      {category.name}
                    </h3>

                    <p className="m-0 mt-2 text-sm font-normal leading-6 text-gray-500">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-3.5">
                    <Link
                      href={`/shop?category=${category.slug}`}
                      className={`inline-flex items-center gap-2 rounded-full bg-[#F7F8F5] px-4 py-2 text-xs font-semibold text-[#17171B] no-underline transition hover:bg-[#78D94F] ${focus}`}
                    >
                      {category.count}
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
                className={`${head} m-0 mt-3 text-2xl font-semibold uppercase tracking-tight text-[#17171B] md:text-3xl`}
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
                className={`${head} m-0 text-2xl font-semibold uppercase tracking-tight text-white md:text-3xl`}
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
