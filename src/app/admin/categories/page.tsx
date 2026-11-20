"use client";

import { useEffect, useMemo, useState } from "react";
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
  Folder,
  ImagePlus,
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

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: "Active" | "Inactive";
};

const initialCategories: Category[] = [
  {
    id: 1,
    name: "Posters",
    slug: "posters",
    description: "Creative posters for every space.",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300",
    status: "Active",
  },
  {
    id: 2,
    name: "Canvas Prints",
    slug: "canvas-prints",
    description: "Premium canvas wall art.",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300",
    status: "Active",
  },
  {
    id: 3,
    name: "Metal Posters",
    slug: "metal-posters",
    description: "Modern metal wall posters.",
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=300",
    status: "Active",
  },
  {
    id: 4,
    name: "Tapestries",
    slug: "tapestries",
    description: "Decorative fabric wall art.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=300",
    status: "Inactive",
  },
  {
    id: 5,
    name: "Stickers",
    slug: "stickers",
    description: "Fun stickers and creative designs.",
    image: "https://images.unsplash.com/photo-1557683316-973673baf926?w=300",
    status: "Active",
  },
];

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  status: "Active" as "Active" | "Inactive",
};

const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

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

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    return categories.filter((category) => {
      const matchesSearch =
        !q ||
        category.name.toLowerCase().includes(q) ||
        category.slug.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" || category.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      status: category.status,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleNameChange = (value: string) => {
    setForm((current) => ({
      ...current,
      name: value,
      slug: editingId
        ? current.slug
        : value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.slug.trim()) {
      setFormError("Please enter a category name and slug.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        category.slug.toLowerCase() === form.slug.trim().toLowerCase() &&
        category.id !== editingId
    );

    if (duplicate) {
      setFormError("This category slug already exists.");
      return;
    }

    if (editingId !== null) {
      setCategories((current) =>
        current.map((category) =>
          category.id === editingId
            ? { ...category, ...form, name: form.name.trim(), slug: form.slug.trim() }
            : category
        )
      );
      setNotice("Category updated successfully.");
    } else {
      setCategories((current) => [
        ...current,
        { id: Date.now(), ...form, name: form.name.trim(), slug: form.slug.trim() },
      ]);
      setNotice("New category added successfully.");
    }

    setModalOpen(false);
    setForm(emptyForm);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setCategories((current) =>
      current.filter((category) => category.id !== deleteTarget.id)
    );
    setNotice(`"${deleteTarget.name}" deleted successfully.`);
    setDeleteTarget(null);
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
                <span className="text-green-700">Categories</span>
              </div>
              <h1
                className={`${head} m-0 mt-2 text-2xl font-extrabold uppercase tracking-tight text-[#17171B] sm:text-3xl`}
              >
                Categories
              </h1>
              <p className="m-0 mt-1.5 text-sm text-gray-500">
                Organize and manage your store categories.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddModal}
              className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-[#17171B] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#78D94F] hover:text-[#17171B] ${focus}`}
            >
              <Plus size={16} /> Add Category
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
              ["Total Categories", categories.length],
              [
                "Active Categories",
                categories.filter((c) => c.status === "Active").length,
              ],
              [
                "Inactive Categories",
                categories.filter((c) => c.status === "Inactive").length,
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

          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 bg-[#F7F8F5] px-4 py-2.5 transition focus-within:border-[#78D94F]">
                <Search className="shrink-0 text-gray-400" size={17} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search categories..."
                  aria-label="Search categories"
                  className="w-full border-0 bg-transparent text-sm outline-none"
                />
              </div>
              <select
                aria-label="Filter by category status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="cursor-pointer rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-600 outline-none transition focus:border-[#78D94F]"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-[#F7F8F5] text-xs uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Slug</th>
                    <th className="px-6 py-4 font-semibold">Description</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="transition hover:bg-[#F7F8F5]/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {category.image ? (
                            <LoadingImage
                              src={category.image}
                              alt={category.name}
                              wrapperClassName="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gray-100"
                            />
                          ) : (
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gray-100 text-gray-500">
                              <Folder size={19} />
                            </div>
                          )}
                          <span className="font-bold text-[#17171B]">
                            {category.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {category.slug}
                      </td>
                      <td className="max-w-xs truncate px-6 py-4 text-gray-500">
                        {category.description}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3.5 py-1 text-xs font-bold ${
                            category.status === "Active"
                              ? "bg-[#78D94F]/20 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {category.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(category)}
                            className={`grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-400 transition hover:bg-[#78D94F]/20 hover:text-green-800 ${focus}`}
                            aria-label={`Edit ${category.name}`}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(category)}
                            className={`grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-400 transition hover:bg-red-50 hover:text-red-600 ${focus}`}
                            aria-label={`Delete ${category.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCategories.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-14 text-center text-gray-500"
                      >
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="category-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        >
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <h2
                id="category-modal-title"
                className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}
              >
                {editingId ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                  Category Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                  placeholder="Example: Wall Posters"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                  Slug *
                </label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                  placeholder="wall-posters"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                  placeholder="Write a short category description..."
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                  Category Image URL
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 transition focus-within:border-[#78D94F]">
                  <ImagePlus size={19} className="shrink-0 text-gray-400" />
                  <input
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                    className="w-full border-0 bg-transparent text-sm outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                {form.image.trim() && (
                  <div className="mt-3">
                    <LoadingImage
                      src={form.image}
                      alt="Category preview"
                      wrapperClassName="relative h-24 w-24 overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as Category["status"],
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#78D94F]"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
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
                  {editingId ? "Save Changes" : "Create Category"}
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
          aria-labelledby="delete-cat-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle size={26} />
            </div>
            <h2
              id="delete-cat-title"
              className={`${head} m-0 mt-5 text-center text-xl font-extrabold text-[#17171B]`}
            >
              Delete Category?
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
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
