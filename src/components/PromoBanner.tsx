"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Inter, Montserrat } from "next/font/google";
import { ArrowRight, Check, Layers, ShoppingBag } from "lucide-react";
import LoadingImage from "@/components/LoadingImage";
import { addToStoreCart } from "@/lib/store";

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

type BundleTier = {
  id: number;
  size: "A3" | "A2" | "A1";
  label: string;
  dimensions: string;
  price: number;
  oldPrice: number;
  badge?: string;
  scaleClass: string;
};

const bundleTiers: BundleTier[] = [
  {
    id: 901,
    size: "A3",
    label: "A3 Trio",
    dimensions: "3 × (11.7 × 16.5 in)",
    price: 1699,
    oldPrice: 2097,
    scaleClass: "scale-[0.92]",
  },
  {
    id: 902,
    size: "A2",
    label: "A2 Trio",
    dimensions: "3 × (16.5 × 23.4 in)",
    price: 2499,
    oldPrice: 2997,
    badge: "MOST POPULAR",
    scaleClass: "scale-100",
  },
  {
    id: 903,
    size: "A1",
    label: "A1 Trio",
    dimensions: "3 × (23.4 × 33.1 in)",
    price: 3799,
    oldPrice: 4497,
    badge: "STUDIO WALL",
    scaleClass: "scale-[1.04]",
  },
];

const trioPreviews = [
  {
    title: "Football Legends",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=85",
  },
  {
    title: "Anime Neon Arc",
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=700&q=85",
  },
  {
    title: "F1 Telemetry",
    image:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=700&q=85",
  },
];

const bundlePerks = [
  { label: "3× Posters", detail: "Coordinated wall set" },
  { label: "Magnetic Mounts", detail: "3 kits included" },
  { label: "Free Delivery", detail: "Pan-India shipping" },
];

const head = `${montserrat.className} font-[family-name:var(--font-montserrat)]`;
const valueFont = `${inter.className} font-[family-name:var(--font-inter)] tabular-nums`;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

export default function PromoBanner() {
  const [selectedSize, setSelectedSize] = useState<"A3" | "A2" | "A1">("A2");
  const [justAdded, setJustAdded] = useState(false);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeBundle =
    bundleTiers.find((t) => t.size === selectedSize) ?? bundleTiers[1];
  const savings = activeBundle.oldPrice - activeBundle.price;
  const discountPct = Math.round((savings / activeBundle.oldPrice) * 100);

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

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  /* Cursor spotlight + image parallax (no re-renders) */
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--x", `${px * 100}%`);
    el.style.setProperty("--y", `${py * 100}%`);
    el.style.setProperty("--rx", `${((0.5 - py) * 5).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((px - 0.5) * 6).toFixed(2)}deg`);
  };

  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  const handleAddBundle = () => {
    addToStoreCart(
      {
        id: activeBundle.id,
        name: `3-Piece Metal Poster Bundle (${activeBundle.size})`,
        category: "Metal Posters",
        price: activeBundle.price,
        oldPrice: activeBundle.oldPrice,
        image: trioPreviews[1].image,
      },
      1
    );
    setJustAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <section
      id="bundle"
      className={`${montserrat.variable} ${inter.variable} px-4 py-8 font-[family-name:var(--font-inter)] sm:px-6 sm:py-12 lg:px-10 lg:py-14`}
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

        <div className="relative grid items-center gap-8 px-5 py-8 sm:gap-10 sm:px-10 sm:py-12 lg:grid-cols-12 lg:px-14 lg:py-14">
          {/* Left: Bundle Configurator */}
          <div className="lg:col-span-6">
            <span className="inline-flex items-center rounded-full border border-[#78D94F]/45 bg-[#78D94F]/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#78D94F]">
              3-Piece Wall Bundle
            </span>

            <h2
              className={`${head} mt-4 text-2xl font-semibold uppercase leading-[1.06] tracking-tight text-white sm:text-3xl lg:text-4xl`}
            >
              Build Your <span className="text-[#78D94F]">3-Piece</span>
              <br />
              Metal Poster Set.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-gray-300 sm:text-base">
              Pick your statement size —{" "}
              <strong className="font-semibold text-white">A3, A2, or A1</strong>{" "}
              — and get three coordinated HD aluminum posters with instant bundle
              savings.
            </p>

            {/* Size Selector (A3 / A2 / A1) */}
            <div className="mt-6">
              <div className="mb-2.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                <span>Select Bundle Size</span>
                <span className="text-[#78D94F]">{activeBundle.dimensions}</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {bundleTiers.map((tier) => {
                  const selected = tier.size === selectedSize;
                  return (
                    <button
                      key={tier.size}
                      type="button"
                      onClick={() => setSelectedSize(tier.size)}
                      aria-pressed={selected}
                      className={`group relative flex cursor-pointer flex-col items-start rounded-2xl border p-3 text-left transition-all duration-300 sm:p-4 ${focus} ${
                        selected
                          ? "border-[#78D94F] bg-[#78D94F]/15 shadow-[0_0_24px_rgba(120,217,79,0.18)]"
                          : "border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex w-full items-center justify-between gap-1">
                        <span
                          className={`${head} text-lg font-bold sm:text-xl ${
                            selected ? "text-[#78D94F]" : "text-white"
                          }`}
                        >
                          {tier.size}
                        </span>
                        {tier.badge && (
                          <span className="hidden rounded-full bg-[#78D94F] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#17171B] sm:inline-block">
                            {tier.size === "A2" ? "Popular" : "Max"}
                          </span>
                        )}
                      </div>
                      <span className="mt-1 text-[11px] text-gray-400">
                        3 × {tier.size} Posters
                      </span>
                      <span
                        className={`${valueFont} mt-2 text-sm font-semibold text-white sm:text-base`}
                      >
                        ₹{tier.price.toLocaleString("en-IN")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Perks */}
            <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">
              {bundlePerks.map((perk) => (
                <div
                  key={perk.label}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
                >
                  <p className="text-xs font-semibold text-white">
                    {perk.label}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">
                    {perk.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Price + Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={handleAddBundle}
                className={`group relative inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-full border-0 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] shadow-[0_10px_30px_rgba(120,217,79,0.25)] transition duration-300 hover:-translate-y-0.5 sm:px-7 sm:text-sm ${focus} ${
                  justAdded
                    ? "bg-white text-[#17171B]"
                    : "bg-[#78D94F] text-[#17171B] hover:bg-white"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                    <span>Bundle Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                    <span>
                      Add {activeBundle.size} Bundle • ₹
                      {activeBundle.price.toLocaleString("en-IN")}
                    </span>
                  </>
                )}
              </button>

              <Link
                href="/shop?category=Metal%20Posters"
                className={`inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-white no-underline transition hover:border-[#78D94F] hover:text-[#78D94F] ${focus}`}
              >
                Browse Posters
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right: Interactive 3-Piece Wall Triptych Preview */}
          <div className="relative lg:col-span-6">
            <div className="relative mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-transform duration-300 ease-out [transform:perspective(1000px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] sm:p-6">
              {/* Top status bar */}
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-300">
                  <Layers className="h-3.5 w-3.5 text-[#78D94F]" aria-hidden="true" />
                  3-Piece Wall Preview
                </span>

                <span
                  className={`${valueFont} rounded-full bg-[#78D94F] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#17171B]`}
                >
                  Save {discountPct}% (₹{savings.toLocaleString("en-IN")})
                </span>
              </div>

              {/* 3-Piece Triptych Frames */}
              <div
                className={`grid grid-cols-3 items-center gap-2.5 py-2 transition-transform duration-500 sm:gap-4 ${activeBundle.scaleClass}`}
              >
                {trioPreviews.map((item, idx) => (
                  <div
                    key={item.title}
                    className={`group relative overflow-hidden rounded-xl border border-white/15 bg-[#0F0F12] shadow-2xl transition duration-500 hover:-translate-y-1 sm:rounded-2xl ${
                      idx === 1 ? "aspect-[3/4.3]" : "aspect-[3/4]"
                    }`}
                  >
                    <LoadingImage
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                      {activeBundle.size}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom Summary Strip */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3.5 text-xs text-gray-300">
                <span>
                  Bundle Total:{" "}
                  <strong className={`${valueFont} text-sm font-bold text-white`}>
                    ₹{activeBundle.price.toLocaleString("en-IN")}
                  </strong>{" "}
                  <span className={`${valueFont} text-gray-500 line-through`}>
                    ₹{activeBundle.oldPrice.toLocaleString("en-IN")}
                  </span>
                </span>
                <span className="text-[11px] font-medium text-[#78D94F]">
                  Includes 3× Magnetic Wall Mounts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
