"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  data: { date: string; revenue: number; orders: number }[];
  loading: boolean;
}

export function RevenueChart({ data, loading }: RevenueChartProps) {
  if (loading) {
    return (
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl h-[400px] animate-pulse" />
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl h-[400px] flex items-center justify-center text-stone-500">
        No revenue data available for this period
      </div>
    );
  }

  return (
    <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl">
      <h3 className="text-lg font-bold text-stone-100 mb-6">Revenue Trends</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#44403c"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#a8a29e"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#a8a29e"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1c1917",
                border: "1px solid #44403c",
                borderRadius: "8px",
                color: "#f5f5f4",
              }}
              itemStyle={{ color: "#f59e0b" }}
              formatter={(value: any) => [
                `$${(value || 0).toFixed(2)}`,
                "Revenue",
              ]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
