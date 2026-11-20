"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Inter, Syne } from "next/font/google";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingImage from "@/components/LoadingImage";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ImagePlus,
  Star,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

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

type Collection = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: "Active" | "Inactive";
  featured: boolean;
};

const initialCollections: Collection[] = [
  {
    id: 1,
    name: "Best Sellers",
    slug: "best-sellers",
    description: "Our most popular designs.",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600",
    status: "Active",
    featured: true,
  },
  {
    id: 2,
    name: "Modern Wall Art",
    slug: "modern-wall-art",
    description: "Contemporary artwork for modern spaces.",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600",
    status: "Active",
    featured: true,
  },
  {
    id: 3,
    name: "Minimalist Collection",
    slug: "minimalist-collection",
    description: "Simple and elegant designs.",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=600",
    status: "Active",
    featured: false,
  },
  {
    id: 4,
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "Recently added products and designs.",
    image:
      "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=600",
    status: "Inactive",
    featured: false,
  },
];

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  status: "Active" as "Active" | "Inactive",
  featured: false,
};

const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState(initialCollections);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);

  useEffect(() => {
    if (!modalOpen && !deleteTarget) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalOpen(false);
        setDeleteTarget(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, deleteTarget]);

  const filteredCollections = useMemo(() => {
    const term = search.trim().toLowerCase();
    return collections.filter((collection) => {
      const matchesSearch =
        !term ||
        collection.name.toLowerCase().includes(term) ||
        collection.slug.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || collection.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [collections, search, statusFilter]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (collection: Collection) => {
    setEditingId(collection.id);
    setForm({
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      image: collection.image,
      status: collection.status,
      featured: collection.featured,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleNameChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    setForm((current) => ({
      ...current,
      name: value,
      slug: editingId ? current.slug : slug,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const duplicateSlug = collections.some(
      (collection) =>
        collection.slug.toLowerCase() === form.slug.trim().toLowerCase() &&
        collection.id !== editingId
    );

    if (duplicateSlug) {
      setFormError("A collection with this slug already exists.");
      return;
    }

    if (editingId !== null) {
      setCollections((current) =>
        current.map((collection) =>
          collection.id === editingId
            ? {
                ...collection,
                ...form,
                name: form.name.trim(),
                slug: form.slug.trim(),
              }
            : collection
        )
      );
      setNotice("Collection updated successfully.");
    } else {
      setCollections((current) => [
        ...current,
        {
          id: Date.now(),
          ...form,
          name: form.name.trim(),
          slug: form.slug.trim(),
        },
      ]);
      setNotice("New collection added successfully.");
    }

    setModalOpen(false);
    setForm(emptyForm);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setCollections((current) =>
      current.filter((collection) => collection.id !== deleteTarget.id)
    );
    setNotice(`"${deleteTarget.name}" deleted successfully.`);
    setDeleteTarget(null);
  };

  const toggleFeatured = (id: number) => {
    setCollections((current) =>
      current.map((collection) =>
        collection.id === id
          ? { ...collection, featured: !collection.featured }
          : collection
      )
    );
  };

  return (
    <div
      className={`${syne.variable} ${inter.variable} min-h-screen bg-[#F7F8F5] font-[family-name:var(--font-inter)]`}
    >
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="lg:pl-64">
        <AdminHeader
          onMenuClick={() => setMobileMenuOpen(true)}
          search={search}
          onSearchChange={setSearch}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                <Link
                  href="/admin"
                  className="text-gray-400 no-underline transition hover:text-[#17171B]"
                >
                  Admin
                </Link>
                <span>/</span>
                <span className="text-green-700">Collections</span>
              </div>
              <h1
                className={`${head} m-0 mt-2 text-2xl font-extrabold uppercase tracking-tight text-[#17171B] sm:text-3xl`}
              >
                Collections
              </h1>
              <p className="m-0 mt-1.5 text-sm text-gray-500">
                Organize products into featured store collections.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-[#17171B] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#78D94F] hover:text-[#17171B] ${focus}`}
            >
              <Plus size={16} /> Add Collection
            </button>
          </div>

          {notice && (
            <div
              role="status"
              className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#78D94F]/40 bg-[#78D94F]/15 px-5 py-3.5 text-sm font-medium text-[#17171B]"
            >
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-700" />
                {notice}
              </span>
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss message"
                className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[#17171B] transition hover:bg-black/10"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              ["Total Collections", collections.length],
              [
                "Active Collections",
                collections.filter((c) => c.status === "Active").length,
              ],
              [
                "Featured Collections",
                collections.filter((c) => c.featured).length,
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] transition hover:border-[#78D94F]"
              >
                <p className="m-0 text-sm font-medium text-gray-500">{label}</p>
                <p
                  className="m-0 mt-3 font-[family-name:var(--font-inter)] text-3xl font-extrabold tabular-nums tracking-tight text-[#17171B]"
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-4 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 bg-[#F7F8F5] px-4 py-2.5 transition focus-within:border-[#78D94F]">
              <Search className="shrink-0 text-gray-400" size={17} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search collections..."
                aria-label="Search collections"
                className="w-full border-0 bg-transparent text-sm outline-none"
              />
            </div>

            <select
              aria-label="Filter by collection status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="cursor-pointer rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-600 outline-none transition focus:border-[#78D94F]"
            >
              <option value="All">All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCollections.map((collection) => (
              <div
                key={collection.id}
                className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-1 hover:border-[#78D94F]"
              >
                <div className="relative h-48 bg-gray-100">
                  {collection.image ? (
                    <LoadingImage
                      src={collection.image}
                      alt={collection.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <ImagePlus size={35} />
                    </div>
                  )}

                  <span
                    className={`absolute left-3 top-3 rounded-full px-3.5 py-1 text-xs font-bold ${
                      collection.status === "Active"
                        ? "bg-[#78D94F] text-[#17171B]"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {collection.status}
                  </span>

                  {collection.featured && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#17171B] px-3 py-1 text-xs font-bold text-white">
                      <Star
                        size={12}
                        className="fill-[#78D94F] text-[#78D94F]"
                      />
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3
                    className={`${head} m-0 text-lg font-extrabold text-[#17171B]`}
                  >
                    {collection.name}
                  </h3>
                  <p className="m-0 mt-1 text-xs font-medium text-gray-400">
                    /{collection.slug}
                  </p>
                  <p className="m-0 mt-3 text-sm leading-6 text-gray-500">
                    {collection.description || "No description provided."}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-gray-600">
                      <input
                        type="checkbox"
                        checked={collection.featured}
                        onChange={() => toggleFeatured(collection.id)}
                        className="h-4 w-4 accent-[#78D94F]"
                      />
                      Featured
                    </label>

                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(collection)}
                        className={`grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-400 transition hover:bg-[#78D94F]/20 hover:text-green-800 ${focus}`}
                        aria-label={`Edit ${collection.name}`}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(collection)}
                        className={`grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-400 transition hover:bg-red-50 hover:text-red-600 ${focus}`}
                        aria-label={`Delete ${collection.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredCollections.length === 0 && (
              <div className="col-span-full rounded-3xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
                No collections found.
              </div>
            )}
          </div>
        </main>
      </div>

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="collection-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        >
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <h2
                id="collection-modal-title"
                className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}
              >
                {editingId ? "Edit Collection" : "Add Collection"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-400 hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                  Collection Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Example: Trending Posters"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                  Slug *
                </label>
                <input
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="trending-posters"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe this collection..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                  Collection Image URL
                </label>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                />
                {form.image.trim() && (
                  <div className="mt-3">
                    <LoadingImage
                      src={form.image}
                      alt="Collection preview"
                      wrapperClassName="relative h-28 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as Collection["status"],
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#78D94F]"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>

                <label className="flex cursor-pointer items-center gap-2 self-end pb-3 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#78D94F]"
                  />
                  Show as featured
                </label>
              </div>

              {formError && (
                <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="cursor-pointer rounded-full border border-gray-200 bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-full border-0 bg-[#17171B] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#78D94F] hover:text-[#17171B]"
                >
                  {editingId ? "Save Changes" : "Create Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-col-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle size={26} />
            </div>
            <h2
              id="delete-col-title"
              className={`${head} m-0 mt-5 text-center text-xl font-extrabold text-[#17171B]`}
            >
              Delete Collection?
            </h2>
            <p className="mt-2 text-center text-sm leading-6 text-gray-500">
              Are you sure you want to remove{" "}
              <strong className="text-[#17171B]">{deleteTarget.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="cursor-pointer rounded-full border border-gray-200 bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="cursor-pointer rounded-full border-0 bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-red-700"
              >
                Delete Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
