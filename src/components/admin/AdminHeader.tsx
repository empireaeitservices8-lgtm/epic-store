"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Search, Menu, ChevronDown, Store, Settings, User } from "lucide-react";

type AdminHeaderProps = {
  onMenuClick?: () => void;
  search?: string;
  onSearchChange?: (value: string) => void;
};

const demoNotifications = [
  { id: "1", title: "New order EP20261117001", time: "2m ago" },
  { id: "2", title: "Low stock: Minimalist Wall Art", time: "1h ago" },
];

export default function AdminHeader({
  onMenuClick,
  search: controlledSearch,
  onSearchChange,
}: AdminHeaderProps) {
  const [localSearch, setLocalSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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

      <div className="relative flex items-center gap-2 sm:gap-4">
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
            <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-[#78D94F] text-[9px] font-bold text-[#17171B]">
              {demoNotifications.length}
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
              <p className="m-0 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                Notifications
              </p>
              <div className="mt-3 space-y-2.5">
                {demoNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-xl bg-[#F7F8F5] px-3.5 py-2.5"
                  >
                    <p className="m-0 text-xs font-semibold text-[#17171B]">
                      {n.title}
                    </p>
                    <p className="m-0 mt-0.5 text-[11px] text-gray-400">
                      {n.time}
                    </p>
                  </div>
                ))}
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
