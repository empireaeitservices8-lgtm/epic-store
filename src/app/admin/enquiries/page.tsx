"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Inter, Montserrat } from "next/font/google";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Search,
  Eye,
  X,
  MessageSquare,
  Clock,
  CheckCircle,
  CheckCircle2,
  Phone,
  Mail,
} from "lucide-react";

/* Fonts: Montserrat for headings, Inter for body/UI */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

type EnquiryStatus = "New" | "In Progress" | "Completed" | "Rejected";

type Enquiry = {
  id: number;
  reference: string;
  customer: string;
  email: string;
  phone: string;
  product: string;
  quantity: number;
  date: string;
  message: string;
  status: EnquiryStatus;
};

const initialEnquiries: Enquiry[] = [
  {
    id: 1,
    reference: "ENQ-2026-001",
    customer: "Ananya Menon",
    email: "ananya@example.com",
    phone: "+91 98765 12345",
    product: "Custom Canvas Print",
    quantity: 3,
    date: "19 Nov 2026",
    message:
      "I would like three canvas prints with my own family photographs. Please share the available sizes and pricing.",
    status: "New",
  },
  {
    id: 2,
    reference: "ENQ-2026-002",
    customer: "Vishnu Raj",
    email: "vishnu@example.com",
    phone: "+91 98765 22222",
    product: "Personalized Poster",
    quantity: 5,
    date: "18 Nov 2026",
    message:
      "Need five customized posters for an office event. Please let me know the bulk price.",
    status: "In Progress",
  },
  {
    id: 3,
    reference: "ENQ-2026-003",
    customer: "Diya Thomas",
    email: "diya@example.com",
    phone: "+91 98765 33333",
    product: "Custom Wall Art",
    quantity: 2,
    date: "17 Nov 2026",
    message: "I have a design file and would like to print it as wall art.",
    status: "Completed",
  },
  {
    id: 4,
    reference: "ENQ-2026-004",
    customer: "Nikhil Kumar",
    email: "nikhil@example.com",
    phone: "+91 98765 44444",
    product: "Photo Stickers",
    quantity: 20,
    date: "16 Nov 2026",
    message: "Looking for twenty personalized stickers for a birthday event.",
    status: "New",
  },
  {
    id: 5,
    reference: "ENQ-2026-005",
    customer: "Riya Nair",
    email: "riya@example.com",
    phone: "+91 98765 55555",
    product: "Custom Canvas Print",
    quantity: 1,
    date: "15 Nov 2026",
    message: "Please provide a quotation for a large canvas print.",
    status: "Rejected",
  },
];

const statusStyles: Record<EnquiryStatus, string> = {
  New: "bg-amber-100 text-amber-800",
  "In Progress": "bg-sky-100 text-sky-800",
  Completed: "bg-[#78D94F]/20 text-green-800",
  Rejected: "bg-red-50 text-red-600",
};

const head = `${montserrat.className} font-[family-name:var(--font-montserrat)]`;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/db?view=admin");
        const data = (await res.json()) as {
          ok?: boolean;
          enquiries?: Enquiry[];
        };
        if (
          data?.ok &&
          Array.isArray(data.enquiries) &&
          data.enquiries.length > 0
        ) {
          setEnquiries(data.enquiries);
        }
      } catch {
        /* fallback */
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedEnquiry) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedEnquiry(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedEnquiry]);

  const filteredEnquiries = useMemo(() => {
    const term = search.trim().toLowerCase();
    return enquiries.filter((enquiry) => {
      const matchesSearch =
        !term ||
        enquiry.reference.toLowerCase().includes(term) ||
        enquiry.customer.toLowerCase().includes(term) ||
        enquiry.email.toLowerCase().includes(term) ||
        enquiry.product.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || enquiry.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [enquiries, search, statusFilter]);

  const updateStatus = (id: number, status: EnquiryStatus) => {
    setEnquiries((current) =>
      current.map((enquiry) =>
        enquiry.id === id ? { ...enquiry, status } : enquiry
      )
    );
    setSelectedEnquiry((current) =>
      current?.id === id ? { ...current, status } : current
    );
    void fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity: "enquiry", action: "status", id, status }),
    });
    const target = enquiries.find((e) => e.id === id);
    if (target) setNotice(`Enquiry ${target.reference} updated to ${status}.`);
  };

  const stats = [
    {
      label: "Total Enquiries",
      value: enquiries.length,
      icon: MessageSquare,
    },
    {
      label: "New Enquiries",
      value: enquiries.filter((e) => e.status === "New").length,
      icon: Clock,
    },
    {
      label: "In Progress",
      value: enquiries.filter((e) => e.status === "In Progress").length,
      icon: MessageSquare,
    },
    {
      label: "Completed",
      value: enquiries.filter((e) => e.status === "Completed").length,
      icon: CheckCircle,
    },
  ];

  return (
    <div
      className={`${montserrat.variable} ${inter.variable} min-h-screen bg-[#F7F8F5] font-[family-name:var(--font-inter)]`}
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
              <span className="text-green-700">Enquiries</span>
            </div>
            <h1
              className={`${head} m-0 mt-2 text-2xl font-extrabold uppercase tracking-tight text-[#17171B] sm:text-3xl`}
            >
              Custom Print Enquiries
            </h1>
            <p className="m-0 mt-1.5 text-sm text-gray-500">
              Review customer requests for personalized products.
            </p>
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
                  placeholder="Search reference, customer or product..."
                  aria-label="Search enquiries"
                  className="w-full border-0 bg-transparent text-sm outline-none"
                />
              </div>

              <select
                aria-label="Filter by enquiry status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="cursor-pointer rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-600 outline-none transition focus:border-[#78D94F]"
              >
                <option value="All">All Status</option>
                <option>New</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Rejected</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-[#F7F8F5] text-xs uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Reference</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Product</th>
                    <th className="px-6 py-4 font-semibold">Quantity</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredEnquiries.map((enquiry) => (
                    <tr
                      key={enquiry.id}
                      className="transition hover:bg-[#F7F8F5]/70"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-bold text-[#17171B]">
                        {enquiry.reference}
                      </td>
                      <td className="px-6 py-4">
                        <p className="m-0 font-bold text-[#17171B]">
                          {enquiry.customer}
                        </p>
                        <p className="m-0 mt-0.5 text-xs text-gray-500">
                          {enquiry.email}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {enquiry.product}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-600">
                        {enquiry.quantity}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                        {enquiry.date}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3.5 py-1 text-xs font-bold ${
                            statusStyles[enquiry.status]
                          }`}
                        >
                          {enquiry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className={`ml-auto grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-400 transition hover:bg-[#F7F8F5] hover:text-[#17171B] ${focus}`}
                          aria-label={`View enquiry ${enquiry.reference}`}
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredEnquiries.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-14 text-center text-gray-500"
                      >
                        No enquiries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 px-6 py-4 text-xs text-gray-400">
              Showing {filteredEnquiries.length} of {enquiries.length} enquiries
            </div>
          </div>
        </main>
      </div>

      {selectedEnquiry && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        >
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  id="enquiry-modal-title"
                  className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}
                >
                  Enquiry Details
                </h2>
                <p className="m-0 mt-1 text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
                  {selectedEnquiry.reference}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-400 hover:bg-gray-100"
                aria-label="Close enquiry details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl bg-[#F7F8F5] p-4">
                <p className={`${head} m-0 font-bold text-[#17171B]`}>
                  {selectedEnquiry.customer}
                </p>
                <p className="m-0 mt-1 text-sm text-gray-500">
                  Submitted on {selectedEnquiry.date}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 text-gray-400" />
                  <div>
                    <p className="m-0 text-xs text-gray-400">Email</p>
                    <p className="m-0 mt-0.5 break-all text-sm font-semibold text-[#17171B]">
                      {selectedEnquiry.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 text-gray-400" />
                  <div>
                    <p className="m-0 text-xs text-gray-400">Phone</p>
                    <p className="m-0 mt-0.5 text-sm font-semibold text-[#17171B]">
                      {selectedEnquiry.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-gray-200 bg-[#F7F8F5]/60 p-4">
                <div>
                  <p className="m-0 text-xs text-gray-400">Requested Product</p>
                  <p className="m-0 mt-1 text-sm font-bold text-[#17171B]">
                    {selectedEnquiry.product}
                  </p>
                </div>
                <div>
                  <p className="m-0 text-xs text-gray-400">Quantity</p>
                  <p
                    className="m-0 mt-1 font-[family-name:var(--font-inter)] text-lg font-extrabold tabular-nums tracking-tight text-[#17171B]"
                  >
                    {selectedEnquiry.quantity}
                  </p>
                </div>
              </div>

              <div>
                <p className="m-0 mb-2 text-sm font-semibold text-[#17171B]">
                  Customer Message
                </p>
                <p className="m-0 rounded-2xl bg-[#F7F8F5] p-4 text-sm leading-6 text-gray-600">
                  {selectedEnquiry.message}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                  Update Enquiry Status
                </label>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) =>
                    updateStatus(
                      selectedEnquiry.id,
                      e.target.value as EnquiryStatus
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                >
                  <option>New</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Rejected</option>
                </select>
              </div>

              <p className="m-0 text-xs text-gray-400">
                Status changes are temporary and are not saved to a database
                yet.
              </p>

              <div className="flex justify-end border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
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
