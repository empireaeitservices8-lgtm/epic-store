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

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1000&q=85";

/* Preview sizes (edit to match the sizes you actually sell) */
const sizes = [
  { id: "A4", label: "A4", dims: "21 × 29.7 cm", scale: "scale-[0.78]" },
  { id: "A3", label: "A3", dims: "29.7 × 42 cm", scale: "scale-[0.9]" },
  { id: "A2", label: "A2", dims: "42 × 59.4 cm", scale: "scale-100" },
];

const features = [
  "Upload your own photos",
  "Choose your print size",
  "Personalize your design",
  "Made just for you",
];

const head = "font-[family-name:var(--font-syne)]";

export default function CustomPrints() {
  const [size, setSize] = useState("A3");
  const [photo, setPhoto] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const current = sizes.find((s) => s.id === size) ?? sizes[1];

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
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Free the preview URL when it changes or on unmount */
  useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo);
    };
  }, [photo]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setPhoto(URL.createObjectURL(file));
    }
    e.target.value = "";
  };

  const reveal = (delay: number) => ({
    style: { transitionDelay: visible ? `${delay}ms` : "0ms" },
    className: `transition-all duration-700 ${
      visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    }`,
  });

  return (
    <section
      className={`${syne.variable} ${inter.variable} flex items-center overflow-hidden bg-[#F7F8F5] px-4 py-6 font-[family-name:var(--font-inter)] sm:px-6 sm:py-10 lg:min-h-[calc(100svh-5rem)] lg:px-10 lg:py-8`}
    >
      <div
        ref={sectionRef}
        className="mx-auto grid w-full max-w-7xl items-center gap-5 sm:gap-8 lg:grid-cols-2 lg:gap-14"
      >
        {/* Left: Live preview */}
        <div
          {...reveal(0)}
          className={`relative mx-auto w-full max-w-xl ${reveal(0).className}`}
        >
          <div className="absolute -left-5 -top-5 h-24 w-24 rounded-full bg-[#78D94F]/25 blur-2xl sm:h-32 sm:w-32" />

          {/* Wall */}
          <div className="relative overflow-hidden rounded-2xl bg-[#E9ECE4] px-4 pb-2.5 pt-4 shadow-xl sm:rounded-3xl sm:px-10 sm:pb-5 sm:pt-8">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/[0.06] to-transparent sm:h-16" />

            {/* Framed print */}
            <div className="flex min-h-[165px] items-center justify-center sm:min-h-[340px] lg:min-h-[min(430px,50svh)]">
              <div
                className={`origin-center transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${current.scale}`}
              >
                <div className="w-[120px] rounded-sm bg-white p-2 shadow-[0_20px_40px_rgba(0,0,0,0.22)] ring-1 ring-black/5 transition-transform duration-500 hover:-rotate-1 sm:w-[240px] sm:p-3 lg:w-[min(270px,29svh)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo ?? DEFAULT_IMAGE}
                    alt="Personalized wall art preview"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Size readout */}
            <p className="mt-1 text-center text-[10px] font-semibold tracking-[0.18em] text-gray-500 sm:mt-0 sm:text-xs sm:tracking-[0.2em]">
              {current.label} · {current.dims}
            </p>
          </div>

          {/* Caption card */}
          <div className="absolute bottom-2 left-2 rounded-xl bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 sm:-bottom-5 sm:-left-6 sm:bg-white sm:px-5 sm:py-4 sm:shadow-xl">
            <p className="text-[9px] font-semibold tracking-widest text-gray-400 sm:text-xs">
              YOUR MEMORIES
            </p>
            <p className={`${head} mt-0.5 text-xs font-extrabold text-[#17171B] sm:mt-1 sm:text-lg`}>
              Your Personal Art.
            </p>
          </div>

          {/* Floating label */}
          <div className="absolute right-2 top-2 rounded-xl bg-[#78D94F] px-2.5 py-1.5 shadow-md transition-transform duration-500 hover:rotate-3 sm:-right-5 sm:-top-5 sm:rounded-2xl sm:px-5 sm:py-4 sm:shadow-lg">
            <p className="text-[8px] font-bold uppercase tracking-wider text-[#17171B] sm:text-xs">
              Made for you
            </p>
            <p className={`${head} text-sm font-extrabold leading-tight text-[#17171B] sm:mt-1 sm:text-2xl`}>
              100%
            </p>
            <p className="text-[9px] font-medium text-[#17171B] sm:text-xs">Personalised</p>
          </div>
        </div>

        {/* Right: Content */}
        <div className="max-w-xl">
          <div {...reveal(100)} className={reveal(100).className}>
            <span className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-green-700 sm:gap-3 sm:text-xs sm:tracking-[0.25em]">
              <span className="h-0.5 w-6 bg-[#78D94F] sm:w-10" />
              Create Something Unique
            </span>

            <h2
              className={`${head} mt-2 text-2xl font-extrabold uppercase leading-[1.05] tracking-tight text-[#17171B] sm:mt-4 sm:text-4xl lg:text-[clamp(36px,6.4svh,58px)]`}
            >
              Your Photos.{" "}
              <span className="sm:block">Your Style.</span>
              <br className="sm:hidden" />
              <span className="text-[#78D94F] sm:block">Your Print.</span>
            </h2>

            <p className="mt-2 text-xs leading-5 text-gray-600 sm:mt-4 sm:text-base sm:leading-7">
              Turn your favourite photos, memories, and creative ideas into
              beautiful custom prints. Choose your design, select your size,
              and make something that is truly yours.
            </p>
          </div>

          {/* Try it: size + upload */}
          <div
            {...reveal(200)}
            className={`mt-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:mt-5 sm:p-4 ${reveal(200).className}`}
          >
            <p className="mb-2 text-[10px] font-bold tracking-[0.18em] text-gray-400 sm:mb-3 sm:text-[11px] sm:tracking-[0.2em]">
              TRY IT NOW
            </p>

            <div
              role="radiogroup"
              aria-label="Choose print size"
              className="flex flex-wrap items-center gap-1.5 sm:gap-2.5"
            >
              {sizes.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={size === s.id}
                  onClick={() => setSize(s.id)}
                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[11px] font-bold tracking-[0.12em] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F] sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-[0.14em] ${
                    size === s.id
                      ? "border-[#17171B] bg-[#17171B] text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#78D94F] hover:text-[#17171B]"
                  }`}
                >
                  {s.label}
                </button>
              ))}

              <span className="mx-1 hidden h-5 w-px bg-gray-200 sm:block" />

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onFile}
                className="sr-only"
                aria-label="Upload a photo to preview"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-[#78D94F] bg-[#78D94F]/10 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.1em] text-[#17171B] transition duration-300 hover:bg-[#78D94F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F] sm:gap-2 sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-[0.14em]"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 16V4M6 10l6-6 6 6M4 20h16" />
                </svg>
                {photo ? "CHANGE PHOTO" : "PREVIEW PHOTO"}
              </button>

              {photo && (
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="cursor-pointer rounded-full px-2.5 py-1.5 text-[11px] font-semibold text-gray-500 underline-offset-4 transition hover:text-[#17171B] hover:underline sm:px-3 sm:py-2.5 sm:text-xs"
                >
                  Reset
                </button>
              )}
            </div>

            <p className="mt-2 text-[10px] text-gray-400 sm:mt-3 sm:text-[11px]">
              Preview only. Your photo stays on your device until you start an order.
            </p>
          </div>

          {/* Features */}
          <div
            {...reveal(300)}
            className={`mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3 ${reveal(300).className}`}
          >
            {features.map((f) => (
              <div key={f} className="group flex items-center gap-2 sm:gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#78D94F]/20 text-[11px] font-bold text-[#17171B] transition duration-300 group-hover:scale-110 group-hover:bg-[#78D94F] sm:h-7 sm:w-7 sm:text-sm">
                  ✓
                </span>
                <span className="text-xs font-medium text-gray-700 sm:text-sm">{f}</span>
              </div>
            ))}
          </div>

          <div
            {...reveal(400)}
            className={`mt-4 flex flex-wrap items-center gap-4 sm:mt-6 sm:gap-5 ${reveal(400).className}`}
          >
            <Link
              href="/custom-prints"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[#17171B] px-6 py-3 text-xs font-bold tracking-[0.1em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#78D94F] hover:text-[#17171B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#78D94F] sm:gap-3 sm:px-8 sm:py-4 sm:text-sm"
            >
              START CREATING
              <span className="text-base transition-transform duration-300 group-hover:translate-x-1.5 sm:text-lg">
                →
              </span>
            </Link>

            <span className="text-xs font-medium text-gray-500 sm:text-sm">
              Make it yours.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}