"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Inter, Syne } from "next/font/google";
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Star,
  Trash2,
  X,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingImage from "@/components/LoadingImage";
import { addToStoreCart } from "@/lib/store";

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

type WishlistProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  image: string;
  rating: number;
};

const initialProducts: WishlistProduct[] = [
  {
    id: 1,
    name: "Astronaut Space Poster",
    category: "Posters",
    price: 499,
    oldPrice: 799,
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=700",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Abstract Modern Art",
    category: "Canvas Prints",
    price: 599,
    oldPrice: 899,
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=700",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Vintage Aesthetic Poster",
    category: "Posters",
    price: 399,
    oldPrice: 599,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Nature Landscape Print",
    category: "Canvas Prints",
    price: 549,
    oldPrice: 799,
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=700",
    rating: 4.8,
  },
];

const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";
const revealCls =
  "translate-y-8 opacity-0 transition-all duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none data-[in=1]:translate-y-0 data-[in=1]:opacity-100";

export default function WishlistPage() {
  const [products, setProducts] = useState(initialProducts);
  const [cartMessage, setCartMessage] = useState("");
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
      { threshold: 0.1 }
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [products.length]);

  const removeProduct = (id: number) => {
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  const addToCart = (product: WishlistProduct) => {
    addToStoreCart(product, 1);
    setCartMessage(`${product.name} added to your cart.`);
  };

  return (
    <>
      <Header wishlistCount={products.length} />

      <main
        ref={pageRef}
        className={`${syne.variable} ${inter.variable} min-h-screen bg-[#F7F8F5] font-[family-name:var(--font-inter)]`}
      >
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-5 py-12 text-center md:py-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hero-banners/wishlist-hero.jpg"
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
              data-reveal
              style={{ transitionDelay: "80ms" }}
              className={`${revealCls} flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#78D94F]`}
            >
              <span className="h-0.5 w-8 bg-[#78D94F]" />
              Your Favourites
              <span className="h-0.5 w-8 bg-[#78D94F]" />
            </p>

            <h1
              data-reveal
              style={{ transitionDelay: "160ms" }}
              className={`${revealCls} ${head} mt-4 text-4xl font-extrabold uppercase leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl`}
            >
              My <span className="text-[#78D94F]">Wishlist</span>
            </h1>

            <p
              data-reveal
              style={{ transitionDelay: "240ms" }}
              className={`${revealCls} mx-auto mt-5 max-w-xl leading-7 text-gray-400`}
            >
              Keep the designs you love in one place and come back to them
              whenever you are ready.
            </p>
          </div>
        </section>

        {/* ================= SAVED PRODUCTS ================= */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2
                className={`${head} m-0 text-2xl font-extrabold text-[#17171B] sm:text-3xl`}
              >
                Saved Products
              </h2>
              <p className="m-0 mt-1 text-sm text-gray-500">
                {products.length} {products.length === 1 ? "item" : "items"} saved
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {products.length > 0 && (
                <button
                  type="button"
                  onClick={() => setProducts([])}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 ${focus}`}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Clear All
                </button>
              )}

              <Link
                href="/shop"
                className={`group inline-flex items-center gap-2 rounded-full border border-[#17171B] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#17171B] no-underline transition hover:bg-[#17171B] hover:text-white ${focus}`}
              >
                Continue Shopping
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {cartMessage && (
            <div
              role="status"
              className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#78D94F]/40 bg-[#78D94F]/15 px-5 py-4 text-sm font-medium text-[#17171B]"
            >
              <span>{cartMessage}</span>
              <button
                type="button"
                onClick={() => setCartMessage("")}
                className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[#17171B] transition hover:bg-black/10"
                aria-label="Dismiss message"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product, index) => {
                const discount = Math.round(
                  ((product.oldPrice - product.price) / product.oldPrice) * 100
                );
                return (
                  <article
                    key={product.id}
                    data-reveal
                    style={{
                      transitionDelay: `${Math.min(index, 3) * 70}ms`,
                    }}
                    className={`${revealCls} group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-1 hover:border-[#78D94F] hover:shadow-[0_10px_30px_rgba(120,217,79,0.15)]`}
                  >
                    <div className="relative h-72 overflow-hidden bg-gray-100">
                      <Link
                        href={`/products/${product.id}`}
                        className="block h-full w-full"
                      >
                        <LoadingImage
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </Link>

                      <span className="absolute left-4 top-4 rounded-full bg-[#17171B] px-3 py-1 text-[11px] font-bold text-[#78D94F]">
                        {discount}% OFF
                      </span>

                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        aria-label={`Remove ${product.name} from wishlist`}
                        className={`absolute right-4 top-4 grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 bg-white text-red-500 shadow transition hover:bg-red-500 hover:text-white ${focus}`}
                      >
                        <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="p-6">
                      <p className="m-0 text-xs font-bold uppercase tracking-[0.14em] text-green-700">
                        {product.category}
                      </p>

                      <Link
                        href={`/products/${product.id}`}
                        className="no-underline"
                      >
                        <h3
                          className={`${head} m-0 mt-2 text-lg font-extrabold text-[#17171B] transition hover:text-green-700`}
                        >
                          {product.name}
                        </h3>
                      </Link>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`${head} text-lg font-extrabold text-[#17171B]`}>
                            ₹{product.price}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            ₹{product.oldPrice}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500">
                          <Star
                            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                            aria-hidden="true"
                          />
                          {product.rating}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className={`mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-[#17171B] px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#78D94F] hover:text-[#17171B] ${focus}`}
                      >
                        <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                        Add to Cart
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-[0_6px_20px_rgba(0,0,0,0.03)]">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#78D94F]/15 text-[#17171B]">
                <Heart className="h-8 w-8" strokeWidth={1.6} aria-hidden="true" />
              </div>
              <h2
                className={`${head} m-0 mt-6 text-2xl font-extrabold text-[#17171B]`}
              >
                Your wishlist is empty
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                You have not saved any products yet. Explore our collections and
                save the designs you love.
              </p>
              <Link
                href="/shop"
                className={`group mt-7 inline-flex items-center gap-2 rounded-full bg-[#78D94F] px-8 py-4 text-sm font-bold text-[#17171B] no-underline transition hover:bg-[#17171B] hover:text-white ${focus}`}
              >
                EXPLORE PRODUCTS
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
