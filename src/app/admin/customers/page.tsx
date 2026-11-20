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
  Users,
  ShoppingBag,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  IndianRupee,
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

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  joined: string;
  orders: number;
  spent: number;
  status: "Active" | "Inactive";
  address: string;
};

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "+91 98765 43210",
    joined: "10 Nov 2026",
    orders: 8,
    spent: 6490,
    status: "Active",
    address: "Kochi, Kerala, India",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 12345",
    joined: "08 Nov 2026",
    orders: 5,
    spent: 4299,
    status: "Active",
    address: "Bengaluru, Karnataka, India",
  },
  {
    id: 3,
    name: "Rahul Kumar",
    email: "rahul@example.com",
    phone: "+91 91234 56789",
    joined: "05 Nov 2026",
    orders: 3,
    spent: 2199,
    status: "Active",
    address: "Chennai, Tamil Nadu, India",
  },
  {
    id: 4,
    name: "Sneha Thomas",
    email: "sneha@example.com",
    phone: "+91 99887 76655",
    joined: "01 Nov 2026",
    orders: 12,
    spent: 9870,
    status: "Active",
    address: "Thrissur, Kerala, India",
  },
  {
    id: 5,
    name: "Arjun Das",
    email: "arjun@example.com",
    phone: "+91 90909 80808",
    joined: "28 Oct 2026",
    orders: 1,
    spent: 449,
    status: "Inactive",
    address: "Kozhikode, Kerala, India",
  },
  {
    id: 6,
    name: "Meera Nair",
    email: "meera@example.com",
    phone: "+91 98989 78787",
    joined: "22 Oct 2026",
    orders: 6,
    spent: 5199,
    status: "Active",
    address: "Alappuzha, Kerala, India",
  },
];

const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  useEffect(() => {
    if (!selectedCustomer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCustomer(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedCustomer]);

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return customers.filter((customer) => {
      const matchesSearch =
        !term ||
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.phone.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const toggleStatus = (id: number) => {
    setCustomers((current) =>
      current.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" }
          : c
      )
    );
    setSelectedCustomer((current) =>
      current && current.id === id
        ? {
            ...current,
            status: current.status === "Active" ? "Inactive" : "Active",
          }
        : current
    );
  };

  const totalSpent = customers.reduce((sum, customer) => sum + customer.spent, 0);

  const stats = [
    { label: "Total Customers", value: customers.length, icon: Users },
    {
      label: "Active Customers",
      value: customers.filter((c) => c.status === "Active").length,
      icon: UserCheck,
    },
    {
      label: "Total Orders",
      value: customers.reduce((sum, c) => sum + c.orders, 0),
      icon: ShoppingBag,
    },
    {
      label: "Total Customer Spend",
      value: `₹${totalSpent.toLocaleString("en-IN")}`,
      icon: IndianRupee,
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
              <span className="text-green-700">Customers</span>
            </div>
            <h1
              className={`${head} m-0 mt-2 text-2xl font-extrabold uppercase tracking-tight text-[#17171B] sm:text-3xl`}
            >
              Customer Management
            </h1>
            <p className="m-0 mt-1.5 text-sm text-gray-500">
              View customer information and their shopping activity.
            </p>
          </div>

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
                    className="m-0 mt-2 font-[family-name:var(--font-inter)] text-2xl font-extrabold tabular-nums tracking-tight text-[#17171B]"
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
                  placeholder="Search by customer name, email or phone..."
                  aria-label="Search customers"
                  className="w-full border-0 bg-transparent text-sm outline-none"
                />
              </div>

              <select
                aria-label="Filter by customer status"
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
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-[#F7F8F5] text-xs uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Phone</th>
                    <th className="px-6 py-4 font-semibold">Joined Date</th>
                    <th className="px-6 py-4 font-semibold">Orders</th>
                    <th className="px-6 py-4 font-semibold">Total Spent</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="transition hover:bg-[#F7F8F5]/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#17171B] text-xs font-bold text-[#78D94F]">
                            {customer.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="m-0 font-bold text-[#17171B]">
                              {customer.name}
                            </p>
                            <p className="m-0 mt-0.5 text-xs text-gray-500">
                              {customer.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {customer.phone}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                        {customer.joined}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-600">
                        {customer.orders}
                      </td>
                      <td
                        className="whitespace-nowrap px-6 py-4 font-[family-name:var(--font-inter)] font-extrabold tabular-nums text-[#17171B]"
                      >
                        ₹{customer.spent.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3.5 py-1 text-xs font-bold ${
                            customer.status === "Active"
                              ? "bg-[#78D94F]/20 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomer(customer)}
                          className={`grid h-9 w-9 ml-auto cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-400 transition hover:bg-[#F7F8F5] hover:text-[#17171B] ${focus}`}
                          aria-label={`View ${customer.name} details`}
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-14 text-center text-gray-500"
                      >
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 px-6 py-4 text-xs text-gray-400">
              Showing {filteredCustomers.length} of {customers.length} customers
            </div>
          </div>
        </main>
      </div>

      {selectedCustomer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="customer-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        >
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  id="customer-modal-title"
                  className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}
                >
                  Customer Details
                </h2>
                <p className="m-0 mt-1 text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
                  Customer ID: #{selectedCustomer.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-400 hover:bg-gray-100"
                aria-label="Close customer details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 flex items-center gap-4 rounded-2xl bg-[#F7F8F5] p-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#17171B] text-lg font-bold text-[#78D94F]">
                {selectedCustomer.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <h3
                  className={`${head} m-0 text-lg font-extrabold text-[#17171B]`}
                >
                  {selectedCustomer.name}
                </h3>
                <p className="m-0 text-xs text-gray-500">
                  Customer since {selectedCustomer.joined}
                </p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                    selectedCustomer.status === "Active"
                      ? "bg-[#78D94F]/20 text-green-800"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {selectedCustomer.status}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 text-gray-400" />
                <div>
                  <p className="m-0 text-xs text-gray-400">Email Address</p>
                  <p className="m-0 mt-0.5 font-semibold text-[#17171B]">
                    {selectedCustomer.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 text-gray-400" />
                <div>
                  <p className="m-0 text-xs text-gray-400">Phone Number</p>
                  <p className="m-0 mt-0.5 font-semibold text-[#17171B]">
                    {selectedCustomer.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-gray-400" />
                <div>
                  <p className="m-0 text-xs text-gray-400">Delivery Address</p>
                  <p className="m-0 mt-0.5 font-semibold text-[#17171B]">
                    {selectedCustomer.address}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                <div className="rounded-2xl bg-[#F7F8F5] p-4">
                  <p className="m-0 text-xs text-gray-500">Total Orders</p>
                  <p
                    className="m-0 mt-1 font-[family-name:var(--font-inter)] text-xl font-extrabold tabular-nums tracking-tight text-[#17171B]"
                  >
                    {selectedCustomer.orders}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F7F8F5] p-4">
                  <p className="m-0 text-xs text-gray-500">Total Spent</p>
                  <p
                    className="m-0 mt-1 font-[family-name:var(--font-inter)] text-xl font-extrabold tabular-nums tracking-tight text-[#17171B]"
                  >
                    ₹{selectedCustomer.spent.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => toggleStatus(selectedCustomer.id)}
                className="cursor-pointer rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[#17171B] transition hover:border-[#78D94F]"
              >
                {selectedCustomer.status === "Active"
                  ? "Mark Inactive"
                  : "Mark Active"}
              </button>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="cursor-pointer rounded-full border-0 bg-[#78D94F] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[#17171B] transition hover:bg-[#17171B] hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
