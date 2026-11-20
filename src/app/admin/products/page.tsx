"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Inter, Syne } from "next/font/google";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Package,
  Filter,
  ImagePlus,
  Eye,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingImage from "@/components/LoadingImage";

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

type ProductStatus = "Active" | "Draft" | "Out of Stock";

type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  image: string;
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Astronaut Space Poster",
    sku: "EP-POST-001",
    category: "Posters",
    price: 499,
    stock: 45,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300",
  },
  {
    id: 2,
    name: "Abstract Modern Art",
    sku: "EP-CAN-002",
    category: "Canvas Prints",
    price: 599,
    stock: 32,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300",
  },
  {
    id: 3,
    name: "Vintage Aesthetic Poster",
    sku: "EP-POST-003",
    category: "Posters",
    price: 399,
    stock: 0,
    status: "Out of Stock",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300",
  },
  {
    id: 4,
    name: "Nature Landscape Print",
    sku: "EP-CAN-004",
    category: "Canvas Prints",
    price: 549,
    stock: 18,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=300",
  },
  {
    id: 5,
    name: "Minimalist Wall Art",
    sku: "EP-MET-005",
    category: "Metal Posters",
    price: 699,
    stock: 12,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=300",
  },
  {
    id: 6,
    name: "Modern Room Decor",
    sku: "EP-TAP-006",
    category: "Tapestries",
    price: 799,
    stock: 0,
    status: "Draft",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300",
  },
];

const categories = [
  "Posters",
  "Canvas Prints",
  "Metal Posters",
  "Tapestries",
  "Stickers",
];

const emptyForm = {
  name: "",
  sku: "",
  category: "Posters",
  price: "",
  stock: "",
  status: "Active" as ProductStatus,
  image: "",
};

const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/db?view=admin");
        const data = (await res.json()) as { ok?: boolean; products?: Product[] };
        if (data?.ok && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      } catch {
        /* fallback */
      }
    })();
  }, []);

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

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "All Categories" ||
        product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All Status" || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const activeCount = products.filter((p) => p.status === "Active").length;
  const outOfStockCount = products.filter(
    (p) => p.status === "Out of Stock"
  ).length;

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      status: product.status,
      image: product.image,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!form.name.trim() || !form.sku.trim()) {
      setFormError("Please enter the product name and SKU.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setFormError("Please enter a valid product price.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setFormError("Stock must be a whole number of zero or more.");
      return;
    }

    const duplicateSku = products.some(
      (product) =>
        product.sku.toLowerCase() === form.sku.trim().toLowerCase() &&
        product.id !== editingId
    );

    if (duplicateSku) {
      setFormError("This SKU already exists. Please use a different SKU.");
      return;
    }

    const productStatus: ProductStatus =
      stock === 0 && form.status === "Active" ? "Out of Stock" : form.status;

    const productData: Product = {
      id: editingId ?? Date.now(),
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category,
      price,
      stock,
      status: productStatus,
      image:
        form.image.trim() ||
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300",
    };

    if (editingId !== null) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId ? productData : product
        )
      );
      void fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "product", action: "update", ...productData }),
      });
      setSuccessMessage("Product updated successfully.");
    } else {
      setProducts((current) => [productData, ...current]);
      void fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "product", action: "create", ...productData }),
      });
      setSuccessMessage("New product added successfully.");
    }

    setModalOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setProducts((current) =>
      current.filter((product) => product.id !== deleteTarget.id)
    );
    void fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity: "product", action: "delete", id: deleteTarget.id }),
    });
    setSuccessMessage(`"${deleteTarget.name}" deleted successfully.`);
    setDeleteTarget(null);
  };

  const getStatusStyle = (status: ProductStatus) => {
    if (status === "Active") return "bg-[#78D94F]/20 text-green-800";
    if (status === "Draft") return "bg-gray-100 text-gray-600";
    return "bg-red-50 text-red-600";
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
          {/* Page Heading */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                <Link
                  href="/admin"
                  className="text-gray-400 no-underline transition hover:text-[#17171B]"
                >
                  Admin
                </Link>
                <span>/</span>
                <span className="text-green-700">Products</span>
              </div>

              <h1
                className={`${head} m-0 mt-2 text-2xl font-extrabold uppercase tracking-tight text-[#17171B] sm:text-3xl`}
              >
                Product Management
              </h1>

              <p className="m-0 mt-1.5 text-sm text-gray-500">
                Manage your store products, pricing, and inventory.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-0 bg-[#17171B] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#78D94F] hover:text-[#17171B] ${focus}`}
            >
              <Plus size={16} />
              Add New Product
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div
              role="status"
              className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#78D94F]/40 bg-[#78D94F]/15 px-5 py-3.5 text-sm font-medium text-[#17171B]"
            >
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-700" />
                {successMessage}
              </span>
              <button
                type="button"
                onClick={() => setSuccessMessage("")}
                aria-label="Dismiss message"
                className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[#17171B] transition hover:bg-black/10"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Statistics */}
          <div className="mb-7 grid gap-5 sm:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] transition hover:border-[#78D94F]">
              <div className="flex items-center justify-between">
                <p className="m-0 text-sm font-medium text-gray-500">
                  Total Products
                </p>
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#78D94F]/15 text-[#17171B]">
                  <Package size={19} />
                </div>
              </div>
              <h2
                className="m-0 mt-3 font-[family-name:var(--font-inter)] text-3xl font-extrabold tabular-nums tracking-tight text-[#17171B]"
              >
                {products.length}
              </h2>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] transition hover:border-[#78D94F]">
              <p className="m-0 text-sm font-medium text-gray-500">
                Active Products
              </p>
              <h2
                className="m-0 mt-4 font-[family-name:var(--font-inter)] text-3xl font-extrabold tabular-nums tracking-tight text-green-700"
              >
                {activeCount}
              </h2>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] transition hover:border-[#78D94F]">
              <p className="m-0 text-sm font-medium text-gray-500">
                Out of Stock
              </p>
              <h2
                className="m-0 mt-4 font-[family-name:var(--font-inter)] text-3xl font-extrabold tabular-nums tracking-tight text-red-600"
              >
                {outOfStockCount}
              </h2>
            </div>
          </div>

          {/* Product Table */}
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.03)]">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 border-b border-gray-100 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2
                  className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}
                >
                  All Products
                </h2>
                <p className="m-0 mt-1 text-sm text-gray-500">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "product" : "products"} found
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-[#F7F8F5] px-4 py-2.5 transition focus-within:border-[#78D94F]">
                  <Search size={16} className="text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products or SKU..."
                    aria-label="Search products"
                    className="w-full min-w-0 border-0 bg-transparent text-sm outline-none sm:w-48"
                  />
                </div>

                <div className="relative">
                  <Filter
                    size={14}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    aria-label="Filter by category"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-full border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-xs font-bold text-gray-600 outline-none transition focus:border-[#78D94F] sm:w-auto"
                  >
                    <option>All Categories</option>
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>

                <select
                  aria-label="Filter by status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="cursor-pointer rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-600 outline-none transition focus:border-[#78D94F]"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#F7F8F5]">
                  <tr className="text-xs uppercase tracking-wider text-gray-400">
                    <th className="px-6 py-4 font-semibold">Product</th>
                    <th className="px-6 py-4 font-semibold">SKU</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Price</th>
                    <th className="px-6 py-4 font-semibold">Stock</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="transition hover:bg-[#F7F8F5]/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <LoadingImage
                            src={product.image}
                            alt={product.name}
                            wrapperClassName="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100"
                          />
                          <div>
                            <p className="m-0 font-bold text-[#17171B]">
                              {product.name}
                            </p>
                            <p className="m-0 mt-1 text-xs text-gray-400">
                              ID: {product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-gray-500">
                        {product.sku}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.category}
                      </td>

                      <td
                        className="px-6 py-4 font-[family-name:var(--font-inter)] text-sm font-extrabold tabular-nums text-[#17171B]"
                      >
                        ₹{product.price.toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                        {product.stock}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3.5 py-1 text-xs font-bold ${getStatusStyle(
                            product.status
                          )}`}
                        >
                          {product.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/products/${product.id}`}
                            aria-label={`View ${product.name}`}
                            className={`grid h-9 w-9 place-items-center rounded-xl text-gray-400 no-underline transition hover:bg-[#F7F8F5] hover:text-[#17171B] ${focus}`}
                          >
                            <Eye size={16} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            aria-label={`Edit ${product.name}`}
                            className={`grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-400 transition hover:bg-[#78D94F]/20 hover:text-green-800 ${focus}`}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(product)}
                            aria-label={`Delete ${product.name}`}
                            className={`grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-400 transition hover:bg-red-50 hover:text-red-600 ${focus}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <Package size={35} className="mx-auto text-gray-300" />
                        <h3
                          className={`${head} m-0 mt-4 font-extrabold text-[#17171B]`}
                        >
                          No products found
                        </h3>
                        <p className="m-0 mt-2 text-sm text-gray-500">
                          Try changing your search or filters.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 px-6 py-4 text-xs text-gray-400">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </main>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-[2px]"
        >
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2
                  id="product-modal-title"
                  className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}
                >
                  {editingId !== null ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="m-0 mt-1 text-sm text-gray-500">
                  Enter the product information below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-400 transition hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-5 p-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                    Product Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Enter product name"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                    SKU *
                  </label>
                  <input
                    required
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="Example: EP-POST-007"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#78D94F]"
                  >
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                    Selling Price (₹) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="Enter price"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                    Stock Quantity *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    placeholder="Enter stock quantity"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                    Product Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as ProductStatus,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#78D94F]"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                    Product Image URL
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 transition focus-within:border-[#78D94F]">
                    <ImagePlus size={19} className="shrink-0 text-gray-400" />
                    <input
                      value={form.image}
                      onChange={(e) =>
                        setForm({ ...form, image: e.target.value })
                      }
                      placeholder="Paste an image URL"
                      className="w-full min-w-0 border-0 bg-transparent text-sm outline-none"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Demo version: use a publicly accessible image URL. File
                    uploads will be implemented later.
                  </p>

                  {form.image.trim() && (
                    <div className="mt-3">
                      <LoadingImage
                        src={form.image}
                        alt="Product preview"
                        wrapperClassName="relative h-24 w-24 overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                      />
                    </div>
                  )}
                </div>

                {formError && (
                  <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700 sm:col-span-2">
                    {formError}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 bg-[#F7F8F5] px-6 py-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="cursor-pointer rounded-full border border-gray-200 bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="cursor-pointer rounded-full border-0 bg-[#17171B] px-7 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#78D94F] hover:text-[#17171B]"
                >
                  {editingId !== null ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle size={26} />
            </div>
            <h2
              id="delete-modal-title"
              className={`${head} m-0 mt-5 text-center text-xl font-extrabold text-[#17171B]`}
            >
              Delete Product?
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
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
