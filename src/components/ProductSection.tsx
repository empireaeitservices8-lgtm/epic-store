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

const products = [
  {
    id: 1,
    name: "Astronaut Space Poster",
    category: "SPACE COLLECTION",
    price: 499,
    oldPrice: 799,
    rating: 4.8,
    reviews: 124,
    discount: "38% OFF",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=700&q=85",
    badge: "BESTSELLER",
  },
  {
    id: 2,
    name: "Abstract Modern Art",
    category: "MINIMAL COLLECTION",
    price: 599,
    oldPrice: 899,
    rating: 4.7,
    reviews: 89,
    discount: "33% OFF",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=700&q=85",
    badge: "NEW",
  },
  {
    id: 3,
    name: "Vintage Aesthetic Poster",
    category: "VINTAGE COLLECTION",
    price: 399,
    oldPrice: 599,
    rating: 4.9,
    reviews: 156,
    discount: "33% OFF",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700&q=85",
    badge: "POPULAR",
  },
  {
    id: 4,
    name: "Nature Landscape Print",
    category: "NATURE COLLECTION",
    price: 549,
    oldPrice: 799,
    rating: 4.8,
    reviews: 72,
    discount: "31% OFF",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=700&q=85",
    badge: "NEW",
  },
];

const filters = ["ALL", "NEW", "BESTSELLER", "POPULAR"];
const head = "font-[family-name:var(--font-syne)]";

export default function ProductSection() {
  const [filter, setFilter] = useState("ALL");
  const [wishlist, setWishlist] = useState<number[]>([]);
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

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const toggleWish = (id: number) =>
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));

  const addToCart = (id: number) => {
    setAdded(id);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(null), 1600);
    /* TODO: connect to your cart state / API */
  };

  const list = products.filter((p) => filter === "ALL" || p.badge === filter);

  return (
    <section
      id="new-arrivals"
      className={`${syne.variable} ${inter.variable} w-full bg-[#F7F7F5] px-5 py-16 font-[family-name:var(--font-inter)] sm:px-8 sm:py-20 lg:px-16 lg:py-24`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-green-700">
              <span className="h-0.5 w-10 bg-[#78D94F]" />
              Fresh drops. Fresh vibes.
            </p>

            <h2
              className={`${head} text-4xl font-extrabold leading-[1.02] tracking-tight text-[#17171B] sm:text-5xl lg:text-6xl`}
            >
              NEW <span className="text-[#78D94F]">ARRIVALS.</span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
              Discover our latest designs and bring something extraordinary to
              your space.
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex w-fit items-center gap-3 rounded-full border border-[#17171B]/15 bg-white px-6 py-3 text-xs font-bold tracking-[0.14em] text-[#17171B] transition duration-300 hover:border-[#17171B] hover:bg-[#17171B] hover:text-white"
          >
            VIEW ALL PRODUCTS
            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>

        {/* Filter tabs */}
        <div
          role="tablist"
          aria-label="Filter products"
          className="mb-10 flex flex-wrap gap-2.5"
        >
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`cursor-pointer rounded-full border px-5 py-2.5 text-[11px] font-bold tracking-[0.16em] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F] ${
                filter === f
                  ? "border-[#17171B] bg-[#17171B] text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-[#78D94F] hover:text-[#17171B]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {list.map((p, i) => {
            const liked = wishlist.includes(p.id);
            const isAdded = added === p.id;
            return (
              <article
                key={p.id}
                style={{ transitionDelay: visible ? `${i * 90}ms` : "0ms" }}
                className={`group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(0,0,0,0.12)] ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <span className="absolute left-4 top-4 rounded-full bg-[#78D94F] px-3 py-1.5 text-[10px] font-extrabold tracking-wider text-[#17171B]">
                    {p.badge}
                  </span>

                  <span className="absolute bottom-4 left-4 rounded-full bg-[#17171B] px-3 py-1.5 text-xs font-bold text-white transition-opacity duration-300 group-hover:opacity-0">
                    {p.discount}
                  </span>

                  {/* Wishlist */}
                  <button
                    type="button"
                    aria-label={`${liked ? "Remove" : "Add"} ${p.name} ${liked ? "from" : "to"} wishlist`}
                    aria-pressed={liked}
                    onClick={() => toggleWish(p.id)}
                    className={`absolute right-4 top-4 grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 shadow-md transition duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F] ${
                      liked ? "bg-[#78D94F] text-[#17171B]" : "bg-white text-[#17171B]"
                    }`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={liked ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className={`transition-transform duration-300 ${liked ? "scale-110" : ""}`}
                    >
                      <path d="M12 20.5s-7.5-4.6-9.6-9.4A5.4 5.4 0 0 1 12 6.2a5.4 5.4 0 0 1 9.6 4.9c-2.1 4.8-9.6 9.4-9.6 9.4z" />
                    </svg>
                  </button>

                  {/* Quick add (slides up on hover; always visible on touch) */}
                  <button
                    type="button"
                    onClick={() => addToCart(p.id)}
                    className="absolute inset-x-4 bottom-4 hidden translate-y-4 cursor-pointer rounded-xl bg-white/95 py-3 text-[11px] font-bold tracking-[0.16em] text-[#17171B] opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-[#78D94F] group-hover:translate-y-0 group-hover:opacity-100 lg:block"
                  >
                    QUICK ADD +
                  </button>
                </div>

                {/* Details */}
                <div className="p-5">
                  <p className="mb-2 text-[10px] font-bold tracking-[0.15em] text-gray-400">
                    {p.category}
                  </p>

                  <h3
                    className={`${head} min-h-12 text-base font-bold leading-snug text-[#17171B] transition-colors duration-300 group-hover:text-green-700`}
                  >
                    {p.name}
                  </h3>

                  {/* Rating with partial stars */}
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className="relative inline-block text-sm leading-none tracking-tight text-gray-200"
                      aria-label={`Rated ${p.rating} out of 5`}
                    >
                      ★★★★★
                      <span
                        className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-yellow-400"
                        style={{ width: `${(p.rating / 5) * 100}%` }}
                      >
                        ★★★★★
                      </span>
                    </span>
                    <span className="text-xs font-semibold text-gray-600">
                      {p.rating}
                    </span>
                    <span className="text-xs text-gray-400">({p.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className={`${head} text-2xl font-extrabold text-[#17171B]`}>
                      ₹{p.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{p.oldPrice}
                    </span>
                    <span className="rounded bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-700">
                      Save ₹{p.oldPrice - p.price}
                    </span>
                  </div>

                  {/* Add to Cart */}
                  <button
                    type="button"
                    onClick={() => addToCart(p.id)}
                    className={`mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-xs font-bold tracking-[0.16em] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F] ${
                      isAdded
                        ? "bg-[#78D94F] text-[#17171B]"
                        : "bg-[#17171B] text-white hover:bg-[#78D94F] hover:text-[#17171B]"
                    }`}
                  >
                    {isAdded ? "ADDED ✓" : "ADD TO CART +"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {list.length === 0 && (
          <p className="py-16 text-center text-sm text-gray-500">
            No products in this filter yet.
          </p>
        )}
      </div>
    </section>
  );
}