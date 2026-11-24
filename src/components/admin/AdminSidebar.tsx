"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  Layers,
  MessageSquare,
  Star,
  Ticket,
  CalendarDays,
  Settings,
  LogOut,
  Store,
  X,
} from "lucide-react";

const menuItems = [
  {
    title: "MAIN MENU",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Products", href: "/admin/products", icon: Package },
      { name: "Categories", href: "/admin/categories", icon: Tags },
      { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { name: "Customers", href: "/admin/customers", icon: Users },
    ],
  },
  {
    title: "STORE MANAGEMENT",
    items: [
      { name: "Collections", href: "/admin/collections", icon: Layers },
      { name: "Home Events", href: "/admin/home-events", icon: CalendarDays },
      { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
      { name: "Reviews", href: "/admin/reviews", icon: Star },
      { name: "Coupons", href: "/admin/coupons", icon: Ticket },
    ],
  },
];

type AdminSidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

export default function AdminSidebar({
  mobileOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } finally {
      onClose?.();
      router.replace("/admin/login");
      router.refresh();
    }
  };

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, onClose]);

  const navContent = (
    <>
      <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
        <Link
          href="/admin"
          onClick={onClose}
          className="font-[family-name:var(--font-inter)] text-2xl font-extrabold tracking-tight text-[#17171B] no-underline"
        >
          EPIC<span className="text-[#78D94F]">STORE.</span>
        </Link>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-500 transition hover:bg-gray-100 hover:text-[#17171B] lg:hidden"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {menuItems.map((group) => (
          <div key={group.title} className="mb-7 last:mb-0">
            <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.18em] text-gray-400">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold no-underline transition ${
                      active
                        ? "bg-[#17171B] text-white shadow-sm"
                        : "text-gray-500 hover:bg-[#F7F8F5] hover:text-[#17171B]"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={active ? "text-[#78D94F]" : "text-gray-400"}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 p-4">
        <Link
          href="/admin/settings"
          onClick={onClose}
          className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-gray-500 no-underline transition hover:bg-[#F7F8F5] hover:text-[#17171B]"
        >
          <Settings size={18} className="text-gray-400" />
          Settings
        </Link>

        <Link
          href="/"
          onClick={onClose}
          className="mt-1 flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-gray-500 no-underline transition hover:bg-[#F7F8F5] hover:text-[#17171B]"
        >
          <Store size={18} className="text-gray-400" />
          View Store
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-2xl border-0 bg-transparent px-3.5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
        >
          <LogOut size={18} />
          {loggingOut ? "Signing out..." : "Logout"}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">
        {navContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            aria-hidden="true"
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
          />
          <aside
            aria-label="Admin navigation"
            className="fixed inset-y-0 left-0 z-10 flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl"
          >
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
