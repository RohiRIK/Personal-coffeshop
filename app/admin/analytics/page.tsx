"use client";

import { useState } from "react";
import { useAnalytics } from "hooks/use-analytics";
import { AnalyticsStatsCards } from "components/admin/analytics/stats-cards";
import { RevenueChart } from "components/admin/analytics/revenue-chart";
import { PopularItemsChart } from "components/admin/analytics/popular-items-chart";
import { Calendar } from "lucide-react";

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    salesByDate,
    popularItems,
    loading,
  } = useAnalytics(days);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-100">Analytics</h1>
          <p className="text-stone-400 mt-1">
            Overview of your coffee shop's performance
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-xl p-1">
          {[7, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                days === d
                  ? "bg-stone-800 text-stone-100"
                  : "text-stone-400 hover:text-stone-300"
              }`}
            >
              Last {d} Days
            </button>
          ))}
          <div className="px-3 border-l border-stone-800 text-stone-500">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
      </div>

      <AnalyticsStatsCards
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
        averageOrderValue={averageOrderValue}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={salesByDate} loading={loading} />
        </div>
        <div>
          <PopularItemsChart data={popularItems} loading={loading} />
        </div>
      </div>
    </div>
  );
}
