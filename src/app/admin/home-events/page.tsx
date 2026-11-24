"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  ExternalLink,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import CloudinaryImageUpload from "@/components/admin/CloudinaryImageUpload";
import LoadingImage from "@/components/LoadingImage";

type HomeEvent = {
  id: number;
  title: string;
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  badgeText: string;
  bannerImage: string;
  tickerText: string;
  active: boolean;
  sortOrder: number;
};

type EventForm = Omit<HomeEvent, "id">;

const emptyForm: EventForm = {
  title: "",
  eyebrow: "LIMITED SEASONAL EVENT",
  headlineLine1: "MAKE YOUR",
  headlineLine2: "WALLS EPIC.",
  description: "",
  ctaLabel: "SHOP NOW",
  ctaHref: "/shop",
  badgeText: "EVENT SPECIAL",
  bannerImage: "/Home-page/hero-slide-1.jpg",
  tickerText:
    "PREMIUM POSTERS, CREATIVE WALL ART, NEW DROPS, SHIPPING ACROSS INDIA",
  active: true,
  sortOrder: 1,
};

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

export default function AdminHomeEventsPage() {
  const [events, setEvents] = useState<HomeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "draft">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/home-events?all=1", { cache: "no-store" });
      const data = await res.json();
      if (data.ok && Array.isArray(data.events)) {
        setEvents(data.events);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetch("/api/home-events?all=1", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (mounted && data.ok && Array.isArray(data.events)) {
          setEvents(data.events);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      sortOrder: events.length + 1,
    });
    setModalOpen(true);
  };

  const openEdit = (ev: HomeEvent) => {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      eyebrow: ev.eyebrow,
      headlineLine1: ev.headlineLine1,
      headlineLine2: ev.headlineLine2,
      description: ev.description,
      ctaLabel: ev.ctaLabel,
      ctaHref: ev.ctaHref,
      badgeText: ev.badgeText,
      bannerImage: ev.bannerImage,
      tickerText: ev.tickerText,
      active: ev.active,
      sortOrder: ev.sortOrder,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "home_event",
          action: editingId ? "update" : "create",
          id: editingId ?? undefined,
          ...form,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setModalOpen(false);
        showToast(
          editingId ? "Homepage event updated." : "Homepage event created."
        );
        await loadEvents();
      } else {
        showToast(data.error || "Failed to save event.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (ev: HomeEvent) => {
    const nextActive = !ev.active;
    setEvents((prev) =>
      prev.map((item) =>
        item.id === ev.id ? { ...item, active: nextActive } : item
      )
    );
    await fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: "home_event",
        action: "toggle_active",
        id: ev.id,
        active: nextActive,
      }),
    });
    showToast(
      nextActive
        ? `"${ev.title}" is now live on the homepage.`
        : `"${ev.title}" moved to draft.`
    );
  };

  const handleDelete = async (ev: HomeEvent) => {
    if (!confirm(`Delete homepage event "${ev.title}"?`)) return;
    await fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: "home_event",
        action: "delete",
        id: ev.id,
      }),
    });
    setEvents((prev) => prev.filter((item) => item.id !== ev.id));
    showToast("Homepage event deleted.");
  };

  const filtered = events.filter((ev) => {
    const matchesSearch =
      !search.trim() ||
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.headlineLine1.toLowerCase().includes(search.toLowerCase()) ||
      ev.headlineLine2.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && ev.active) ||
      (filter === "draft" && !ev.active);
    return matchesSearch && matchesFilter;
  });

  const activeCount = events.filter((e) => e.active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-[0.2em] text-green-700">
            Dynamic Storefront
          </p>
          <h1 className="m-0 mt-1 text-2xl font-bold text-[#17171B] sm:text-3xl">
            Homepage Events &amp; Banners
          </h1>
          <p className="m-0 mt-1 text-sm text-gray-500">
            Add, edit, or activate seasonal events and hero slides shown live on
            the homepage ({activeCount} active).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className={`inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#17171B] no-underline transition hover:border-[#17171B] ${focus}`}
          >
            <ExternalLink size={14} />
            View Homepage
          </Link>

          <button
            type="button"
            onClick={openCreate}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-2xl border-0 bg-[#78D94F] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#17171B] shadow-sm transition hover:bg-[#17171B] hover:text-white ${focus}`}
          >
            <Plus size={16} />
            Add Event
          </button>
        </div>
      </div>

      {toast && (
        <div className="rounded-2xl border border-[#78D94F]/40 bg-[#78D94F]/15 px-4 py-3 text-sm font-semibold text-green-900">
          {toast}
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events or headlines..."
            className="w-full rounded-2xl border border-gray-200 bg-[#F7F8F5] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#78D94F]"
          />
        </div>

        <div className="flex items-center gap-2">
          {(["all", "active", "draft"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`cursor-pointer rounded-full border-0 px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${focus} ${
                filter === tab
                  ? "bg-[#17171B] text-white"
                  : "bg-[#F7F8F5] text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
          Loading homepage events...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-semibold text-[#17171B]">
            No homepage events found
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Create an event to customize the hero banner and ticker on your
            homepage.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((ev) => (
            <div
              key={ev.id}
              className="flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-[#17171B]">
                  <LoadingImage
                    src={ev.bannerImage || "/Home-page/hero-slide-1.jpg"}
                    alt={ev.title}
                    className="h-full w-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        ev.active
                          ? "bg-[#78D94F] text-[#17171B]"
                          : "bg-white/90 text-gray-700"
                      }`}
                    >
                      {ev.active ? "Active on Home" : "Draft"}
                    </span>

                    <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                      Order #{ev.sortOrder}
                    </span>
                  </div>

                  <div className="absolute inset-x-4 bottom-4 text-white">
                    <p className="m-0 text-[10px] font-bold uppercase tracking-[0.2em] text-[#78D94F]">
                      {ev.eyebrow}
                    </p>
                    <h3 className="m-0 mt-1 text-lg font-bold leading-tight">
                      {ev.headlineLine1}{" "}
                      <span className="text-[#78D94F]">{ev.headlineLine2}</span>
                    </h3>
                  </div>
                </div>

                <div className="p-5">
                  <h4 className="m-0 text-sm font-bold text-[#17171B]">
                    {ev.title}
                  </h4>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">
                    {ev.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                    <span className="rounded-lg bg-[#F7F8F5] px-2.5 py-1 font-semibold text-[#17171B]">
                      CTA: {ev.ctaLabel} → {ev.ctaHref}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-5 py-3.5">
                <button
                  type="button"
                  onClick={() => handleToggleActive(ev)}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${focus} ${
                    ev.active
                      ? "border-[#78D94F]/40 bg-[#78D94F]/15 text-green-800 hover:bg-[#78D94F]/25"
                      : "border-gray-200 bg-[#F7F8F5] text-gray-700 hover:border-[#17171B]"
                  }`}
                >
                  <Check size={14} />
                  {ev.active ? "Active" : "Activate"}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(ev)}
                    aria-label={`Edit ${ev.title}`}
                    className={`grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#17171B] hover:text-[#17171B] ${focus}`}
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(ev)}
                    aria-label={`Delete ${ev.title}`}
                    className={`grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-gray-200 bg-white text-red-500 transition hover:border-red-200 hover:bg-red-50 ${focus}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <h2 className="m-0 text-xl font-bold text-[#17171B]">
                {editingId ? "Edit Homepage Event" : "Add Homepage Event"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-[#F7F8F5] text-gray-600 hover:bg-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
                    Event Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Monsoon Studio Drop"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#78D94F]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
                    Eyebrow Tag
                  </label>
                  <input
                    type="text"
                    value={form.eyebrow}
                    onChange={(e) =>
                      setForm({ ...form, eyebrow: e.target.value })
                    }
                    placeholder="e.g. LIMITED SEASONAL EVENT"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#78D94F]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
                    Headline Line 1
                  </label>
                  <input
                    type="text"
                    value={form.headlineLine1}
                    onChange={(e) =>
                      setForm({ ...form, headlineLine1: e.target.value })
                    }
                    placeholder="MAKE YOUR"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#78D94F]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
                    Headline Line 2 (Green Accent)
                  </label>
                  <input
                    type="text"
                    value={form.headlineLine2}
                    onChange={(e) =>
                      setForm({ ...form, headlineLine2: e.target.value })
                    }
                    placeholder="WALLS EPIC."
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#78D94F]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Hero Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe the event, offer, or drop..."
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#78D94F]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={form.ctaLabel}
                    onChange={(e) =>
                      setForm({ ...form, ctaLabel: e.target.value })
                    }
                    placeholder="SHOP NOW"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#78D94F]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
                    CTA Link
                  </label>
                  <input
                    type="text"
                    value={form.ctaHref}
                    onChange={(e) =>
                      setForm({ ...form, ctaHref: e.target.value })
                    }
                    placeholder="/shop"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#78D94F]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.sortOrder}
                    onChange={(e) =>
                      setForm({ ...form, sortOrder: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#78D94F]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Ticker Items (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.tickerText}
                  onChange={(e) =>
                    setForm({ ...form, tickerText: e.target.value })
                  }
                  placeholder="PREMIUM POSTERS, NEW DROPS, SHIPPING ACROSS INDIA"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#78D94F]"
                />
              </div>

              <CloudinaryImageUpload
                label="Hero Event Banner Image"
                value={form.bannerImage}
                onChange={(url) => setForm({ ...form, bannerImage: url })}
                folder="epic-store/events"
                previewClassName="relative h-24 w-40 overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
              />

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-[#F7F8F5] px-4 py-3 text-sm font-semibold text-[#17171B]">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                  className="h-4 w-4 accent-[#78D94F]"
                />
                Show this event live on the Homepage
              </label>

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="cursor-pointer rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer rounded-xl border-0 bg-[#17171B] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#78D94F] hover:text-[#17171B] disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
