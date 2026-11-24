"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Inter, Montserrat } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
    name: "Football Stadium Legends Metal Poster (A3)",
    category: "Metal Posters",
    collection: "Football",
    price: 699,
    oldPrice: 999,
    rating: 4.9,
    reviews: 142,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=85",
  },
  {
    id: 2,
    name: "F1 Circuit Telemetry XXL Desk Pad",
    category: "Desk Pad",
    collection: "Cars, Bike & F1",
    price: 899,
    oldPrice: 1299,
    rating: 4.8,
    reviews: 98,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=700&q=85",
  },
  {
    id: 3,
    name: "Autographed Football Signed Jersey Frame",
    category: "Signed Jersey Frame",
    collection: "Football",
    price: 1499,
    oldPrice: 1999,
    rating: 4.9,
    reviews: 164,
    badge: "POPULAR",
    image: "/products/signed-jersey-frame.jpg",
  },
  {
    id: 4,
    name: "Marvel & DC Superhero Metal Poster (A2)",
    category: "Metal Posters",
    collection: "Movie, Series & Characters (DC, Marvel)",
    price: 999,
    oldPrice: 1399,
    rating: 4.8,
    reviews: 112,
    badge: "TRENDING",
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=700&q=85",
  },
  {
    id: 5,
    name: "Anime Shonen Neon Metal Poster (A4)",
    category: "Metal Posters",
    collection: "Anime",
    price: 499,
    oldPrice: 799,
    rating: 4.9,
    reviews: 136,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=700&q=85",
  },
  {
    id: 6,
    name: "Pro Gaming & Characters Micro-Weave Desk Pad",
    category: "Desk Pad",
    collection: "Games and Characters",
    price: 949,
    oldPrice: 1349,
    rating: 4.8,
    reviews: 108,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700&q=85",
  },
  {
    id: 7,
    name: "World Cricket Icon Signed Jersey Frame",
    category: "Signed Jersey Frame",
    collection: "Cricket",
    price: 1499,
    oldPrice: 2199,
    rating: 4.9,
    reviews: 84,
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=700&q=85",
  },
  {
    id: 8,
    name: "Gym & Motivation Mindset Metal Poster (A3)",
    category: "Metal Posters",
    collection: "Gym and Motivation",
    price: 649,
    oldPrice: 949,
    rating: 4.8,
    reviews: 93,
    badge: "SALE",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&q=85",
  },
  {
    id: 9,
    name: "Lady Boss Executive Statement Metal Poster (A3)",
    category: "Metal Posters",
    collection: "Lady Boss",
    price: 699,
    oldPrice: 999,
    rating: 4.9,
    reviews: 78,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=85",
  },
  {
    id: 10,
    name: "Championship Cricket Victory Metal Poster (A2)",
    category: "Metal Posters",
    collection: "Cricket",
    price: 899,
    oldPrice: 1299,
    rating: 4.8,
    reviews: 65,
    badge: "TRENDING",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=700&q=85",
  },
  {
    id: 11,
    name: "Superhero Multiverse Gaming Desk Pad",
    category: "Desk Pad",
    collection: "Movie, Series & Characters (DC, Marvel)",
    price: 899,
    oldPrice: 1249,
    rating: 4.7,
    reviews: 59,
    badge: "",
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=700&q=85",
  },
  {
    id: 12,
    name: "Anime Cyberpunk Wide Desk Pad",
    category: "Desk Pad",
    collection: "Anime",
    price: 849,
    oldPrice: 1199,
    rating: 4.9,
    reviews: 118,
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=700&q=85",
  },
  {
    id: 13,
    name: "Supercar GT Carbon Metal Poster (A2)",
    category: "Metal Posters",
    collection: "Cars, Bike & F1",
    price: 949,
    oldPrice: 1349,
    rating: 4.9,
    reviews: 104,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=700&q=85",
  },
  {
    id: 14,
    name: "Next-Gen Open World Character Metal Poster (A3)",
    category: "Metal Posters",
    collection: "Games and Characters",
    price: 699,
    oldPrice: 999,
    rating: 4.8,
    reviews: 87,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=700&q=85",
  },
  {
    id: 15,
    name: "Lady Boss Workspace Edition Desk Pad",
    category: "Desk Pad",
    collection: "Lady Boss",
    price: 849,
    oldPrice: 1199,
    rating: 4.8,
    reviews: 62,
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=85",
  },
  {
    id: 16,
    name: "Relentless Hustle Gym Metal Poster (A2)",
    category: "Metal Posters",
    collection: "Gym and Motivation",
    price: 899,
    oldPrice: 1299,
    rating: 4.9,
    reviews: 115,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=700&q=85",
  },
];

const categories = [
  "All Products",
  "Metal Posters",
  "Desk Pad",
  "Signed Jersey Frame",
];

const collectionsList = [
  "All Collections",
  "Football",
  "Cricket",
  "Movie, Series & Characters (DC, Marvel)",
  "Anime",
  "Cars, Bike & F1",
  "Games and Characters",
  "Lady Boss",
  "Gym and Motivation",
];

/* URL slug -> category name (matches the links used on the home page) */
const slugToCategory: Record<string, string> = {
  "metal-posters": "Metal Posters",
  "desk-pad": "Desk Pad",
  "signed-jersey-frame": "Signed Jersey Frame",
};

function resolveCollectionParam(raw: string | null): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().toLowerCase();
  const direct = collectionsList.find(
    (c) => c !== "All Collections" && c.toLowerCase() === cleaned
  );
  if (direct) return direct;

  const slugMap: Record<string, string> = {
    football: "Football",
    cricket: "Cricket",
    "movie-series-characters": "Movie, Series & Characters (DC, Marvel)",
    "movie, series & characters (dc,marvel)": "Movie, Series & Characters (DC, Marvel)",
    "movie, series & characters (dc, marvel)": "Movie, Series & Characters (DC, Marvel)",
    anime: "Anime",
    "cars-bike-f1": "Cars, Bike & F1",
    "cars, bike & f1": "Cars, Bike & F1",
    "games-and-characters": "Games and Characters",
    "games and characters": "Games and Characters",
    "games and characters -30": "Games and Characters",
    "lady-boss": "Lady Boss",
    "lady boss": "Lady Boss",
    "gym-and-motivation": "Gym and Motivation",
    "gym and motivation": "Gym and Motivation",
  };
  return slugMap[cleaned] ?? null;
}

const MIN_PRICE = 300;
const MAX_PRICE = 2000;

const head = `${montserrat.className} font-[family-name:var(--font-montserrat)]`;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

export default function ShopPage() {
  const [category, setCategory] = useState("All Products");
  const [collection, setCollection] = useState("All Collections");
  const [sizeFilter, setSizeFilter] = useState("All");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const wishlist = useStoreWishlist();
  const [cart, setCart] = useState<number[]>([]);
  const [justAdded, setJustAdded] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [fade, setFade] = useState(false);
  const addTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Read ?category=, ?collection=, and ?q= (used by header search, category links, and collection links) */
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      const col = params.get("collection");
      const q = params.get("q");

      if (cat) {
        if (slugToCategory[cat]) {
          setCategory(slugToCategory[cat]);
        } else {
          const matchedCategory = categories.find(
            (c) => c.toLowerCase() === cat.trim().toLowerCase()
          );
          const matchedColFromCat = resolveCollectionParam(cat);
          if (matchedCategory) setCategory(matchedCategory);
          else if (matchedColFromCat) setCollection(matchedColFromCat);
        }
      }

      const matchedCollection = resolveCollectionParam(col);
      if (matchedCollection) {
        setCollection(matchedCollection);
      }

      if (q) setSearch(q);
      setReady(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Brief fade when results change */
  useEffect(() => {
    if (!ready) return;
    const raf = requestAnimationFrame(() => setFade(true));
    const t = setTimeout(() => setFade(false), 180);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [category, collection, search, sort, maxPrice, ready]);

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
    let result = products.filter((p) => {
      const matchSize =
        sizeFilter === "All"
          ? true
          : sizeFilter === "XXL"
            ? p.category === "Desk Pad"
            : sizeFilter === "Frame"
              ? p.category === "Signed Jersey Frame"
              : p.name.includes(`(${sizeFilter})`);
      return (
        (category === "All Products" || p.category === category) &&
        (collection === "All Collections" || p.collection === collection) &&
        matchSize &&
        (p.name.toLowerCase().includes(search.trim().toLowerCase()) ||
          p.collection.toLowerCase().includes(search.trim().toLowerCase())) &&
        p.price <= maxPrice
      );
    });
    if (sort === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    else if (sort === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    else if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [category, collection, sizeFilter, search, sort, maxPrice]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { "All Products": products.length };
    products.forEach((p) => (c[p.category] = (c[p.category] ?? 0) + 1));
    return c;
  }, []);

  const collectionCounts = useMemo(() => {
    const c: Record<string, number> = { "All Collections": products.length };
    products.forEach((p) => (c[p.collection] = (c[p.collection] ?? 0) + 1));
    return c;
  }, []);

  const activeCount =
    (category !== "All Products" ? 1 : 0) +
    (collection !== "All Collections" ? 1 : 0) +
    (sizeFilter !== "All" ? 1 : 0) +
    (maxPrice < MAX_PRICE ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const resetAll = () => {
    setCategory("All Products");
    setCollection("All Collections");
    setSizeFilter("All");
    setMaxPrice(MAX_PRICE);
    setSearch("");
    setSort("featured");
  };

  const toggleWishlist = (id: number) => toggleStoreWishlist(id);

  const addToCart = (id: number) => {
    const p = products.find((item) => item.id === id);
    if (p) {
      addToStoreCart(p, 1);
    }
    setCart((c) => [...c, id]);
    setJustAdded(id);
    if (addTimer.current) clearTimeout(addTimer.current);
    addTimer.current = setTimeout(() => setJustAdded(null), 1600);
  };

  /* Filter panel: rendered in the desktop sidebar and the mobile sheet */
  const filterPanel = (
    <div>
      <div className="flex items-center justify-between">
        <h3 className={`${head} text-lg font-semibold text-[#17171B]`}>Filters</h3>
        <button
          type="button"
          onClick={resetAll}
          className={`cursor-pointer border-0 bg-transparent text-xs font-semibold text-green-700 hover:underline ${focus}`}
        >
          Reset
        </button>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-[#17171B]">Size</h4>
          <button
            type="button"
            onClick={() => setSizeGuideOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50/70 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 transition hover:border-[#78D94F] hover:bg-[#78D94F] hover:text-[#17171B]"
          >
            Size Chart ↗
          </button>
        </div>

        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          {[
            { value: "All", label: "All", sub: "16" },
            { value: "A4", label: "A4", sub: "8×12″" },
            { value: "A3", label: "A3", sub: "12×17″" },
            { value: "A2", label: "A2", sub: "17×23″" },
            { value: "XXL", label: "XXL", sub: "Pad" },
            { value: "Frame", label: "Frame", sub: "32×24″" },
          ].map((s) => {
            const on = sizeFilter === s.value;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => setSizeFilter(s.value)}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border px-1.5 py-1.5 text-center transition ${focus} ${
                  on
                    ? "border-[#17171B] bg-[#17171B] text-white shadow-sm"
                    : "border-gray-200 bg-[#F7F8F5]/70 text-[#17171B] hover:border-[#17171B]/40 hover:bg-white"
                }`}
              >
                <span className="text-[11px] font-semibold leading-tight">{s.label}</span>
                <span
                  className={`mt-0.5 text-[9px] font-normal leading-tight tabular-nums ${
                    on ? "text-[#78D94F]" : "text-gray-400"
                  }`}
                >
                  {s.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="my-4 h-px bg-gray-100" />

      <div>
        <h4 className="text-sm font-semibold text-[#17171B]">Categories</h4>
        <div className="mt-2 space-y-1">
          {categories.map((item) => {
            const on = category === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={on}
                className={`group flex w-full cursor-pointer items-center justify-between rounded-xl border-0 px-3 py-2 text-left text-sm transition duration-300 ${focus} ${on
                    ? "bg-[#17171B] font-semibold text-white"
                    : "bg-transparent text-gray-600 hover:bg-[#F7F8F5] hover:text-[#17171B]"
                  }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`h-1.5 rounded-full bg-[#78D94F] transition-all duration-300 ${on ? "w-4" : "w-0"
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

      <div className="my-4 h-px bg-gray-100" />

      <div>
        <h4 className="text-sm font-semibold text-[#17171B]">Collections</h4>
        <div className="mt-2 space-y-0.5">
          {collectionsList.map((item) => {
            const on = collection === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCollection(item)}
                aria-pressed={on}
                className={`group flex w-full cursor-pointer items-center justify-between rounded-xl border-0 px-3 py-1.5 text-left text-xs transition duration-300 ${focus} ${
                  on
                    ? "bg-[#17171B] font-semibold text-white"
                    : "bg-transparent text-gray-600 hover:bg-[#F7F8F5] hover:text-[#17171B]"
                }`}
              >
                <span className="flex items-center gap-2 truncate pr-2">
                  <span
                    className={`h-1.5 shrink-0 rounded-full bg-[#78D94F] transition-all duration-300 ${
                      on ? "w-3.5" : "w-0"
                    }`}
                  />
                  <span className="truncate">{item}</span>
                </span>
                <span
                  className={`shrink-0 text-xs ${
                    on ? "text-[#78D94F]" : "text-gray-400"
                  }`}
                >
                  {collectionCounts[item] ?? 0}
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
        className={`${montserrat.variable} ${inter.variable} min-h-screen bg-white font-[family-name:var(--font-inter)]`}
      >
        {/* ================= SHOP HERO ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hero-banners/shop-hero.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right opacity-85"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#17171B]/90 via-[#17171B]/55 to-[#17171B]/15" />
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_left,black,transparent_75%)]" />
          <span
            aria-hidden="true"
            className={`${head} pointer-events-none absolute -right-4 bottom-0 select-none text-[clamp(100px,20vw,300px)] font-extrabold leading-[0.8] text-white/[0.04]`}
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
              className={`${head} text-2xl font-semibold uppercase leading-[1.06] tracking-tight text-white sm:text-3xl lg:text-4xl`}
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
          <div className="mx-auto max-w-[1380px]">
            {/* Heading + search */}
            <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-green-700">
                  <span className="h-0.5 w-8 bg-[#78D94F]" />
                  Our Products
                </span>
                <h2
                  className={`${head} mt-2 text-2xl font-semibold text-[#17171B] sm:text-3xl`}
                >
                  {collection !== "All Collections"
                    ? `${collection} Collection`
                    : category}
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

            <div className="grid gap-7 lg:grid-cols-[230px_1fr]">
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

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSizeGuideOpen(true)}
                      className={`inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 text-xs font-semibold text-[#17171B] transition hover:border-[#78D94F] hover:bg-[#78D94F]/15 ${focus}`}
                    >
                      Size Chart ↗
                    </button>

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
                    {collection !== "All Collections" && (
                      <button
                        type="button"
                        onClick={() => setCollection("All Collections")}
                        className={`group inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#78D94F]/50 bg-[#78D94F]/10 px-4 py-1.5 text-xs font-semibold text-[#17171B] transition hover:bg-[#78D94F] ${focus}`}
                      >
                        Collection: {collection}
                        <span aria-hidden="true">✕</span>
                        <span className="sr-only">Remove collection filter</span>
                      </button>
                    )}
                    {sizeFilter !== "All" && (
                      <button
                        type="button"
                        onClick={() => setSizeFilter("All")}
                        className={`group inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#78D94F]/50 bg-[#78D94F]/10 px-4 py-1.5 text-xs font-semibold text-[#17171B] transition hover:bg-[#78D94F] ${focus}`}
                      >
                        Size: {sizeFilter}
                        <span aria-hidden="true">✕</span>
                        <span className="sr-only">Remove size filter</span>
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
                  className={`grid grid-cols-2 gap-x-3 gap-y-5 transition-opacity duration-200 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 xl:grid-cols-4 ${
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
                        className={`group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/75 bg-white p-2 shadow-[0_2px_14px_rgba(23,23,27,0.04)] transition-all duration-500 hover:-translate-y-1 hover:border-[#17171B]/20 hover:shadow-[0_18px_40px_-12px_rgba(23,23,27,0.12)] sm:rounded-3xl sm:p-3 ${
                          ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                        }`}
                      >
                        <div>
                          {/* Image */}
                          <div className="relative overflow-hidden rounded-xl bg-[#F3F4F1] sm:rounded-2xl">
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
                                className="aspect-[4/4.2] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                              />
                            </Link>

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            {product.badge && (
                              <span className="absolute left-2 top-2 rounded-full bg-[#78D94F] px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#17171B] shadow-sm sm:left-3.5 sm:top-3.5 sm:px-3 sm:py-1 sm:text-[10px]">
                                {product.badge}
                              </span>
                            )}

                            <span className="absolute bottom-2 left-2 rounded-full bg-[#17171B]/80 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm transition-opacity duration-300 sm:bottom-3.5 sm:left-3.5 sm:px-2.5 sm:py-1 sm:text-[11px] lg:group-hover:opacity-0">
                              {off}% OFF
                            </span>

                            {/* Wishlist */}
                            <button
                              type="button"
                              onClick={() => toggleWishlist(product.id)}
                              aria-label={`${liked ? "Remove" : "Add"} ${product.name} ${liked ? "from" : "to"} wishlist`}
                              aria-pressed={liked}
                              className={`absolute right-2 top-2 grid h-7 w-7 cursor-pointer place-items-center rounded-full border-0 shadow-md transition duration-300 hover:scale-110 sm:right-4 sm:top-4 sm:h-10 sm:w-10 ${focus} ${
                                liked
                                  ? "bg-[#78D94F] text-[#17171B]"
                                  : "bg-white/95 text-[#17171B]"
                              }`}
                            >
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill={liked ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                                className={`transition-transform duration-300 sm:h-5 sm:w-5 ${liked ? "scale-110" : ""}`}
                              >
                                <path d="M12 20.5s-7.5-4.6-9.6-9.4A5.4 5.4 0 0 1 12 6.2a5.4 5.4 0 0 1 9.6 4.9c-2.1 4.8-9.6 9.4-9.6 9.4z" />
                              </svg>
                            </button>

                            {/* Add to cart: slides up on desktop hover */}
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
                          <div className="mt-2.5 px-1 sm:mt-3.5 sm:px-1.5">
                            <p className="m-0 truncate text-[9px] font-medium uppercase tracking-[0.12em] text-gray-400 sm:text-[10px]">
                              {product.collection} · {product.category}
                            </p>

                            <Link
                              href={`/products/${product.id}`}
                              className={`${head} mt-1 line-clamp-2 block text-[13px] font-semibold leading-snug text-[#17171B] no-underline transition-colors duration-300 hover:text-emerald-700 sm:mt-1.5 sm:text-[15px] ${focus}`}
                            >
                              {product.name}
                            </Link>

                            <div className="mt-1 flex items-center gap-1.5 text-[10px] sm:mt-1.5 sm:gap-2 sm:text-xs">
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
                                {product.rating}{" "}
                                <span className="hidden sm:inline">
                                  ({product.reviews} reviews)
                                </span>
                                <span className="sm:hidden">({product.reviews})</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2.5 border-t border-gray-100 px-1 pt-2.5 sm:mt-3 sm:px-1.5 sm:pt-3">
                          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 sm:gap-x-2.5 sm:gap-y-1">
                            <span className="text-sm font-semibold tabular-nums text-[#17171B] sm:text-lg">
                              ₹{product.price}
                            </span>
                            <span className="text-[11px] text-gray-400 line-through sm:text-sm">
                              ₹{product.oldPrice}
                            </span>
                            <span className="ml-auto hidden rounded-full bg-[#78D94F]/15 px-2 py-0.5 text-[10px] font-medium text-emerald-800 sm:inline-block">
                              Save ₹{product.oldPrice - product.price}
                            </span>
                          </div>

                          {/* Mobile add to cart */}
                          <button
                            type="button"
                            onClick={() => addToCart(product.id)}
                            className={`mt-2 w-full cursor-pointer rounded-full border-0 py-2 text-[10px] font-semibold tracking-[0.08em] transition duration-300 sm:mt-3 sm:py-2.5 sm:text-xs lg:hidden ${focus} ${
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
                    <h3 className={`${head} mt-5 text-xl font-semibold text-[#17171B]`}>
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
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-[3px] transition-all duration-300 lg:hidden ${filtersOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
      />
      <div
        role="dialog"
        aria-label="Filters"
        aria-modal="true"
        className={`${montserrat.variable} ${inter.variable} fixed inset-x-0 bottom-0 z-[70] max-h-[85svh] overflow-y-auto rounded-t-3xl bg-white p-6 font-[family-name:var(--font-inter)] shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] lg:hidden ${filtersOpen ? "visible translate-y-0" : "invisible translate-y-full"
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

      {/* Modern Size Chart Modal */}
      {sizeGuideOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Product Size Chart"
          className={`${montserrat.variable} ${inter.variable} fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4 font-[family-name:var(--font-inter)] backdrop-blur-sm`}
          onClick={() => setSizeGuideOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Epic Store Guide
                </p>
                <h3
                  className={`${head} m-0 mt-1 text-xl font-semibold text-[#17171B] sm:text-2xl`}
                >
                  Size Chart &amp; Dimensions
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                aria-label="Close size chart"
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-gray-200 bg-[#F7F8F5] text-sm font-semibold text-[#17171B] transition hover:bg-[#17171B] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Metal Posters Visual Scale */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h4 className={`${head} m-0 text-sm font-semibold uppercase tracking-wider text-[#17171B]`}>
                  Metal Posters
                </h4>
                <span className="text-xs text-gray-500">1.15mm Brushed Aluminum • Magnetic Mount</span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3">
                {[
                  {
                    code: "A4",
                    inches: "8.3 × 11.7 in",
                    cm: "21 × 29.7 cm",
                    fit: "Desk & Shelf",
                    boxCls: "h-12 w-9",
                  },
                  {
                    code: "A3",
                    inches: "11.7 × 16.5 in",
                    cm: "29.7 × 42 cm",
                    fit: "Bedroom & Studio",
                    boxCls: "h-16 w-12",
                  },
                  {
                    code: "A2",
                    inches: "16.5 × 23.4 in",
                    cm: "42 × 59.4 cm",
                    fit: "Statement Wall",
                    boxCls: "h-20 w-14",
                  },
                ].map((item) => (
                  <div
                    key={item.code}
                    className="flex flex-col items-center rounded-2xl border border-gray-200/80 bg-[#F7F8F5] p-3.5 text-center"
                  >
                    <div className="flex h-24 items-end justify-center">
                      <div
                        className={`${item.boxCls} grid place-items-center rounded-lg border-2 border-[#17171B] bg-white text-xs font-semibold text-[#17171B] shadow-sm`}
                      >
                        {item.code}
                      </div>
                    </div>
                    <p className="m-0 mt-3 text-xs font-semibold tabular-nums text-[#17171B]">
                      {item.inches}
                    </p>
                    <p className="m-0 mt-0.5 text-[11px] tabular-nums text-gray-500">
                      {item.cm}
                    </p>
                    <span className="mt-2 rounded-full bg-[#78D94F]/20 px-2.5 py-0.5 text-[10px] font-medium text-emerald-800">
                      {item.fit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Desk Pad & Signed Jersey Frame */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200/80 bg-[#F7F8F5] p-4">
                <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Desk Pad
                </p>
                <h4 className={`${head} m-0 mt-1 text-base font-semibold text-[#17171B]`}>
                  XXL Extended Mat
                </h4>
                <p className="m-0 mt-2 text-xs font-medium tabular-nums text-[#17171B]">
                  900 × 400 × 4 mm (35.4 × 15.7 in)
                </p>
                <p className="m-0 mt-1 text-xs text-gray-500">
                  Fits full-size keyboard + mouse with 4mm cushioned rubber base.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200/80 bg-[#F7F8F5] p-4">
                <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Signed Jersey Frame
                </p>
                <h4 className={`${head} m-0 mt-1 text-base font-semibold text-[#17171B]`}>
                  Collector Shadowbox
                </h4>
                <p className="m-0 mt-2 text-xs font-medium tabular-nums text-[#17171B]">
                  32 × 24 × 1.5 in (81 × 61 × 3.8 cm)
                </p>
                <p className="m-0 mt-1 text-xs text-gray-500">
                  Full-size hardwood display frame with UV-filtering acrylic glass.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart feedback (bottom-left so it doesn't cover the back-to-top button) */}
      <div
        role="status"
        aria-live="polite"
        className={`${montserrat.variable} ${inter.variable} fixed bottom-5 left-5 z-50 flex items-center gap-4 rounded-2xl bg-[#17171B] px-5 py-4 font-[family-name:var(--font-inter)] text-sm font-semibold text-white shadow-2xl transition-all duration-300 ${cart.length > 0
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
          }`}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#78D94F] text-[#17171B]">
          ✓
        </span>
        {cart.length} item{cart.length === 1 ? "" : "s"} added to cart
        <Link
          href="/cart"
          className="font-bold text-[#78D94F] no-underline hover:underline"
        >
          View Cart
        </Link>
        <button
          type="button"
          onClick={() => setCart([])}
          className="cursor-pointer border-0 bg-transparent text-gray-400 hover:text-white hover:underline"
        >
          Dismiss
        </button>
      </div>
    </>
  );
}