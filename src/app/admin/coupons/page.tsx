
"use client";

import { useMemo, useState, type FormEvent } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Plus, Search, Pencil, Trash2, X, TicketPercent, Copy,
} from "lucide-react";

type Coupon = {
  id: number;
  code: string;
  type: "Percentage" | "Fixed Amount";
  value: number;
  minOrder: number;
  usageLimit: number;
  used: number;
  startDate: string;
  expiryDate: string;
  status: "Active" | "Inactive";
};

const initialCoupons: Coupon[] = [
  {
    id: 1, code: "WELCOME10", type: "Percentage", value: 10,
    minOrder: 499, usageLimit: 100, used: 32,
    startDate: "2026-11-01", expiryDate: "2026-12-31", status: "Active",
  },
  {
    id: 2, code: "EPIC20", type: "Percentage", value: 20,
    minOrder: 999, usageLimit: 50, used: 18,
    startDate: "2026-11-01", expiryDate: "2026-11-30", status: "Active",
  },
  {
    id: 3, code: "SAVE100", type: "Fixed Amount", value: 100,
    minOrder: 799, usageLimit: 200, used: 86,
    startDate: "2026-10-01", expiryDate: "2026-12-31", status: "Active",
  },
  {
    id: 4, code: "FESTIVE15", type: "Percentage", value: 15,
    minOrder: 599, usageLimit: 75, used: 75,
    startDate: "2026-10-01", expiryDate: "2026-11-15", status: "Inactive",
  },
];

const emptyForm = {
  code: "",
  type: "Percentage" as Coupon["type"],
  value: "",
  minOrder: "0",
  usageLimit: "100",
  startDate: "",
  expiryDate: "",
  status: "Active" as Coupon["status"],
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch = coupon.code.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || coupon.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [coupons, search, statusFilter]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: String(coupon.value),
      minOrder: String(coupon.minOrder),
      usageLimit: String(coupon.usageLimit),
      startDate: coupon.startDate,
      expiryDate: coupon.expiryDate,
      status: coupon.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = form.code.trim().toUpperCase();
    const value = Number(form.value);
    const minOrder = Number(form.minOrder);
    const usageLimit = Number(form.usageLimit);

    if (!code || !Number.isFinite(value) || value <= 0) {
      alert("Enter a valid coupon code and discount value.");
      return;
    }

    if (form.type === "Percentage" && value > 100) {
      alert("Percentage discount cannot exceed 100.");
      return;
    }

    if (minOrder < 0 || usageLimit < 1) {
      alert("Minimum order cannot be negative and usage limit must be at least 1.");
      return;
    }

    if (!form.startDate || !form.expiryDate || form.expiryDate < form.startDate) {
      alert("Please enter valid dates. Expiry must be on or after the start date.");
      return;
    }

    const duplicate = coupons.some(
      (coupon) => coupon.code.toLowerCase() === code.toLowerCase() && coupon.id !== editingId
    );

    if (duplicate) {
      alert("This coupon code already exists.");
      return;
    }

    const couponData = {
      code,
      type: form.type,
      value,
      minOrder,
      usageLimit,
      startDate: form.startDate,
      expiryDate: form.expiryDate,
      status: form.status,
    };

    if (editingId !== null) {
      setCoupons((current) =>
        current.map((coupon) =>
          coupon.id === editingId ? { ...coupon, ...couponData } : coupon
        )
      );
    } else {
      setCoupons((current) => [
        ...current,
        { id: Date.now(), ...couponData, used: 0 },
      ]);
    }

    setModalOpen(false);
    setForm(emptyForm);
  };

  const deleteCoupon = (id: number) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      setCoupons((current) => current.filter((coupon) => coupon.id !== id));
    }
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert("Coupon code copied.");
    } catch {
      alert("Unable to copy the code in this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:ml-64">
        <AdminHeader />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Coupons & Discounts</h1>
              <p className="mt-1 text-sm text-gray-500">Create and manage promotional offers for your store.</p>
            </div>
            <button onClick={openAdd} className="flex items-center justify-center gap-2 rounded-lg bg-[#78D94F] px-5 py-3 text-sm font-semibold text-black hover:bg-[#68c842]">
              <Plus size={18} /> Create Coupon
            </button>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              ["Total Coupons", coupons.length],
              ["Active Coupons", coupons.filter((c) => c.status === "Active").length],
              ["Total Redemptions", coupons.reduce((sum, c) => sum + c.used, 0)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search coupon code..." className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#78D94F]" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm">
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Coupon</th>
                    <th className="px-5 py-4">Discount</th>
                    <th className="px-5 py-4">Minimum Order</th>
                    <th className="px-5 py-4">Usage</th>
                    <th className="px-5 py-4">Validity</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCoupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <TicketPercent size={18} className="text-gray-400" />
                          <span className="font-bold text-gray-900">{coupon.code}</span>
                          <button onClick={() => copyCode(coupon.code)} className="rounded p-1 text-gray-400 hover:bg-gray-100" aria-label="Copy coupon code">
                            <Copy size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-900">
                        {coupon.type === "Percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
                      </td>
                      <td className="px-5 py-4 text-gray-600">₹{coupon.minOrder.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-4">
                        <p className="text-gray-700">{coupon.used} / {coupon.usageLimit}</p>
                        <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full rounded-full bg-[#78D94F]" style={{ width: `${Math.min(100, (coupon.used / coupon.usageLimit) * 100)}%` }} />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                        <p>{coupon.startDate}</p>
                        <p className="mt-1 text-xs">Until {coupon.expiryDate}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${coupon.status === "Active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>{coupon.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEdit(coupon)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Edit coupon"><Pencil size={17} /></button>
                          <button onClick={() => deleteCoupon(coupon.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label="Delete coupon"><Trash2 size={17} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCoupons.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-500">No coupons found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? "Edit Coupon" : "Create Coupon"}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Coupon Code *</label>
                <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s/g, "") })} placeholder="WELCOME10" className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm uppercase outline-none focus:border-[#78D94F]" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Discount Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Coupon["type"] })} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm">
                    <option>Percentage</option>
                    <option>Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Discount Value *</label>
                  <input required type="number" min="0.01" max={form.type === "Percentage" ? 100 : undefined} step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder={form.type === "Percentage" ? "10" : "100"} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Minimum Order (₹)</label>
                  <input type="number" min="0" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Usage Limit *</label>
                  <input required type="number" min="1" step="1" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Start Date *</label>
                  <input required type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Expiry Date *</label>
                  <input required type="date" min={form.startDate || undefined} value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Coupon["status"] })} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm">Cancel</button>
                <button type="submit" className="rounded-lg bg-[#78D94F] px-5 py-2.5 text-sm font-semibold text-black">{editingId ? "Save Changes" : "Create Coupon"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
