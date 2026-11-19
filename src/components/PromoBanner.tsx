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

const steps = [
  { n: "01", title: "Upload", text: "Share your photo or idea" },
  { n: "02", title: "Customise", text: "Pick size and finish" },
  { n: "03", title: "Receive", text: "Delivered across India" },
];

const head = "font-[family-name:var(--font-syne)]";

export default function PromoBanner() {
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  /* Reveal on scroll */
  useEffect(() => {
    const el = cardRef.current;
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

  /* Cursor spotlight + image parallax (no re-renders) */
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--x", `${px * 100}%`);
    el.style.setProperty("--y", `${py * 100}%`);
    el.style.setProperty("--rx", `${((0.5 - py) * 6).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((px - 0.5) * 8).toFixed(2)}deg`);
  };
  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <section
      id="custom"
      className={`${syne.variable} ${inter.variable} px-4 py-8 font-[family-name:var(--font-inter)] sm:px-6 sm:py-12 lg:px-10 lg:py-14`}
    >
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={`relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#17171B] transition-all duration-700 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Background decoration */}
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#78D94F]/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#78D94F]/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--x,70%)_var(--y,30%),rgba(120,217,79,0.12),transparent_40%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />

        <div className="relative grid items-center gap-6 px-5 py-8 sm:gap-10 sm:px-10 sm:py-12 lg:grid-cols-2 lg:px-14 lg:py-14">
          {/* Text content */}
          <div className="max-w-xl">
            <span className="inline-flex items-center rounded-full border border-[#78D94F]/50 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-[#78D94F] sm:text-xs sm:tracking-[0.2em]">
              MAKE IT PERSONAL
            </span>

            <h2
              className={`${head} mt-4 text-3xl font-extrabold uppercase leading-[1.04] tracking-tight text-white sm:mt-5 sm:text-4xl lg:text-5xl`}
            >
              Your space.
              <br />
              Your <span className="text-[#78D94F]">story.</span>
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-gray-300 sm:text-base sm:leading-7">
              Turn your favourite memories, ideas, and creativity into
              something special with our custom-designed prints.
            </p>

            {/* Steps */}
            <ol className="mt-6 grid max-w-md grid-cols-3 gap-2.5 sm:gap-3">
              {steps.map((s) => (
                <li
                  key={s.n}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#78D94F]/60 hover:bg-white/[0.06]"
                >
                  <span
                    className={`${head} text-xs font-bold text-[#78D94F]`}
                  >
                    {s.n}
                  </span>
                  <p className={`${head} mt-2 text-sm font-bold text-white`}>
                    {s.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-4 text-gray-400">
                    {s.text}
                  </p>
                </li>
              ))}
            </ol>

            <Link
              href="/custom-prints"
              className="group relative mt-6 inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#78D94F] px-6 py-3 text-xs font-bold tracking-[0.1em] text-[#17171B] shadow-[0_10px_30px_rgba(120,217,79,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#78D94F] sm:mt-7 sm:px-7 sm:py-3.5 sm:text-sm"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-[120%] bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.6)_50%,transparent_70%)] transition-transform duration-700 group-hover:translate-x-[120%]"
              />
              <span className="relative">CREATE YOUR OWN</span>
              <span className="relative text-lg transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </div>

          {/* Image */}
          <div
            className="relative mx-auto w-full max-w-lg transition-transform duration-300 ease-out [transform:perspective(1000px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]"
          >
            <div className="absolute inset-4 rounded-3xl bg-[#78D94F]/20 blur-2xl" />

            {/* Decorative frame offset */}
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl border border-[#78D94F]/40" />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1000&q=85"
              alt="Creative wall art and interior decor"
              loading="lazy"
              className="relative h-56 w-full rounded-2xl object-cover shadow-2xl transition-transform duration-700 hover:scale-[1.02] sm:h-72 lg:h-80"
            />

            <div className="absolute -bottom-4 left-2 rounded-xl bg-white px-4 py-2.5 shadow-xl transition-transform duration-300 hover:-translate-y-1 sm:-bottom-5 sm:-left-8 sm:px-5 sm:py-4">
              <p className="text-[10px] font-medium tracking-[0.12em] text-gray-500 sm:text-xs">
                DESIGNED BY YOU
              </p>
              <p className={`${head} mt-0.5 text-sm font-extrabold text-[#17171B] sm:mt-1 sm:text-lg`}>
                Made Personal.
              </p>
            </div>

            <div className="absolute -top-3 right-2 grid h-16 w-16 place-items-center rounded-full bg-[#78D94F] text-center text-[9px] font-extrabold leading-tight tracking-wider text-[#17171B] shadow-xl transition-transform duration-500 hover:rotate-12 sm:-right-6 sm:-top-4 sm:h-24 sm:w-24 sm:text-xs">
              100%
              <br />
              CUSTOM
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}