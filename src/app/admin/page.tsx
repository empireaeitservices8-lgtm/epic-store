"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Inter, Montserrat } from "next/font/google";
import { Calendar, Plus } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardStats, {
  type DashboardSummary,
} from "@/components/admin/DashboardStats";
import SalesChart from "@/components/admin/SalesChart";
import RecentOrders, {
  type RecentOrderItem,
} from "@/components/admin/RecentOrders";
import TopProducts, {
  type TopProductItem,
} from "@/components/admin/TopProducts";

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

export default function AdminDashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [summary, setSummary] = useState<DashboardSummary | undefined>(
    undefined
  );
  const [recentOrders, setRecentOrders] = useState<
    RecentOrderItem[] | undefined
  >(undefined);
  const [topProducts, setTopProducts] = useState<TopProductItem[] | undefined>(
    undefined
  );

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/db?view=admin");
        const data = (await res.json()) as {
          ok?: boolean;
          summary?: DashboardSummary;
          orders?: Array<{
            id: string;
            customer: string;
            date: string;
            total: number;
            status: string;
          }>;
          products?: Array<{
            id: number;
            name: string;
            category: string;
            price: number;
            sales?: number;
            image: string;
          }>;
          topProducts?: TopProductItem[];
        };
        if (!data?.ok) return;
        if (data.summary) setSummary(data.summary);
        if (Array.isArray(data.orders)) {
          const styleMap: Record<string, string> = {
            Delivered: "bg-[#78D94F]/20 text-green-800",
            Processing: "bg-amber-100 text-amber-800",
            Shipped: "bg-sky-100 text-sky-800",
            Pending: "bg-gray-100 text-gray-600",
            Cancelled: "bg-red-50 text-red-600",
          };
          setRecentOrders(
            data.orders.slice(0, 6).map((o) => ({
              id: o.id,
              customer: o.customer,
              date: o.date,
              amount: o.total,
              status: o.status,
              statusStyle: styleMap[o.status] ?? "bg-gray-100 text-gray-600",
            }))
          );
        }
          if (Array.isArray(data.topProducts)) {
            setTopProducts(data.topProducts);
          }
        } catch {
          /* fallback to static preview */
        }
      })();
  }, []);

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
          search={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="m-0 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.22em] text-green-700">
                <span className="h-0.5 w-6 bg-[#78D94F]" />
                Admin Panel
              </p>
              <h1 className="m-0 mt-2 font-[family-name:var(--font-montserrat)] text-2xl font-extrabold uppercase tracking-tight text-[#17171B] sm:text-3xl">
                Dashboard Overview
              </h1>
              <p className="m-0 mt-1.5 text-sm text-gray-500">
                Welcome back! Here is what is happening with your store.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-gray-600">
                <Calendar size={14} className="text-green-700" />
                November 2026
              </div>

              <Link
                href="/admin/products"
                className="inline-flex items-center gap-2 rounded-full bg-[#17171B] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white no-underline transition hover:bg-[#78D94F] hover:text-[#17171B]"
              >
                <Plus size={15} />
                Manage Products
              </Link>
            </div>
          </div>

          <DashboardStats summary={summary} />

          <div className="mt-6">
            <SalesChart />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <RecentOrders searchQuery={searchQuery} items={recentOrders} />
            <TopProducts searchQuery={searchQuery} items={topProducts} />
          </div>

          <div className="mt-8 border-t border-gray-200 pt-5 text-center text-xs text-gray-400">
            © 2026 Epic Store Admin Panel. All rights reserved.
          </div>
        </main>
      </div>
    </div>
  );
}
