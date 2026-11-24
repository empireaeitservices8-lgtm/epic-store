"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Inter, Montserrat } from "next/font/google";
import { ArrowRight, Check, Heart, Plus, Star } from "lucide-react";
import LoadingImage from "@/components/LoadingImage";
import {
  addToStoreCart,
  toggleStoreWishlist,
  useStoreWishlist,
} from "@/lib/store";

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

const products = [
  {
    id: 1,
    name: "Football Legends Metal Poster (A3)",
    category: "METAL POSTERS",
    price: 699,
    oldPrice: 999,
    rating: 4.9,
    reviews: 142,
    discount: "30% OFF",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=85",
    badge: "BESTSELLER",
  },
  {
    id: 2,
    name: "F1 Racing Telemetry XXL Desk Pad",
    category: "DESK PAD",
    price: 899,
    oldPrice: 1299,
    rating: 4.8,
    reviews: 98,
    discount: "31% OFF",
    image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=700&q=85",
    badge: "NEW",
  },
  {
    id: 3,
    name: "Autographed Football Signed Jersey Frame",
    category: "SIGNED JERSEY FRAME",
    price: 1499,
    oldPrice: 1999,
    rating: 4.9,
    reviews: 164,
    discount: "25% OFF",
    image: "/products/signed-jersey-frame.jpg",
    badge: "POPULAR",
  },
  {
    id: 4,
    name: "Anime Shonen Neon Metal Poster (A2)",
    category: "METAL POSTERS",
    price: 999,
    oldPrice: 1399,
    rating: 4.9,
    reviews: 136,
    discount: "29% OFF",
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=700&q=85",
    badge: "NEW",
  },
];

const filters = ["ALL", "NEW", "BESTSELLER", "POPULAR"];
const head = `${montserrat.className} font-[family-name:var(--font-montserrat)]`;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

export default function ProductSection() {
  const [filter, setFilter] = useState("ALL");
  const wishlist = useStoreWishlist();
  const [added, setAdded] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Reveal cards on scroll */
  useEffect(() => {
    const el = gridRef.current;
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

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const toggleWish = (id: number) => toggleStoreWishlist(id);

  const addToCart = (id: number) => {
    const p = products.find((item) => item.id === id);
    if (p) {
      addToStoreCart(p, 1);
    }
    setAdded(id);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(null), 1600);
  };

  const list = products.filter((p) => filter === "ALL" || p.badge === filter);

  return (
    <section
      id="new-arrivals"
      className={`${montserrat.variable} ${inter.variable} w-full overflow-hidden bg-[#F7F7F5] px-4 py-10 font-[family-name:var(--font-inter)] sm:px-8 sm:py-14 lg:px-16 lg:py-16`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading + Filter Bar */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 lg:flex-row lg:items-end">
          <div>
            <p className="mb-2 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-green-700 sm:tracking-[0.25em]">
              <span className="h-0.5 w-8 bg-[#78D94F] sm:w-10" />
              Fresh drops. Fresh vibes.
            </p>

            <h2
              className={`${head} m-0 text-2xl font-semibold leading-[1.06] tracking-tight text-[#17171B] sm:text-3xl lg:text-4xl`}
            >
              NEW <span className="text-[#78D94F]">ARRIVALS.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
            {/* Filter tabs */}
            <div
              role="tablist"
              aria-label="Filter products"
              className="flex flex-wrap gap-1.5 sm:gap-2"
            >
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  className={`cursor-pointer rounded-full border px-3.5 py-2 text-[10px] font-bold tracking-[0.14em] transition duration-300 sm:px-4 sm:text-[11px] ${focus} ${
                    filter === f
                      ? "border-[#17171B] bg-[#17171B] text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#78D94F] hover:text-[#17171B]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <Link
              href="/shop"
              className={`group inline-flex items-center gap-2 rounded-full border border-[#17171B]/15 bg-white px-4 py-2 text-[11px] font-bold tracking-[0.12em] text-[#17171B] no-underline transition duration-300 hover:border-[#17171B] hover:bg-[#17171B] hover:text-white sm:px-5 ${focus}`}
            >
              VIEW ALL
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {/* Compact 2-col Mobile / 4-col Desktop Product Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
        >
          {list.map((p, i) => {
            const liked = wishlist.includes(p.id);
            const isAdded = added === p.id;
            return (
              <article
                key={p.id}
                style={{ transitionDelay: visible ? `${i * 80}ms` : "0ms" }}
                className={`group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/75 bg-white shadow-[0_2px_14px_rgba(23,23,27,0.04)] transition-all duration-500 hover:-translate-y-1 hover:border-[#17171B]/20 hover:shadow-[0_18px_40px_-12px_rgba(23,23,27,0.12)] sm:rounded-3xl ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                {/* Modern Image Frame */}
                <div className="relative aspect-[4/4.2] overflow-hidden bg-[#F3F4F1]">
                  <Link href={`/products/${p.id}`} className="block h-full w-full">
                    <LoadingImage
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </Link>

                  <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-full bg-[#78D94F] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#17171B] shadow-sm sm:left-3.5 sm:top-3.5 sm:px-3 sm:text-[10px]">
                    {p.badge}
                  </span>

                  <span className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-full bg-[#17171B]/80 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm sm:bottom-3.5 sm:left-3.5">
                    {p.discount}
                  </span>

                  {/* Wishlist */}
                  <button
                    type="button"
                    aria-label={`${liked ? "Remove" : "Add"} ${p.name} ${
                      liked ? "from" : "to"
                    } wishlist`}
                    aria-pressed={liked}
                    onClick={() => toggleWish(p.id)}
                    className={`absolute right-2.5 top-2.5 grid h-8 w-8 cursor-pointer place-items-center rounded-full border-0 shadow-sm backdrop-blur-md transition duration-300 hover:scale-110 sm:right-3.5 sm:top-3.5 sm:h-9 sm:w-9 ${focus} ${
                      liked
                        ? "bg-[#78D94F] text-[#17171B]"
                        : "bg-white/90 text-[#17171B]"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${liked ? "fill-current" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {/* Modern Card Details */}
                <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-5">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="m-0 truncate text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400">
                        {p.category}
                      </p>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50/80 px-2 py-0.5 text-[11px] font-medium tabular-nums text-amber-700">
                        <Star
                          className="h-3 w-3 fill-amber-400 text-amber-400"
                          aria-hidden="true"
                        />
                        {p.rating}
                      </span>
                    </div>

                    <Link href={`/products/${p.id}`} className="no-underline">
                      <h3
                        className={`${head} m-0 mt-1.5 line-clamp-2 text-[13px] font-semibold leading-snug text-[#17171B] transition-colors duration-300 group-hover:text-emerald-700 sm:text-[15px]`}
                      >
                        {p.name}
                      </h3>
                    </Link>
                  </div>

                  {/* Price + Inline Add Button */}
                  <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
                    <div className="flex items-baseline gap-1.5 tabular-nums">
                      <span className="text-sm font-semibold text-[#17171B] sm:text-lg">
                        ₹{p.price}
                      </span>
                      <span className="text-[11px] font-normal text-gray-400 line-through sm:text-xs">
                        ₹{p.oldPrice}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(p.id)}
                      aria-label={`Add ${p.name} to cart`}
                      className={`inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full border-0 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] transition-all duration-300 sm:px-3.5 sm:py-2 sm:text-[11px] ${focus} ${
                        isAdded
                          ? "bg-[#78D94F] text-[#17171B]"
                          : "bg-[#17171B] text-white hover:bg-[#78D94F] hover:text-[#17171B]"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-3 w-3" aria-hidden="true" />
                          <span className="hidden sm:inline">Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3" aria-hidden="true" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {list.length === 0 && (
          <p className="py-12 text-center text-sm text-gray-500">
            No products in this filter yet.
          </p>
        )}
      </div>
    </section>
  );
}
