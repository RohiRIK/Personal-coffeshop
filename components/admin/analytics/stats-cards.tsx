"use client";

import { DollarSign, ShoppingBag, CreditCard } from "lucide-react";

interface AnalyticsStatsCardsProps {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  loading: boolean;
}

export function AnalyticsStatsCards({
  totalRevenue,
  totalOrders,
  averageOrderValue,
  loading,
}: AnalyticsStatsCardsProps) {
  const stats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Average Order Value",
      value: `$${averageOrderValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: CreditCard,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-stone-800/50 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-stone-900 border border-stone-800 p-6 rounded-xl hover:border-stone-700 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-xs font-medium text-stone-500 bg-stone-800 px-2 py-1 rounded-full">
                Last 30 Days
              </span>
            </div>
            <div className="text-3xl font-bold text-stone-100 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-stone-500">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}
