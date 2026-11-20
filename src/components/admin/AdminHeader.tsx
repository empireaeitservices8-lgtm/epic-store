"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  Store,
  Settings,
  User,
  ShoppingBag,
  AlertTriangle,
  MessageSquare,
  Star,
  CheckCheck,
  X,
} from "lucide-react";

type AdminHeaderProps = {
  onMenuClick?: () => void;
  search?: string;
  onSearchChange?: (value: string) => void;
};

type AdminNotification = {
  id: string;
  type: "order" | "stock" | "enquiry" | "review";
  title: string;
  subtitle: string;
  time: string;
  href: string;
};

const fallbackNotifications: AdminNotification[] = [
  {
    id: "order-EP20261119001",
    type: "order",
    title: "Order EP20261119001 • ₹1,098",
    subtitle: "Alex Johnson • Processing",
    time: "19 Nov 2026",
    href: "/admin/orders",
  },
  {
    id: "stock-3",
    type: "stock",
    title: "Out of Stock: Vintage Aesthetic Poster",
    subtitle: "SKU: EP-POST-003 • 0 in stock",
    time: "Inventory Alert",
    href: "/admin/products",
  },
  {
    id: "enq-1",
    type: "enquiry",
    title: "New Enquiry: Custom Canvas Print",
    subtitle: "Ananya Menon • Qty: 3",
    time: "19 Nov 2026",
    href: "/admin/enquiries",
  },
  {
    id: "rev-2",
    type: "review",
    title: "Pending Review (4★) • Abstract Modern Art",
    subtitle: "Priya Sharma • Awaiting approval",
    time: "18 Nov 2026",
    href: "/admin/reviews",
  },
];

const READ_STORAGE_KEY = "epic_admin_read_notifs";
const DISMISSED_STORAGE_KEY = "epic_admin_dismissed_notifs";

export default function AdminHeader({
  onMenuClick,
  search: controlledSearch,
  onSearchChange,
}: AdminHeaderProps) {
  const [localSearch, setLocalSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>(
    fallbackNotifications
  );
  const [readIds, setReadIds] = useState<string[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [filterTab, setFilterTab] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/db?view=admin");
        const data = (await res.json()) as {
          ok?: boolean;
          orders?: Array<{
            id: string;
            customer: string;
            date: string;
            total: number;
            status: string;
          }>;
          products?: Array<{
            id: number;
            name: string;
            sku: string;
            stock: number;
            status: string;
          }>;
          enquiries?: Array<{
            id: number;
            reference: string;
            customer: string;
            product: string;
            quantity: number;
            date: string;
            status: string;
          }>;
          reviews?: Array<{
            id: number;
            customer: string;
            product: string;
            rating: number;
            date: string;
            status: string;
          }>;
        };

        try {
          const savedRead = localStorage.getItem(READ_STORAGE_KEY);
          const savedDismissed = localStorage.getItem(DISMISSED_STORAGE_KEY);
          if (savedRead) setReadIds(JSON.parse(savedRead));
          if (savedDismissed) setDismissedIds(JSON.parse(savedDismissed));
        } catch {
          /* ignore storage errors */
        }

        if (!data?.ok) return;
        const liveList: AdminNotification[] = [];

        (data.orders ?? [])
          .filter((o) => o.status === "Pending" || o.status === "Processing")
          .slice(0, 3)
          .forEach((o) => {
            liveList.push({
              id: `order-${o.id}`,
              type: "order",
              title: `Order ${o.id} • ₹${Number(o.total).toLocaleString("en-IN")}`,
              subtitle: `${o.customer} • ${o.status}`,
              time: o.date,
              href: "/admin/orders",
            });
          });

        (data.enquiries ?? [])
          .filter((e) => e.status === "New")
          .slice(0, 3)
          .forEach((e) => {
            liveList.push({
              id: `enq-${e.id}`,
              type: "enquiry",
              title: `New Enquiry (${e.reference}): ${e.product}`,
              subtitle: `${e.customer} • Qty: ${e.quantity}`,
              time: e.date,
              href: "/admin/enquiries",
            });
          });

        (data.products ?? [])
          .filter((p) => p.stock <= 15 || p.status === "Out of Stock")
          .slice(0, 2)
          .forEach((p) => {
            liveList.push({
              id: `stock-${p.id}`,
              type: "stock",
              title:
                p.stock === 0
                  ? `Out of Stock: ${p.name}`
                  : `Low Stock (${p.stock} left): ${p.name}`,
              subtitle: `SKU: ${p.sku}`,
              time: "Inventory Alert",
              href: "/admin/products",
            });
          });

        (data.reviews ?? [])
          .filter((r) => r.status === "Pending")
          .slice(0, 2)
          .forEach((r) => {
            liveList.push({
              id: `rev-${r.id}`,
              type: "review",
              title: `Pending Review (${r.rating}★) • ${r.product}`,
              subtitle: `${r.customer} • Awaiting approval`,
              time: r.date,
              href: "/admin/reviews",
            });
          });

        if (liveList.length > 0) {
          setNotifications(liveList);
        }
      } catch {
        /* keep fallback notifications */
      }
    })();
  }, []);

  useEffect(() => {
    if (!notifOpen && !profileOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [notifOpen, profileOpen]);

  const markAsRead = (id: string) => {
    setReadIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const markAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    try {
      localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(allIds));
    } catch {
      /* ignore */
    }
  };

  const dismissNotification = (id: string) => {
    setDismissedIds((prev) => {
      const next = [...prev, id];
      try {
        localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const resetNotifications = () => {
    setReadIds([]);
    setDismissedIds([]);
    try {
      localStorage.removeItem(READ_STORAGE_KEY);
      localStorage.removeItem(DISMISSED_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const activeNotifications = notifications.filter(
    (n) => !dismissedIds.includes(n.id)
  );
  const unreadCount = activeNotifications.filter(
    (n) => !readIds.includes(n.id)
  ).length;
  const displayedNotifications =
    filterTab === "unread"
      ? activeNotifications.filter((n) => !readIds.includes(n.id))
      : activeNotifications;

  const getTypeIcon = (type: AdminNotification["type"]) => {
    if (type === "order")
      return <ShoppingBag size={15} className="text-green-700" />;
    if (type === "stock")
      return <AlertTriangle size={15} className="text-amber-600" />;
    if (type === "enquiry")
      return <MessageSquare size={15} className="text-sky-600" />;
    return <Star size={15} className="text-purple-600" />;
  };

  const searchValue =
    controlledSearch !== undefined ? controlledSearch : localSearch;
  const handleSearch = (v: string) => {
    if (onSearchChange) onSearchChange(v);
    else setLocalSearch(v);
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-sm sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-600 transition hover:bg-gray-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="hidden items-center gap-3 rounded-full border border-gray-200 bg-[#F7F8F5] px-4 py-2.5 transition focus-within:border-[#78D94F] md:flex">
          <Search size={17} className="text-gray-400" />
          <input
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search orders or products..."
            aria-label="Search dashboard"
            className="w-56 border-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="md:hidden">
          <h2 className="m-0 font-[family-name:var(--font-syne)] text-lg font-extrabold text-[#17171B]">
            Dashboard
          </h2>
        </div>
      </div>

      <div
        ref={dropdownRef}
        className="relative flex items-center gap-2 sm:gap-4"
      >
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={notifOpen}
            onClick={() => {
              setNotifOpen((o) => !o);
              setProfileOpen(false);
            }}
            className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-gray-600 transition hover:bg-[#F7F8F5] hover:text-[#17171B]"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#78D94F] px-1 font-[family-name:var(--font-inter)] text-[9px] font-bold tabular-nums text-[#17171B]">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl sm:w-96">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div>
                  <p className="m-0 text-xs font-bold uppercase tracking-[0.15em] text-[#17171B]">
                    Notifications
                  </p>
                  <p className="m-0 mt-0.5 text-[11px] text-gray-400">
                    {unreadCount} unread alert{unreadCount === 1 ? "" : "s"} •
                    store.epicsports@gmail.com
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-full border-0 bg-[#78D94F]/20 px-3 py-1 text-[11px] font-bold text-green-800 transition hover:bg-[#78D94F]"
                  >
                    <CheckCheck size={13} />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 bg-[#F7F8F5]/60 px-5 py-2">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFilterTab("all")}
                    className={`cursor-pointer rounded-full border-0 px-3 py-1 text-[11px] font-bold transition ${
                      filterTab === "all"
                        ? "bg-[#17171B] text-white"
                        : "bg-transparent text-gray-500 hover:text-[#17171B]"
                    }`}
                  >
                    All ({activeNotifications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterTab("unread")}
                    className={`cursor-pointer rounded-full border-0 px-3 py-1 text-[11px] font-bold transition ${
                      filterTab === "unread"
                        ? "bg-[#17171B] text-white"
                        : "bg-transparent text-gray-500 hover:text-[#17171B]"
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>

                {dismissedIds.length > 0 && (
                  <button
                    type="button"
                    onClick={resetNotifications}
                    className="cursor-pointer border-0 bg-transparent text-[11px] font-semibold text-gray-500 underline hover:text-[#17171B]"
                  >
                    Restore all
                  </button>
                )}
              </div>

              <div className="max-h-80 divide-y divide-gray-100 overflow-y-auto">
                {displayedNotifications.length > 0 ? (
                  displayedNotifications.map((n) => {
                    const isUnread = !readIds.includes(n.id);
                    return (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-5 py-3.5 transition hover:bg-[#F7F8F5] ${
                          isUnread ? "bg-[#78D94F]/[0.06]" : "bg-white"
                        }`}
                      >
                        <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#F7F8F5]">
                          {getTypeIcon(n.type)}
                        </div>

                        <Link
                          href={n.href}
                          onClick={() => {
                            markAsRead(n.id);
                            setNotifOpen(false);
                          }}
                          className="min-w-0 flex-1 no-underline"
                        >
                          <div className="flex items-center gap-2">
                            <p className="m-0 truncate text-xs font-bold text-[#17171B]">
                              {n.title}
                            </p>
                            {isUnread && (
                              <span className="h-2 w-2 shrink-0 rounded-full bg-[#78D94F]" />
                            )}
                          </div>
                          <p className="m-0 mt-0.5 truncate text-[11px] text-gray-500">
                            {n.subtitle}
                          </p>
                          <p className="m-0 mt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            {n.time}
                          </p>
                        </Link>

                        <button
                          type="button"
                          onClick={() => dismissNotification(n.id)}
                          aria-label="Dismiss notification"
                          className="grid h-6 w-6 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-gray-400 transition hover:bg-gray-200 hover:text-[#17171B]"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-5 py-10 text-center">
                    <Bell size={26} className="mx-auto text-gray-300" />
                    <p className="m-0 mt-2 text-xs font-bold text-[#17171B]">
                      You&apos;re all caught up!
                    </p>
                    <p className="m-0 mt-1 text-[11px] text-gray-400">
                      No {filterTab === "unread" ? "unread " : ""}notifications
                      at the moment.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 bg-[#F7F8F5] px-5 py-3">
                <Link
                  href="/admin/orders"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-bold text-[#17171B] no-underline hover:text-green-700"
                >
                  View All Orders
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-bold text-green-700 no-underline hover:underline"
                >
                  Notification Settings →
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200" />

        {/* Profile */}
        <div className="relative">
          <button
            type="button"
            aria-expanded={profileOpen}
            className="flex cursor-pointer items-center gap-2.5 rounded-full border-0 bg-transparent p-1 pr-2 transition hover:bg-[#F7F8F5]"
            onClick={() => {
              setProfileOpen((o) => !o);
              setNotifOpen(false);
            }}
          >
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#17171B] text-xs font-bold text-[#78D94F]">
              AD
            </div>

            <div className="hidden text-left sm:block">
              <p className="m-0 text-sm font-bold text-[#17171B]">Admin User</p>
              <p className="m-0 text-xs text-gray-400">Administrator</p>
            </div>

            <ChevronDown size={15} className="hidden text-gray-400 sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
              <Link
                href="/admin/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-600 no-underline transition hover:bg-[#F7F8F5] hover:text-[#17171B]"
              >
                <User size={15} />
                My Profile
              </Link>
              <Link
                href="/admin/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-600 no-underline transition hover:bg-[#F7F8F5] hover:text-[#17171B]"
              >
                <Settings size={15} />
                Store Settings
              </Link>
              <Link
                href="/"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-600 no-underline transition hover:bg-[#F7F8F5] hover:text-[#17171B]"
              >
                <Store size={15} />
                View Live Store
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
