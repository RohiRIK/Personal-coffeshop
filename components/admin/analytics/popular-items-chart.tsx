"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PopularItemsChartProps {
  data: { name: string; count: number; revenue: number }[];
  loading: boolean;
}

export function PopularItemsChart({ data, loading }: PopularItemsChartProps) {
  if (loading) {
    return (
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl h-[400px] animate-pulse" />
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl h-[400px] flex items-center justify-center text-stone-500">
        No sales data available
      </div>
    );
  }

  return (
    <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl">
      <h3 className="text-lg font-bold text-stone-100 mb-6">Popular Items</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#44403c"
              horizontal={false}
            />
            <XAxis
              type="number"
              stroke="#a8a29e"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#a8a29e"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1c1917",
                border: "1px solid #44403c",
                borderRadius: "8px",
                color: "#f5f5f4",
              }}
              cursor={{ fill: "#292524" }}
            />
            <Bar
              dataKey="count"
              fill="#f59e0b"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
