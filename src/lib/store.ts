"use client";

import { useSyncExternalStore } from "react";

export type StoreCartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  image: string;
  quantity: number;
};

const CART_KEY = "epic_store_cart_v1";
const WISHLIST_KEY = "epic_store_wishlist_v1";
const EVENT_NAME = "epic-store-sync";

const defaultCart: StoreCartItem[] = [];
const defaultWishlist: number[] = [];

let cachedCartRaw: string | null = null;
let cachedCart: StoreCartItem[] = defaultCart;

let cachedWishRaw: string | null = null;
let cachedWish: number[] = defaultWishlist;

function emitChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT_NAME));
  }
}

export function getStoreCart(): StoreCartItem[] {
  if (typeof window === "undefined") return defaultCart;
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw === cachedCartRaw) return cachedCart;
    cachedCartRaw = raw;
    if (!raw) {
      cachedCart = defaultCart;
      return cachedCart;
    }
    const parsed = JSON.parse(raw);
    cachedCart = Array.isArray(parsed) ? parsed : defaultCart;
    return cachedCart;
  } catch {
    return defaultCart;
  }
}

export function setStoreCart(next: StoreCartItem[]) {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(next);
    cachedCartRaw = raw;
    cachedCart = next;
    localStorage.setItem(CART_KEY, raw);
    emitChange();
  } catch {
    /* ignore storage errors */
  }
}

export function addToStoreCart(
  product: {
    id: number;
    name: string;
    category: string;
    price: number;
    oldPrice?: number;
    image: string;
  },
  qty = 1
) {
  const current = getStoreCart();
  const existing = current.find((item) => item.id === product.id);
  let next: StoreCartItem[];
  if (existing) {
    next = current.map((item) =>
      item.id === product.id
        ? { ...item, quantity: Math.min(10, item.quantity + qty) }
        : item
    );
  } else {
    next = [
      ...current,
      {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        oldPrice: product.oldPrice ?? Math.round(product.price * 1.35),
        image: product.image,
        quantity: Math.min(10, Math.max(1, qty)),
      },
    ];
  }
  setStoreCart(next);
}

export function updateStoreCartQuantity(id: number, quantity: number) {
  const current = getStoreCart();
  if (quantity <= 0) {
    setStoreCart(current.filter((item) => item.id !== id));
    return;
  }
  setStoreCart(
    current.map((item) =>
      item.id === id ? { ...item, quantity: Math.min(10, quantity) } : item
    )
  );
}

export function removeFromStoreCart(id: number) {
  const current = getStoreCart();
  setStoreCart(current.filter((item) => item.id !== id));
}

export function clearStoreCart() {
  setStoreCart([]);
}

export function getStoreWishlist(): number[] {
  if (typeof window === "undefined") return defaultWishlist;
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (raw === cachedWishRaw) return cachedWish;
    cachedWishRaw = raw;
    if (!raw) {
      cachedWish = defaultWishlist;
      return cachedWish;
    }
    const parsed = JSON.parse(raw);
    cachedWish = Array.isArray(parsed) ? parsed : defaultWishlist;
    return cachedWish;
  } catch {
    return defaultWishlist;
  }
}

export function toggleStoreWishlist(id: number) {
  if (typeof window === "undefined") return;
  const current = getStoreWishlist();
  const next = current.includes(id)
    ? current.filter((x) => x !== id)
    : [...current, id];
  try {
    const raw = JSON.stringify(next);
    cachedWishRaw = raw;
    cachedWish = next;
    localStorage.setItem(WISHLIST_KEY, raw);
    emitChange();
  } catch {
    /* ignore */
  }
}

function subscribeStore(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === CART_KEY || e.key === WISHLIST_KEY || e.key === null) {
      callback();
    }
  };
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", onStorage);
  };
}

const getServerCart = () => defaultCart;
const getServerWishlist = () => defaultWishlist;

export function useStoreCart(): StoreCartItem[] {
  return useSyncExternalStore(subscribeStore, getStoreCart, getServerCart);
}

export function useStoreWishlist(): number[] {
  return useSyncExternalStore(
    subscribeStore,
    getStoreWishlist,
    getServerWishlist
  );
}

