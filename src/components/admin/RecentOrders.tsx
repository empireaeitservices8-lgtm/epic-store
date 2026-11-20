import Link from "next/link";
import { ArrowRight } from "lucide-react";

const orders = [
  {
    id: "EP20261117001",
    customer: "Alex Johnson",
    date: "17 Nov 2026",
    amount: 1147,
    status: "Processing",
    statusStyle: "bg-amber-100 text-amber-800",
  },
  {
    id: "EP20261116002",
    customer: "Sarah Williams",
    date: "16 Nov 2026",
    amount: 899,
    status: "Delivered",
    statusStyle: "bg-[#78D94F]/20 text-green-800",
  },
  {
    id: "EP20261115003",
    customer: "Rahul Sharma",
    date: "15 Nov 2026",
    amount: 549,
    status: "Shipped",
    statusStyle: "bg-sky-100 text-sky-800",
  },
  {
    id: "EP20261114004",
    customer: "Priya Menon",
    date: "14 Nov 2026",
    amount: 1498,
    status: "Pending",
    statusStyle: "bg-gray-100 text-gray-600",
  },
];

export default function RecentOrders({ searchQuery = "" }: { searchQuery?: string }) {
  const q = searchQuery.trim().toLowerCase();
  const filtered = q
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.status.toLowerCase().includes(q)
      )
    : orders;

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.03)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-6">
        <div>
          <h2 className="m-0 font-[family-name:var(--font-syne)] text-xl font-extrabold text-[#17171B]">
            Recent Orders
          </h2>
          <p className="m-0 mt-1 text-sm text-gray-500">
            Latest customer purchases
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#17171B] no-underline transition hover:text-green-700"
        >
          View All
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left">
          <thead className="bg-[#F7F8F5] text-xs uppercase tracking-wider text-gray-400">
            <tr>
              <th className="px-6 py-4 font-semibold">Order ID</th>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {filtered.length > 0 ? (
              filtered.map((order) => (
                <tr key={order.id} className="transition hover:bg-[#F7F8F5]/70">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-bold text-[#17171B] no-underline hover:underline"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 font-[family-name:var(--font-inter)] font-bold tabular-nums text-[#17171B]">
                    ₹{order.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3.5 py-1 text-xs font-bold ${order.statusStyle}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-gray-400"
                >
                  No orders match &ldquo;{searchQuery}&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
