"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Inter, Syne } from "next/font/google";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Search,
  Eye,
  X,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  CheckCircle2,
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

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

type Order = {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  payment: string;
  status: OrderStatus;
};

const initialOrders: Order[] = [
  {
    id: "EP20261119001",
    customer: "Alex Johnson",
    email: "alex@example.com",
    date: "19 Nov 2026",
    items: 2,
    total: 1098,
    payment: "Paid",
    status: "Processing",
  },
  {
    id: "EP20261118002",
    customer: "Priya Sharma",
    email: "priya@example.com",
    date: "18 Nov 2026",
    items: 1,
    total: 599,
    payment: "Paid",
    status: "Shipped",
  },
  {
    id: "EP20261117003",
    customer: "Rahul Kumar",
    email: "rahul@example.com",
    date: "17 Nov 2026",
    items: 3,
    total: 1847,
    payment: "COD",
    status: "Pending",
  },
  {
    id: "EP20261116004",
    customer: "Sneha Thomas",
    email: "sneha@example.com",
    date: "16 Nov 2026",
    items: 2,
    total: 1298,
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: "EP20261115005",
    customer: "Arjun Das",
    email: "arjun@example.com",
    date: "15 Nov 2026",
    items: 1,
    total: 449,
    payment: "Refunded",
    status: "Cancelled",
  },
  {
    id: "EP20261114006",
    customer: "Meera Nair",
    email: "meera@example.com",
    date: "14 Nov 2026",
    items: 4,
    total: 2396,
    payment: "Paid",
    status: "Delivered",
  },
];

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Processing: "bg-sky-100 text-sky-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-[#78D94F]/20 text-green-800",
  Cancelled: "bg-red-50 text-red-600",
};

const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusNotice, setStatusNotice] = useState("");

  useEffect(() => {
    if (!selectedOrder) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedOrder(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedOrder]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        !term ||
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        order.email.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order))
    );
    setSelectedOrder((current) =>
      current?.id === id ? { ...current, status } : current
    );
    setStatusNotice(`Order ${id} updated to ${status}.`);
  };

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ShoppingBag },
    {
      label: "Pending",
      value: orders.filter((o) => o.status === "Pending").length,
      icon: Clock,
    },
    {
      label: "Processing",
      value: orders.filter((o) => o.status === "Processing").length,
      icon: Truck,
    },
    {
      label: "Delivered",
      value: orders.filter((o) => o.status === "Delivered").length,
      icon: CheckCircle,
    },
  ];

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
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
              <Link
                href="/admin"
                className="text-gray-400 no-underline transition hover:text-[#17171B]"
              >
                Admin
              </Link>
              <span>/</span>
              <span className="text-green-700">Orders</span>
            </div>
            <h1
              className={`${head} m-0 mt-2 text-2xl font-extrabold uppercase tracking-tight text-[#17171B] sm:text-3xl`}
            >
              Order Management
            </h1>
            <p className="m-0 mt-1.5 text-sm text-gray-500">
              View and manage customer orders.
            </p>
          </div>

          {statusNotice && (
            <div
              role="status"
              className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#78D94F]/40 bg-[#78D94F]/15 px-5 py-3.5 text-sm font-medium text-[#17171B]"
            >
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-700" />
                {statusNotice}
              </span>
              <button
                type="button"
                onClick={() => setStatusNotice("")}
                aria-label="Dismiss message"
                className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[#17171B] transition hover:bg-black/10"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="group flex items-center justify-between rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] transition hover:-translate-y-1 hover:border-[#78D94F]"
              >
                <div>
                  <p className="m-0 text-sm font-medium text-gray-500">
                    {label}
                  </p>
                  <p
                    className={`${head} m-0 mt-2 text-2xl font-extrabold text-[#17171B]`}
                  >
                    {value}
                  </p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#78D94F]/15 text-[#17171B] transition-colors group-hover:bg-[#78D94F]">
                  <Icon size={21} />
                </div>
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
                  placeholder="Search order ID, customer or email..."
                  aria-label="Search orders"
                  className="w-full border-0 bg-transparent text-sm outline-none"
                />
              </div>
              <select
                aria-label="Filter by order status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="cursor-pointer rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-600 outline-none transition focus:border-[#78D94F]"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-[#F7F8F5] text-xs uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Order ID</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Items</th>
                    <th className="px-6 py-4 font-semibold">Total</th>
                    <th className="px-6 py-4 font-semibold">Payment</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition hover:bg-[#F7F8F5]/70"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-bold text-[#17171B]">
                        {order.id}
                      </td>
                      <td className="px-6 py-4">
                        <p className="m-0 font-bold text-[#17171B]">
                          {order.customer}
                        </p>
                        <p className="m-0 mt-0.5 text-xs text-gray-500">
                          {order.email}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{order.items}</td>
                      <td
                        className={`${head} whitespace-nowrap px-6 py-4 font-extrabold text-[#17171B]`}
                      >
                        ₹{order.total.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {order.payment}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3.5 py-1 text-xs font-bold ${
                            statusStyles[order.status]
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className={`ml-auto grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-400 transition hover:bg-[#F7F8F5] hover:text-[#17171B] ${focus}`}
                          aria-label={`View order ${order.id}`}
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-14 text-center text-gray-500"
                      >
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-gray-100 px-6 py-4 text-xs text-gray-400">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>
        </main>
      </div>

      {selectedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        >
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  id="order-modal-title"
                  className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}
                >
                  Order Details
                </h2>
                <p className="m-0 mt-1 text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
                  {selectedOrder.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-[#F7F8F5] p-4">
                <p className={`${head} m-0 font-bold text-[#17171B]`}>
                  {selectedOrder.customer}
                </p>
                <p className="m-0 mt-1 text-sm text-gray-500">
                  {selectedOrder.email}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-[#F7F8F5] p-3.5">
                  <p className="m-0 text-xs text-gray-400">Order Date</p>
                  <p className="m-0 mt-1 font-semibold text-[#17171B]">
                    {selectedOrder.date}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F7F8F5] p-3.5">
                  <p className="m-0 text-xs text-gray-400">Items</p>
                  <p className="m-0 mt-1 font-semibold text-[#17171B]">
                    {selectedOrder.items}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F7F8F5] p-3.5">
                  <p className="m-0 text-xs text-gray-400">Payment</p>
                  <p className="m-0 mt-1 font-semibold text-[#17171B]">
                    {selectedOrder.payment}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F7F8F5] p-3.5">
                  <p className="m-0 text-xs text-gray-400">Total</p>
                  <p
                    className={`${head} m-0 mt-1 font-extrabold text-[#17171B]`}
                  >
                    ₹{selectedOrder.total.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                  Update Order Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    updateStatus(
                      selectedOrder.id,
                      e.target.value as OrderStatus
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <p className="m-0 text-xs text-gray-400">
                Status changes are currently saved only in this browser session.
              </p>
              <div className="flex justify-end border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="cursor-pointer rounded-full border-0 bg-[#78D94F] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[#17171B] transition hover:bg-[#17171B] hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
