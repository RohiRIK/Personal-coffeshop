"use client";

import { useState } from "react";
import { useAnalytics } from "hooks/use-analytics";
import { AnalyticsStatsCards } from "components/admin/analytics/stats-cards";
import { RevenueChart } from "components/admin/analytics/revenue-chart";
import { PopularItemsChart } from "components/admin/analytics/popular-items-chart";
import { Calendar, Download } from "lucide-react";
import { convertOrdersToCSV, downloadCSV } from "lib/utils/csv-export";
import { toast } from "sonner";

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    salesByDate,
    popularItems,
    recentOrders,
    loading,
  } = useAnalytics(days);

  const handleExport = () => {
    if (!recentOrders || recentOrders.length === 0) {
      toast.error("No orders to export for this period");
      return;
    }

    try {
      const csv = convertOrdersToCSV(recentOrders);
      const filename = `brista-sales-${days}days-${new Date().toISOString().split("T")[0]}.csv`;
      downloadCSV(csv, filename);
      toast.success("Sales report downloaded");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export report");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-100">Analytics</h1>
          <p className="text-stone-400 mt-1">
            Overview of your coffee shop's performance
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-500 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export CSV</span>
          </button>

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
