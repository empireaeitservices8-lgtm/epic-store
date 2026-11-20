import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "₹2,45,890",
    change: "+12.8%",
    positive: true,
    description: "Compared to last month",
    icon: IndianRupee,
  },
  {
    title: "Total Orders",
    value: "1,248",
    change: "+8.2%",
    positive: true,
    description: "Compared to last month",
    icon: ShoppingBag,
  },
  {
    title: "Total Customers",
    value: "856",
    change: "+15.4%",
    positive: true,
    description: "Compared to last month",
    icon: Users,
  },
  {
    title: "Total Products",
    value: "324",
    change: "-2.4%",
    positive: false,
    description: "Compared to last month",
    icon: Package,
  },
];

export type DashboardSummary = {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
};

export default function DashboardStats({
  summary,
}: {
  summary?: DashboardSummary;
}) {
  const dynamicStats = summary
    ? [
        {
          ...stats[0],
          value: `₹${summary.totalRevenue.toLocaleString("en-IN")}`,
        },
        {
          ...stats[1],
          value: summary.totalOrders.toLocaleString("en-IN"),
        },
        {
          ...stats[2],
          value: summary.totalCustomers.toLocaleString("en-IN"),
        },
        {
          ...stats[3],
          value: summary.totalProducts.toLocaleString("en-IN"),
        },
      ]
    : stats;

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {dynamicStats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.positive ? TrendingUp : TrendingDown;

        return (
          <div
            key={stat.title}
            className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-1 hover:border-[#78D94F] hover:shadow-[0_10px_30px_rgba(120,217,79,0.12)]"
          >
            <div className="flex items-center justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#78D94F]/15 text-[#17171B] transition-colors duration-300 group-hover:bg-[#78D94F]">
                <Icon size={21} />
              </div>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                  stat.positive
                    ? "bg-[#78D94F]/20 text-green-800"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <TrendIcon size={13} />
                {stat.change}
              </span>
            </div>

            <p className="m-0 mt-5 text-sm font-medium text-gray-500">
              {stat.title}
            </p>

            <h3 className="m-0 mt-1 font-[family-name:var(--font-inter)] text-2xl font-extrabold tabular-nums tracking-tight text-[#17171B] sm:text-3xl">
              {stat.value}
            </h3>

            <p className="m-0 mt-2 text-xs text-gray-400">{stat.description}</p>
          </div>
        );
      })}
    </div>
  );
}
