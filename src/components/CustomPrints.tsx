"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Inter, Montserrat } from "next/font/google";
import { ArrowRight, Check, RotateCcw, Upload } from "lucide-react";

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

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1000&q=85";
const WALL_TEXTURE_IMAGE = "/Home-page/custom-wall-bg.jpg";

/* Preview sizes */
const sizes = [
  { id: "A4", label: "A4", dims: "21 × 29.7 cm", scale: "scale-[0.8]" },
  { id: "A3", label: "A3", dims: "29.7 × 42 cm", scale: "scale-[0.92]" },
  { id: "A2", label: "A2", dims: "42 × 59.4 cm", scale: "scale-100" },
];

const finishes = ["Matte", "Glossy"] as const;

const features = [
  "Upload your own photos",
  "HD brushed aluminum",
  "Matte or glossy finish",
  "Ready to mount",
];

const head = `${montserrat.className} font-[family-name:var(--font-montserrat)]`;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

export default function CustomPrints() {
  const [size, setSize] = useState("A3");
  const [finish, setFinish] = useState<(typeof finishes)[number]>("Matte");
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
    className: `transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`,
  });

  return (
    <section
      className={`${montserrat.variable} ${inter.variable} overflow-hidden bg-[#F7F8F5] px-4 py-12 font-[family-name:var(--font-inter)] sm:px-8 sm:py-16 lg:px-16 lg:py-20`}
    >
      <div
        ref={sectionRef}
        className="mx-auto grid w-full max-w-7xl items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-14"
      >
        {/* Left: Studio Wall Preview */}
        <div
          {...reveal(0)}
          className={`relative mx-auto w-full max-w-xl lg:col-span-6 ${reveal(0).className}`}
        >
          <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-4 shadow-[0_20px_50px_-15px_rgba(23,23,27,0.1)] sm:p-6">
            {/* Top Preview Bar */}
            <div className="mb-4 flex items-center justify-between gap-2">
              <span className="inline-flex items-center rounded-full bg-[#78D94F] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#17171B]">
                100% Personalised
              </span>

              <span className="rounded-full border border-gray-200 bg-[#F7F8F5] px-3 py-1 text-[11px] font-medium tabular-nums text-gray-600">
                {current.label} · {current.dims}
              </span>
            </div>

            {/* Aesthetic Wall Stage */}
              <div className="relative flex aspect-[4/3] w-full items-start justify-center overflow-hidden rounded-2xl bg-[#1D1F22] px-4 pb-16 pt-7 sm:pb-24 sm:pt-10">
                {/* Aesthetic Interior Wall Backdrop */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={WALL_TEXTURE_IMAGE}
                  alt="Minimalist charcoal studio wall"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                />
                {/* Soft ambient lighting vignette */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_35%,rgba(0,0,0,0.22)_100%)]" />

                {/* Single Metal Poster Mounted Flush on the Wall */}
                <div
                  className={`relative origin-center transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${current.scale}`}
                >
                  <div className="relative w-[130px] overflow-hidden rounded-[4px] border-[3px] border-[#0E0F12] bg-white shadow-[0_22px_42px_rgba(0,0,0,0.72),0_4px_12px_rgba(0,0,0,0.45)] ring-1 ring-white/15 transition-transform duration-500 hover:-translate-y-0.5 sm:w-[180px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo ?? DEFAULT_IMAGE}
                      alt="Personalized metal poster preview"
                      className="aspect-[4/5] w-full object-cover"
                    />

                    {/* Glossy sheen overlay */}
                    {finish === "Glossy" && (
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.08)_38%,transparent_60%)]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Studio Spec Strip */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-gray-500">
                <span className="font-medium text-[#17171B]">
                  Your Personal Metal Print
                </span>
                <span className="text-[11px] text-gray-500">
                  {finish} Finish • Magnetic Wall Mount
                </span>
              </div>
            </div>
          </div>

          {/* Right: Content & Live Controls */}
          <div className="max-w-xl lg:col-span-6">
            <div {...reveal(100)} className={reveal(100).className}>
              <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-green-700 sm:tracking-[0.24em]">
                <span className="h-0.5 w-8 bg-[#78D94F] sm:w-10" />
                Create Something Unique
              </span>

              <h2
                className={`${head} mt-3 text-2xl font-semibold uppercase leading-[1.06] tracking-tight text-[#17171B] sm:text-3xl lg:text-4xl`}
              >
                Your Photos.{" "}
                <span className="sm:block">Your Style.</span>
                <br className="sm:hidden" />
                <span className="text-[#78D94F] sm:block">Your Print.</span>
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600 sm:mt-4 sm:text-base sm:leading-7">
                Turn your favourite photos, memories, and artwork into archival HD
                metal prints. Preview your image in real time, pick your size and
                finish, and we&apos;ll craft it to order.
              </p>
            </div>

            {/* Interactive Try-It Card */}
            <div
              {...reveal(200)}
              className={`mt-5 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_4px_20px_rgba(23,23,27,0.04)] sm:mt-6 sm:rounded-3xl sm:p-5 ${reveal(200).className}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Live Studio Preview
                </p>

                {/* Finish Toggle */}
                <div
                  role="radiogroup"
                  aria-label="Choose finish"
                  className="inline-flex rounded-full border border-gray-200 bg-[#F7F8F5] p-0.5"
                >
                  {finishes.map((f) => (
                    <button
                      key={f}
                      type="button"
                      role="radio"
                      aria-checked={finish === f}
                      onClick={() => setFinish(f)}
                      className={`cursor-pointer rounded-full border-0 px-3 py-1 text-[11px] font-semibold transition ${focus} ${finish === f
                        ? "bg-[#17171B] text-white"
                        : "bg-transparent text-gray-500 hover:text-[#17171B]"
                        }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3.5 flex flex-wrap items-center gap-2 sm:gap-2.5">
                {/* Size Pills */}
                <div
                  role="radiogroup"
                  aria-label="Choose print size"
                  className="flex items-center gap-1.5 sm:gap-2"
                >
                  {sizes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      role="radio"
                      aria-checked={size === s.id}
                      onClick={() => setSize(s.id)}
                      className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.1em] transition duration-300 ${focus} ${size === s.id
                        ? "border-[#17171B] bg-[#17171B] text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-[#78D94F] hover:text-[#17171B]"
                        }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <span className="mx-0.5 hidden h-5 w-px bg-gray-200 sm:block" />

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
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-dashed border-[#78D94F] bg-[#78D94F]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#17171B] transition duration-300 hover:bg-[#78D94F] ${focus}`}
                >
                  <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                  {photo ? "Change Photo" : "Preview Photo"}
                </button>

                {photo && (
                  <button
                    type="button"
                    onClick={() => setPhoto(null)}
                    className={`inline-flex cursor-pointer items-center gap-1 rounded-full border-0 bg-transparent px-2.5 py-2 text-xs font-medium text-gray-500 transition hover:text-[#17171B] ${focus}`}
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    Reset
                  </button>
                )}
              </div>

              <p className="mt-3 text-[11px] text-gray-400">
                Preview only. Your photo stays on your device until you start an order.
              </p>
            </div>

            {/* Features */}
            <div
              {...reveal(300)}
              className={`mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 ${reveal(300).className}`}
            >
              {features.map((f) => (
                <div key={f} className="group flex items-center gap-2.5">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#78D94F]/20 text-[#17171B] transition duration-300 group-hover:scale-110 group-hover:bg-[#78D94F]">
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-medium text-gray-700 sm:text-sm">
                    {f}
                  </span>
                </div>
              ))}
            </div>

            <div
              {...reveal(400)}
              className={`mt-6 flex flex-wrap items-center gap-4 sm:gap-5 ${reveal(400).className}`}
            >
              <Link
                href="/custom-prints"
                className={`group inline-flex items-center gap-2.5 rounded-full bg-[#17171B] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white no-underline transition duration-300 hover:-translate-y-0.5 hover:bg-[#78D94F] hover:text-[#17171B] sm:text-sm ${focus}`}
              >
                Start Creating
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>

              <span className="text-xs font-medium text-gray-500 sm:text-sm">
                Ships across India
              </span>
            </div>
          </div>
        </div>
    </section>
  );
}
