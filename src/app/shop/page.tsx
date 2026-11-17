"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
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

const products = [
  {
    id: 1,
    name: "Astronaut Space Poster",
    category: "Posters",
    price: 499,
    oldPrice: 799,
    rating: 4.8,
    reviews: 124,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=700&q=85",
  },
  {
    id: 2,
    name: "Abstract Modern Art",
    category: "Canvas Prints",
    price: 599,
    oldPrice: 899,
    rating: 4.7,
    reviews: 89,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=700&q=85",
  },
  {
    id: 3,
    name: "Vintage Aesthetic Poster",
    category: "Posters",
    price: 399,
    oldPrice: 599,
    rating: 4.9,
    reviews: 156,
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700&q=85",
  },
  {
    id: 4,
    name: "Nature Landscape Print",
    category: "Canvas Prints",
    price: 549,
    oldPrice: 799,
    rating: 4.8,
    reviews: 72,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=700&q=85",
  },
  {
    id: 5,
    name: "Minimalist Wall Art",
    category: "Metal Posters",
    price: 699,
    oldPrice: 999,
    rating: 4.6,
    reviews: 64,
    badge: "",
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=700&q=85",
  },
  {
    id: 6,
    name: "Creative Art Print",
    category: "Posters",
    price: 449,
    oldPrice: 699,
    rating: 4.9,
    reviews: 108,
    badge: "TRENDING",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=700&q=85",
  },
  {
    id: 7,
    name: "Modern Room Decor",
    category: "Tapestries",
    price: 799,
    oldPrice: 1199,
    rating: 4.7,
    reviews: 52,
    badge: "",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=700&q=85",
  },
  {
    id: 8,
    name: "Colorful Abstract Art",
    category: "Stickers",
    price: 299,
    oldPrice: 499,
    rating: 4.8,
    reviews: 93,
    badge: "SALE",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=700&q=85",
  },
];

const categories = [
  "All Products",
  "Posters",
  "Canvas Prints",
  "Metal Posters",
  "Tapestries",
  "Stickers",
];

/* URL slug -> category name (matches the links used on the home page) */
const slugToCategory: Record<string, string> = {
  posters: "Posters",
  "canvas-prints": "Canvas Prints",
  "metal-posters": "Metal Posters",
  tapestries: "Tapestries",
  stickers: "Stickers",
};

const MIN_PRICE = 300;
const MAX_PRICE = 1500;

const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

export default function ShopPage() {
  const [category, setCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [justAdded, setJustAdded] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [fade, setFade] = useState(false);
  const addTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Read ?category= and ?q= (used by the header search and category links) */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    const q = params.get("q");
    if (cat && slugToCategory[cat]) setCategory(slugToCategory[cat]);
    if (q) setSearch(q);
    setReady(true);
  }, []);

  /* Brief fade when results change */
  useEffect(() => {
    if (!ready) return;
    setFade(true);
    const t = setTimeout(() => setFade(false), 180);
    return () => clearTimeout(t);
  }, [category, search, sort, maxPrice, ready]);

  /* Lock scroll while the mobile filter sheet is open; Esc closes it */
  useEffect(() => {
    document.body.style.overflow = filtersOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFiltersOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [filtersOpen]);

  useEffect(
    () => () => {
      if (addTimer.current) clearTimeout(addTimer.current);
    },
    []
  );

  const filteredProducts = useMemo(() => {
    let result = products.filter(
      (p) =>
        (category === "All Products" || p.category === category) &&
        p.name.toLowerCase().includes(search.trim().toLowerCase()) &&
        p.price <= maxPrice
    );
    if (sort === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    else if (sort === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    else if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [category, search, sort, maxPrice]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { "All Products": products.length };
    products.forEach((p) => (c[p.category] = (c[p.category] ?? 0) + 1));
    return c;
  }, []);

  const activeCount =
    (category !== "All Products" ? 1 : 0) +
    (maxPrice < MAX_PRICE ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const resetAll = () => {
    setCategory("All Products");
    setMaxPrice(MAX_PRICE);
    setSearch("");
    setSort("featured");
  };

  const toggleWishlist = (id: number) =>
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));

  const addToCart = (id: number) => {
    setCart((c) => [...c, id]); /* TODO: connect to your real cart */
    setJustAdded(id);
    if (addTimer.current) clearTimeout(addTimer.current);
    addTimer.current = setTimeout(() => setJustAdded(null), 1600);
  };

  /* Filter panel: rendered in the desktop sidebar and the mobile sheet */
  const filterPanel = (
    <div>
      <div className="flex items-center justify-between">
        <h3 className={`${head} text-lg font-extrabold text-[#17171B]`}>Filters</h3>
        <button
          type="button"
          onClick={resetAll}
          className={`cursor-pointer border-0 bg-transparent text-xs font-semibold text-green-700 hover:underline ${focus}`}
        >
          Reset
        </button>
      </div>

      <div className="mt-7">
        <h4 className="text-sm font-bold text-[#17171B]">Categories</h4>
        <div className="mt-3 space-y-1">
          {categories.map((item) => {
            const on = category === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={on}
                className={`group flex w-full cursor-pointer items-center justify-between rounded-xl border-0 px-3 py-2.5 text-left text-sm transition duration-300 ${focus} ${
                  on
                    ? "bg-[#17171B] font-bold text-white"
                    : "bg-transparent text-gray-600 hover:bg-[#F7F8F5] hover:text-[#17171B]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`h-1.5 rounded-full bg-[#78D94F] transition-all duration-300 ${
                      on ? "w-4" : "w-0"
                    }`}
                  />
                  {item}
                </span>
                <span
                  className={`text-xs ${on ? "text-[#78D94F]" : "text-gray-400"}`}
                >
                  {counts[item] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="my-6 h-px bg-gray-100" />

      <div>
        <h4 className="text-sm font-bold text-[#17171B]">Maximum Price</h4>
        <p className={`${head} mt-3 text-2xl font-extrabold text-[#17171B]`}>
          ₹{maxPrice.toLocaleString("en-IN")}
        </p>
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Maximum price"
          className="mt-4 w-full cursor-pointer accent-[#78D94F]"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>₹{MIN_PRICE}</span>
          <span>₹{MAX_PRICE.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />

      <main
        className={`${syne.variable} ${inter.variable} min-h-screen bg-white font-[family-name:var(--font-inter)]`}
      >
        {/* ================= SHOP HERO ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_left,black,transparent_75%)]" />
          <span
            aria-hidden="true"
            className={`${head} pointer-events-none absolute -right-4 bottom-0 select-none text-[clamp(100px,20vw,300px)] font-extrabold leading-[0.8] text-white/[0.03]`}
          >
            SHOP
          </span>

          <div className="relative mx-auto max-w-7xl">
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-gray-400"
            >
              <Link
                href="/"
                className={`text-gray-400 no-underline transition hover:text-[#78D94F] ${focus}`}
              >
                HOME
              </Link>
              <span>/</span>
              <span className="text-white">SHOP</span>
            </nav>

            <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#78D94F]">
              <span className="h-0.5 w-10 bg-[#78D94F]" />
              Discover Your Style
            </p>

            <h1
              className={`${head} text-4xl font-extrabold uppercase leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl`}
            >
              Explore Our <span className="text-[#78D94F]">Store.</span>
            </h1>

            <p className="mt-5 max-w-xl leading-7 text-gray-400">
              Discover creative posters, canvas prints, wall art, and
              personalized designs for every space.
            </p>

            <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold text-gray-300">
              {["Unique Designs", "Creative Collections", "Custom Prints"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 transition duration-300 hover:border-[#78D94F]/60 hover:text-white"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        {/* ================= PRODUCTS ================= */}
        <section className="px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
          <div className="mx-auto max-w-7xl">
            {/* Heading + search */}
            <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-green-700">
                  <span className="h-0.5 w-8 bg-[#78D94F]" />
                  Our Products
                </span>
                <h2
                  className={`${head} mt-2 text-3xl font-extrabold text-[#17171B] sm:text-4xl`}
                >
                  {category}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Discover products that match your style.
                </p>
              </div>

              <div className="relative w-full lg:max-w-sm">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="h-12 w-full rounded-full border border-gray-200 bg-white pl-12 pr-5 text-sm text-[#17171B] outline-none transition placeholder:text-gray-400 focus:border-[#78D94F] focus:ring-2 focus:ring-[#78D94F]/25"
                />
              </div>
            </div>

            <div className="grid gap-9 lg:grid-cols-[250px_1fr]">
              {/* Desktop sidebar */}
              <aside className="hidden h-fit rounded-2xl border border-gray-200 bg-white p-6 lg:sticky lg:top-28 lg:block">
                {filterPanel}
              </aside>

              <div>
                {/* Toolbar */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFiltersOpen(true)}
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold tracking-[0.14em] text-[#17171B] transition hover:border-[#17171B] lg:hidden ${focus}`}
                    >
                      FILTERS
                      {activeCount > 0 && (
                        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#78D94F] px-1 text-[10px] font-extrabold">
                          {activeCount}
                        </span>
                      )}
                    </button>

                    <p className="m-0 text-sm text-gray-500">
                      Showing{" "}
                      <span className="font-bold text-[#17171B]">
                        {filteredProducts.length}
                      </span>{" "}
                      {filteredProducts.length === 1 ? "product" : "products"}
                    </p>
                  </div>

                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="Sort products"
                    className="h-11 cursor-pointer rounded-full border border-gray-200 bg-white px-5 text-sm text-[#17171B] outline-none transition focus:border-[#78D94F]"
                  >
                    <option value="featured">Sort: Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                {/* Active filter chips */}
                {activeCount > 0 && (
                  <div className="mb-6 flex flex-wrap items-center gap-2">
                    {category !== "All Products" && (
                      <button
                        type="button"
                        onClick={() => setCategory("All Products")}
                        className={`group inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#78D94F]/50 bg-[#78D94F]/10 px-4 py-1.5 text-xs font-semibold text-[#17171B] transition hover:bg-[#78D94F] ${focus}`}
                      >
                        {category}
                        <span aria-hidden="true">✕</span>
                        <span className="sr-only">Remove category filter</span>
                      </button>
                    )}
                    {maxPrice < MAX_PRICE && (
                      <button
                        type="button"
                        onClick={() => setMaxPrice(MAX_PRICE)}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#78D94F]/50 bg-[#78D94F]/10 px-4 py-1.5 text-xs font-semibold text-[#17171B] transition hover:bg-[#78D94F] ${focus}`}
                      >
                        Up to ₹{maxPrice.toLocaleString("en-IN")}
                        <span aria-hidden="true">✕</span>
                        <span className="sr-only">Remove price filter</span>
                      </button>
                    )}
                    {search.trim() && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#78D94F]/50 bg-[#78D94F]/10 px-4 py-1.5 text-xs font-semibold text-[#17171B] transition hover:bg-[#78D94F] ${focus}`}
                      >
                        “{search.trim()}”
                        <span aria-hidden="true">✕</span>
                        <span className="sr-only">Clear search</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={resetAll}
                      className="cursor-pointer border-0 bg-transparent px-2 text-xs font-semibold text-gray-500 underline underline-offset-4 hover:text-[#17171B]"
                    >
                      Clear all
                    </button>
                  </div>
                )}

                {/* Product grid */}
                <div
                  className={`grid grid-cols-1 gap-x-5 gap-y-9 transition-opacity duration-200 sm:grid-cols-2 xl:grid-cols-3 ${
                    fade ? "opacity-40" : "opacity-100"
                  }`}
                >
                  {filteredProducts.map((product, i) => {
                    const liked = wishlist.includes(product.id);
                    const added = justAdded === product.id;
                    const off = Math.round((1 - product.price / product.oldPrice) * 100);
                    return (
                      <article
                        key={product.id}
                        style={{ transitionDelay: ready ? `${Math.min(i, 8) * 60}ms` : "0ms" }}
                        className={`group transition-all duration-700 ${
                          ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                        }`}
                      >
                        {/* Image */}
                        <div className="relative overflow-hidden rounded-2xl bg-[#F5F5F5] shadow-[0_6px_20px_rgba(0,0,0,0.05)] transition-shadow duration-300 group-hover:shadow-[0_24px_48px_rgba(0,0,0,0.14)]">
                          <Link
                            href={`/products/${product.id}`}
                            aria-label={product.name}
                            className={`block ${focus}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={product.image}
                              alt={product.name}
                              loading="lazy"
                              className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                            />
                          </Link>

                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                          {product.badge && (
                            <span className="absolute left-4 top-4 rounded-full bg-[#78D94F] px-3 py-1.5 text-[10px] font-extrabold tracking-wider text-[#17171B]">
                              {product.badge}
                            </span>
                          )}

                          <span className="absolute bottom-4 left-4 rounded-full bg-[#17171B] px-3 py-1.5 text-xs font-bold text-white transition-opacity duration-300 lg:group-hover:opacity-0">
                            {off}% OFF
                          </span>

                          {/* Wishlist */}
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product.id)}
                            aria-label={`${liked ? "Remove" : "Add"} ${product.name} ${liked ? "from" : "to"} wishlist`}
                            aria-pressed={liked}
                            className={`absolute right-4 top-4 grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 shadow-md transition duration-300 hover:scale-110 ${focus} ${
                              liked
                                ? "bg-[#78D94F] text-[#17171B]"
                                : "bg-white text-[#17171B]"
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

                          {/* Add to cart: always visible on touch, slides up on desktop hover */}
                          <button
                            type="button"
                            onClick={() => addToCart(product.id)}
                            className={`absolute inset-x-4 bottom-4 cursor-pointer rounded-full border-0 py-3 text-xs font-bold tracking-[0.14em] shadow-lg transition-all duration-300 lg:translate-y-4 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:focus-visible:translate-y-0 lg:focus-visible:opacity-100 ${focus} ${
                              added
                                ? "bg-[#78D94F] text-[#17171B]"
                                : "bg-[#17171B] text-white hover:bg-[#78D94F] hover:text-[#17171B]"
                            } max-lg:hidden`}
                          >
                            {added ? "ADDED ✓" : "ADD TO CART +"}
                          </button>
                        </div>

                        {/* Details */}
                        <div className="mt-5">
                          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                            {product.category}
                          </p>

                          <Link
                            href={`/products/${product.id}`}
                            className={`${head} mt-2 block text-base font-bold leading-snug text-[#17171B] no-underline transition-colors duration-300 hover:text-green-700 ${focus}`}
                          >
                            {product.name}
                          </Link>

                          <div className="mt-2 flex items-center gap-2 text-xs">
                            <span
                              className="relative inline-block leading-none tracking-tight text-gray-200"
                              aria-label={`Rated ${product.rating} out of 5`}
                            >
                              ★★★★★
                              <span
                                className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-yellow-400"
                                style={{ width: `${(product.rating / 5) * 100}%` }}
                              >
                                ★★★★★
                              </span>
                            </span>
                            <span className="text-gray-500">
                              {product.rating} ({product.reviews} reviews)
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className={`${head} text-xl font-extrabold text-[#17171B]`}>
                              ₹{product.price}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              ₹{product.oldPrice}
                            </span>
                            <span className="rounded bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-700">
                              Save ₹{product.oldPrice - product.price}
                            </span>
                          </div>

                          {/* Mobile add to cart */}
                          <button
                            type="button"
                            onClick={() => addToCart(product.id)}
                            className={`mt-4 w-full cursor-pointer rounded-full border-0 py-3 text-xs font-bold tracking-[0.14em] transition duration-300 lg:hidden ${focus} ${
                              added
                                ? "bg-[#78D94F] text-[#17171B]"
                                : "bg-[#17171B] text-white"
                            }`}
                          >
                            {added ? "ADDED ✓" : "ADD TO CART +"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Empty state */}
                {filteredProducts.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-gray-300 bg-[#F7F8F5] px-6 py-20 text-center">
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#78D94F]/20 text-[#17171B]">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                      </svg>
                    </span>
                    <h3 className={`${head} mt-5 text-xl font-bold text-[#17171B]`}>
                      No products found
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Try another search or adjust your filters.
                    </p>
                    <button
                      type="button"
                      onClick={resetAll}
                      className={`mt-6 cursor-pointer rounded-full border-0 bg-[#78D94F] px-6 py-3 text-xs font-bold tracking-[0.14em] text-[#17171B] transition hover:bg-[#17171B] hover:text-white ${focus}`}
                    >
                      CLEAR FILTERS
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* ================= MOBILE FILTER SHEET ================= */}
      <div
        onClick={() => setFiltersOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-[3px] transition-all duration-300 lg:hidden ${
          filtersOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-label="Filters"
        aria-modal="true"
        className={`${syne.variable} ${inter.variable} fixed inset-x-0 bottom-0 z-[70] max-h-[85svh] overflow-y-auto rounded-t-3xl bg-white p-6 font-[family-name:var(--font-inter)] shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] lg:hidden ${
          filtersOpen ? "visible translate-y-0" : "invisible translate-y-full"
        }`}
      >
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-200" />
        {filterPanel}
        <button
          type="button"
          onClick={() => setFiltersOpen(false)}
          className={`mt-7 w-full cursor-pointer rounded-full border-0 bg-[#17171B] py-4 text-xs font-bold tracking-[0.14em] text-white transition hover:bg-[#78D94F] hover:text-[#17171B] ${focus}`}
        >
          SHOW {filteredProducts.length} PRODUCT{filteredProducts.length === 1 ? "" : "S"}
        </button>
      </div>

      {/* Cart feedback (bottom-left so it doesn't cover the back-to-top button) */}
      <div
        role="status"
        aria-live="polite"
        className={`${inter.variable} fixed bottom-5 left-5 z-50 flex items-center gap-4 rounded-2xl bg-[#17171B] px-5 py-4 font-[family-name:var(--font-inter)] text-sm font-semibold text-white shadow-2xl transition-all duration-300 ${
          cart.length > 0
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#78D94F] text-[#17171B]">
          ✓
        </span>
        {cart.length} item{cart.length === 1 ? "" : "s"} added to demo cart
        <button
          type="button"
          onClick={() => setCart([])}
          className="cursor-pointer border-0 bg-transparent text-[#78D94F] hover:underline"
        >
          Dismiss
        </button>
      </div>
    </>
  );
}