"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const datasets = {
  year: [
    { label: "Jan", sales: 18000 },
    { label: "Feb", sales: 24000 },
    { label: "Mar", sales: 21000 },
    { label: "Apr", sales: 32000 },
    { label: "May", sales: 28000 },
    { label: "Jun", sales: 39000 },
    { label: "Jul", sales: 35000 },
    { label: "Aug", sales: 45000 },
    { label: "Sep", sales: 42000 },
    { label: "Oct", sales: 51000 },
    { label: "Nov", sales: 58000 },
    { label: "Dec", sales: 64000 },
  ],
  month: [
    { label: "Week 1", sales: 12400 },
    { label: "Week 2", sales: 15800 },
    { label: "Week 3", sales: 14200 },
    { label: "Week 4", sales: 19600 },
  ],
  week: [
    { label: "Mon", sales: 3200 },
    { label: "Tue", sales: 4100 },
    { label: "Wed", sales: 3800 },
    { label: "Thu", sales: 5200 },
    { label: "Fri", sales: 6400 },
    { label: "Sat", sales: 7900 },
    { label: "Sun", sales: 6800 },
  ],
};

type Period = keyof typeof datasets;

export default function SalesChart() {
  const [period, setPeriod] = useState<Period>("year");
  const data = datasets[period];
  const periodTotal = data.reduce((sum, d) => sum + d.sales, 0);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="m-0 font-[family-name:var(--font-syne)] text-xl font-extrabold text-[#17171B]">
            Sales Overview
          </h2>
          <p className="m-0 mt-1 text-sm text-gray-500">
            Revenue total:{" "}
            <strong className="font-[family-name:var(--font-inter)] tabular-nums text-[#17171B]">
              ₹{periodTotal.toLocaleString("en-IN")}
            </strong>
          </p>
        </div>

        <select
          aria-label="Sales period"
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          className="cursor-pointer rounded-full border border-gray-200 bg-[#F7F8F5] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[#17171B] outline-none transition focus:border-[#78D94F]"
        >
          <option value="year">This Year</option>
          <option value="month">This Month</option>
          <option value="week">This Week</option>
        </select>
      </div>

      <div className="mt-7 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#78D94F" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#78D94F" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEEEEE" />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              tickFormatter={(value) => `₹${value / 1000}k`}
              width={55}
            />

            <Tooltip
              formatter={(value) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
                "Revenue",
              ]}
              contentStyle={{
                borderRadius: "14px",
                border: "1px solid #E5E7EB",
                backgroundColor: "#17171B",
                color: "#FFFFFF",
              }}
              itemStyle={{ color: "#78D94F", fontWeight: 700 }}
            />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#78D94F"
              strokeWidth={3}
              fill="url(#salesGradient)"
              activeDot={{ r: 6, fill: "#78D94F", stroke: "#17171B", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
