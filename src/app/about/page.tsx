"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Inter, Syne } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

const values = [
  {
    number: "01",
    title: "Creativity",
    description:
      "We believe every space deserves a unique identity. Our collections bring creative ideas and inspiring designs into everyday life.",
    icon: "✦",
  },
  {
    number: "02",
    title: "Quality",
    description:
      "We focus on thoughtful designs, quality materials, and beautiful finishing to make every product special.",
    icon: "◇",
  },
  {
    number: "03",
    title: "Personalization",
    description:
      "Your memories and ideas matter. Our custom print options help you create products that reflect your personality.",
    icon: "♡",
  },
  {
    number: "04",
    title: "Customer First",
    description:
      "We aim to make discovering, selecting, and ordering your favourite designs simple and enjoyable.",
    icon: "◎",
  },
];

const benefits = [
  "Creative and distinctive designs",
  "Options for personalized prints",
  "A curated range of wall art",
  "A simple shopping experience",
];

/* Shared class strings */
const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#78D94F]";
/* Scroll-reveal: an observer sets data-in="1" on [data-reveal] elements */
const rv =
  "opacity-0 translate-y-8 transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] data-[in=1]:translate-y-0 data-[in=1]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100";
const eyebrow =
  "inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em]";
const btnGreen = `group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#78D94F] px-8 py-4 text-sm font-bold tracking-[0.1em] text-[#17171B] shadow-[0_10px_30px_rgba(120,217,79,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-white ${focus}`;

/* Cursor spotlight for cards (no re-renders) */
function spot(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--x", `${e.clientX - r.left}px`);
  el.style.setProperty("--y", `${e.clientY - r.top}px`);
}

export default function AboutPage() {
  const [activeValue, setActiveValue] = useState(0);
  const pageRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  /* One observer reveals every [data-reveal] element */
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

  /* Hero cursor glow */
  const onHeroMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const delay = (ms: number) => ({ transitionDelay: `${ms}ms` });

  return (
    <>
      <Header />

      <main
        ref={pageRef}
        className={`${syne.variable} ${inter.variable} bg-white font-[family-name:var(--font-inter)]`}
      >
        {/* ================= HERO ================= */}
        <section
          ref={heroRef}
          onMouseMove={onHeroMove}
          className="relative flex min-h-[calc(100svh-120px)] items-center overflow-hidden bg-[#17171B] px-4 py-24 sm:px-6 lg:px-10 lg:py-32"
        >
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-[#78D94F]/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--x,70%)_var(--y,30%),rgba(120,217,79,0.14),transparent_40%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

          {/* Giant outlined letters */}
          <span
            aria-hidden="true"
            className={`${head} pointer-events-none absolute -right-6 bottom-0 select-none text-[clamp(120px,24vw,360px)] font-extrabold leading-[0.8] text-white/[0.03]`}
          >
            ABOUT
          </span>

          <div className="relative mx-auto w-full max-w-7xl">
            <div className="max-w-3xl">
              {/* Breadcrumb */}
              <nav
                aria-label="Breadcrumb"
                data-reveal
                className={`${rv} mb-8 flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-gray-400`}
              >
                <Link
                  href="/"
                  className={`text-gray-400 no-underline transition hover:text-[#78D94F] ${focus}`}
                >
                  HOME
                </Link>
                <span>/</span>
                <span className="text-white">ABOUT</span>
              </nav>

              <span
                data-reveal
                style={delay(80)}
                className={`${rv} ${eyebrow} text-[#78D94F]`}
              >
                <span className="h-0.5 w-10 bg-[#78D94F]" />
                Get to Know Us
              </span>

              <h1
                data-reveal
                style={delay(160)}
                className={`${rv} ${head} mt-6 text-5xl font-extrabold uppercase leading-[1] tracking-tight text-white sm:text-6xl lg:text-7xl`}
              >
                More Than
                <br />
                Just <span className="text-[#78D94F]">A Store.</span>
              </h1>

              <p
                data-reveal
                style={delay(260)}
                className={`${rv} mt-7 max-w-xl text-base leading-8 text-gray-300 sm:text-lg`}
              >
                We bring creativity, inspiration, and personal expression
                together through thoughtfully selected designs and
                personalized prints.
              </p>

              <div data-reveal style={delay(340)} className={`${rv} mt-9`}>
                <Link href="/shop" className={btnGreen}>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -translate-x-[120%] bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.6)_50%,transparent_70%)] transition-transform duration-700 group-hover:translate-x-[120%]"
                  />
                  <span className="relative">EXPLORE OUR STORE</span>
                  <span className="relative text-lg transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* Scroll cue */}
            <div
              aria-hidden="true"
              className="absolute -bottom-12 left-0 hidden items-center gap-3 text-[10px] font-semibold tracking-[0.3em] text-gray-500 lg:flex"
            >
              <span className="relative h-10 w-px overflow-hidden bg-white/15">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-bounce bg-[#78D94F]" />
              </span>
              SCROLL
            </div>
          </div>
        </section>

        {/* ================= BRAND INTRODUCTION ================= */}
        <section className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div data-reveal className={`${rv} relative`}>
              <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border border-[#78D94F]/50" />
              <div className="group relative overflow-hidden rounded-3xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1100&q=85"
                  alt="Creative interior with wall art and decor"
                  loading="lazy"
                  className="h-[350px] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105 sm:h-[480px]"
                />
              </div>

              <div className="absolute -bottom-6 -right-3 rounded-2xl bg-[#78D94F] p-6 shadow-xl transition-transform duration-500 hover:-rotate-3 sm:-right-6">
                <p className={`${head} text-3xl font-extrabold text-[#17171B]`}>
                  EPIC
                </p>
                <p className="text-xs font-bold tracking-[0.2em] text-[#17171B]">
                  YOUR STYLE
                </p>
              </div>
            </div>

            <div>
              <span
                data-reveal
                className={`${rv} ${eyebrow} text-green-700`}
              >
                <span className="h-0.5 w-10 bg-[#78D94F]" />
                About Epic Store
              </span>

              <h2
                data-reveal
                style={delay(80)}
                className={`${rv} ${head} mt-5 text-4xl font-extrabold uppercase leading-[1.03] tracking-tight text-[#17171B] sm:text-5xl`}
              >
                Creativity That
                <br />
                Makes Spaces <span className="text-[#78D94F]">Special.</span>
              </h2>

              <p
                data-reveal
                style={delay(160)}
                className={`${rv} mt-7 text-base leading-8 text-gray-600`}
              >
                Epic Store is an online destination for creative products,
                decorative prints, and personalized designs. We aim to help
                people express their interests and personality through
                products they love.
              </p>

              <p
                data-reveal
                style={delay(220)}
                className={`${rv} mt-5 text-base leading-8 text-gray-600`}
              >
                From eye-catching posters to personalized wall art, our goal
                is to make discovering designs and creating meaningful spaces
                a simple and enjoyable experience.
              </p>

              <div data-reveal style={delay(280)} className={rv}>
                <Link
                  href="/collections"
                  className={`group mt-8 inline-flex items-center gap-3 rounded-full border border-[#17171B]/15 bg-white px-6 py-3 text-xs font-bold tracking-[0.14em] text-[#17171B] no-underline transition duration-300 hover:border-[#17171B] hover:bg-[#17171B] hover:text-white ${focus}`}
                >
                  DISCOVER OUR COLLECTIONS
                  <span className="text-lg transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MISSION & VISION ================= */}
        <section className="bg-[#F7F8F5] px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Mission */}
              <div
                data-reveal
                onMouseMove={spot}
                className={`${rv} group relative overflow-hidden rounded-3xl bg-[#17171B] p-8 sm:p-12`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(400px_circle_at_var(--x,50%)_var(--y,50%),rgba(120,217,79,0.16),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span
                  aria-hidden="true"
                  className={`${head} absolute right-6 top-4 text-7xl font-extrabold text-white/[0.05]`}
                >
                  01
                </span>

                <span className={`${eyebrow} relative text-[#78D94F]`}>
                  <span className="h-0.5 w-10 bg-[#78D94F]" />
                  Our Mission
                </span>

                <h2
                  className={`${head} relative mt-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl`}
                >
                  Make Creativity Part of Everyday Life.
                </h2>

                <p className="relative mt-6 leading-8 text-gray-400">
                  Our mission is to bring inspiring designs and personalized
                  products within reach, helping customers express themselves
                  and make their spaces more meaningful.
                </p>
              </div>

              {/* Vision */}
              <div
                data-reveal
                style={delay(120)}
                onMouseMove={spot}
                className={`${rv} group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 sm:p-12`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(400px_circle_at_var(--x,50%)_var(--y,50%),rgba(120,217,79,0.18),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span
                  aria-hidden="true"
                  className={`${head} absolute right-6 top-4 text-7xl font-extrabold text-black/[0.04]`}
                >
                  02
                </span>

                <span className={`${eyebrow} relative text-green-700`}>
                  <span className="h-0.5 w-10 bg-[#78D94F]" />
                  Our Vision
                </span>

                <h2
                  className={`${head} relative mt-6 text-3xl font-extrabold leading-tight text-[#17171B] sm:text-4xl`}
                >
                  A World Filled With Personal Expression.
                </h2>

                <p className="relative mt-6 leading-8 text-gray-600">
                  We aspire to build a destination where people can discover
                  creative products, explore new ideas, and turn their
                  imagination into something tangible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHY CHOOSE US ================= */}
        <section className="px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <span data-reveal className={`${rv} ${eyebrow} text-green-700`}>
                <span className="h-0.5 w-10 bg-[#78D94F]" />
                Why Epic Store
              </span>

              <h2
                data-reveal
                style={delay(80)}
                className={`${rv} ${head} mt-5 text-4xl font-extrabold uppercase leading-[1.03] tracking-tight text-[#17171B] sm:text-5xl`}
              >
                Designed Around
                <br />
                <span className="text-[#78D94F]">Your Lifestyle.</span>
              </h2>

              <p
                data-reveal
                style={delay(160)}
                className={`${rv} mt-6 leading-8 text-gray-600`}
              >
                We want every visit to Epic Store to help you discover
                something that fits your taste, your space, and your ideas.
              </p>

              <ul className="m-0 mt-8 list-none space-y-3 p-0">
                {benefits.map((b, i) => (
                  <li
                    key={b}
                    data-reveal
                    style={delay(220 + i * 80)}
                    className={`${rv} group flex items-center gap-4 rounded-2xl border border-transparent px-4 py-3 transition-colors duration-300 hover:border-gray-200 hover:bg-[#F7F8F5]`}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#78D94F]/20 font-bold text-[#17171B] transition duration-300 group-hover:scale-110 group-hover:bg-[#78D94F]">
                      ✓
                    </span>
                    <p className="m-0 text-sm font-semibold text-gray-700">{b}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal style={delay(120)} className={`${rv} relative`}>
              <div className="absolute -left-4 -top-4 h-full w-full rounded-3xl bg-[#78D94F]/20" />
              <div className="group relative overflow-hidden rounded-3xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1100&q=85"
                  alt="Creative workspace and interior inspiration"
                  loading="lazy"
                  className="h-[350px] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105 sm:h-[480px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================= CORE VALUES (interactive) ================= */}
        <section className="bg-[#F7F8F5] px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span
                data-reveal
                className={`${rv} ${eyebrow} justify-center text-green-700`}
              >
                <span className="h-0.5 w-10 bg-[#78D94F]" />
                What We Believe
                <span className="h-0.5 w-10 bg-[#78D94F]" />
              </span>

              <h2
                data-reveal
                style={delay(80)}
                className={`${rv} ${head} mt-5 text-4xl font-extrabold uppercase tracking-tight text-[#17171B] sm:text-5xl`}
              >
                Our Core Values<span className="text-[#78D94F]">.</span>
              </h2>

              <p
                data-reveal
                style={delay(160)}
                className={`${rv} mt-5 leading-7 text-gray-500`}
              >
                The principles that guide our approach to products,
                creativity, and customer experience.
              </p>
            </div>

            <div
              data-reveal
              className={`${rv} grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}
            >
              {/* Selector */}
              <div
                role="tablist"
                aria-label="Our core values"
                aria-orientation="vertical"
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
              >
                {values.map((v, i) => {
                  const on = i === activeValue;
                  return (
                    <button
                      key={v.number}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setActiveValue(i)}
                      onMouseEnter={() => setActiveValue(i)}
                      className={`group flex cursor-pointer items-center gap-4 rounded-2xl border p-5 text-left transition duration-300 ${focus} ${
                        on
                          ? "border-[#78D94F] bg-white shadow-xl lg:translate-x-2"
                          : "border-gray-200 bg-white/60 hover:border-gray-300"
                      }`}
                    >
                      <span
                        className={`${head} text-sm font-bold transition-colors duration-300 ${
                          on ? "text-[#78D94F]" : "text-gray-400"
                        }`}
                      >
                        {v.number}
                      </span>
                      <span
                        className={`${head} flex-1 text-lg font-extrabold transition-colors duration-300 ${
                          on ? "text-[#17171B]" : "text-gray-500"
                        }`}
                      >
                        {v.title}
                      </span>
                      <span
                        className={`text-2xl transition-all duration-300 ${
                          on ? "scale-110 text-[#78D94F]" : "text-gray-300"
                        }`}
                      >
                        {v.icon}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Detail panel: slides stack so height never jumps */}
              <div className="relative overflow-hidden rounded-3xl bg-[#17171B] p-8 sm:p-12">
                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#78D94F]/15 blur-3xl" />

                <div className="relative grid" aria-live="polite">
                  {values.map((v, i) => (
                    <div
                      key={v.number}
                      aria-hidden={i !== activeValue}
                      className={`col-start-1 row-start-1 flex flex-col justify-between gap-10 transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
                        i === activeValue
                          ? "translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-4 opacity-0"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="text-7xl leading-none text-[#78D94F] sm:text-8xl"
                      >
                        {v.icon}
                      </span>

                      <div>
                        <p className="mb-3 text-xs font-bold tracking-[0.25em] text-[#78D94F]">
                          VALUE {v.number}
                        </p>
                        <h3
                          className={`${head} text-3xl font-extrabold text-white sm:text-4xl`}
                        >
                          {v.title}
                        </h3>
                        <p className="mt-4 max-w-md text-base leading-8 text-gray-400">
                          {v.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="bg-white px-4 py-20 sm:px-6 lg:px-10">
          <div
            data-reveal
            onMouseMove={spot}
            className={`${rv} group relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#17171B] px-7 py-16 text-center sm:px-12 lg:py-24`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_circle_at_var(--x,50%)_var(--y,0%),rgba(120,217,79,0.16),transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

            <div className="relative">
              <span className={`${eyebrow} justify-center text-[#78D94F]`}>
                <span className="h-0.5 w-10 bg-[#78D94F]" />
                Make It Epic
                <span className="h-0.5 w-10 bg-[#78D94F]" />
              </span>

              <h2
                className={`${head} mx-auto mt-5 max-w-3xl text-4xl font-extrabold uppercase leading-[1.03] tracking-tight text-white sm:text-5xl lg:text-6xl`}
              >
                Find Something That
                <span className="text-[#78D94F]"> Speaks to You.</span>
              </h2>

              <p className="mx-auto mt-6 max-w-xl leading-7 text-gray-400">
                Explore our collections and discover designs that bring your
                ideas and spaces to life.
              </p>

              <Link href="/shop" className={`${btnGreen} mt-9`}>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-[120%] bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.6)_50%,transparent_70%)] transition-transform duration-700 group-hover:translate-x-[120%]"
                />
                <span className="relative">SHOP NOW</span>
                <span className="relative text-lg transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}