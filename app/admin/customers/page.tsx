"use client";

import { useState, useEffect, useMemo } from "react";
import { getOrders } from "lib/firebase/orders";
import { Order } from "lib/firebase/types";
import { formatDistanceToNow, format, subDays, isAfter } from "date-fns";
import {
  Users,
  DollarSign,
  TrendingUp,
  Crown,
  Star,
  ShoppingBag,
  Search,
  ArrowUpDown,
} from "lucide-react";

interface CustomerMetric {
  userId: string;
  name: string;
  email?: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: Date;
  firstOrderDate: Date;
  favoriteDrink: string;
  isVip: boolean;
  averageOrderValue: number;
}

type SortField = "totalSpent" | "orderCount" | "lastOrderDate" | "name";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("totalSpent");
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    async function loadData() {
      const allOrders = await getOrders();
      const customerMap = new Map<
        string,
        CustomerMetric & { drinkCounts: Record<string, number> }
      >();

      allOrders.forEach((order) => {
        const existing = customerMap.get(order.userId);

        // Count drinks per order
        const drinkCounts: Record<string, number> = {};
        order.items.forEach((item) => {
          drinkCounts[item.name] =
            (drinkCounts[item.name] || 0) + item.quantity;
        });

        if (existing) {
          existing.totalSpent += order.total;
          existing.orderCount += 1;
          if (order.createdAt > existing.lastOrderDate) {
            existing.lastOrderDate = order.createdAt;
          }
          if (order.createdAt < existing.firstOrderDate) {
            existing.firstOrderDate = order.createdAt;
          }
          // Merge drink counts
          Object.entries(drinkCounts).forEach(([drink, count]) => {
            existing.drinkCounts[drink] =
              (existing.drinkCounts[drink] || 0) + count;
          });
          // Update email if available
          if (order.userEmail && !existing.email) {
            existing.email = order.userEmail;
          }
        } else {
          customerMap.set(order.userId, {
            userId: order.userId,
            name: order.userName || "Unknown Guest",
            email: order.userEmail,
            totalSpent: order.total,
            orderCount: 1,
            lastOrderDate: order.createdAt,
            firstOrderDate: order.createdAt,
            favoriteDrink: "",
            isVip: false,
            averageOrderValue: 0,
            drinkCounts,
          });
        }
      });

      // Post-process: calculate favorites, VIP, avg
      const processed = Array.from(customerMap.values()).map((c) => {
        const topDrink = Object.entries(c.drinkCounts).sort(
          (a, b) => b[1] - a[1],
        )[0];
        return {
          userId: c.userId,
          name: c.name,
          email: c.email,
          totalSpent: c.totalSpent,
          orderCount: c.orderCount,
          lastOrderDate: c.lastOrderDate,
          firstOrderDate: c.firstOrderDate,
          favoriteDrink: topDrink ? topDrink[0] : "—",
          isVip: c.orderCount >= 10 || c.totalSpent >= 100,
          averageOrderValue: c.totalSpent / c.orderCount,
        };
      });

      setCustomers(processed);
      setLoading(false);
    }

    loadData();
  }, []);

  // Derived stats
  const stats = useMemo(() => {
    if (customers.length === 0) return null;
    const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
    const totalOrders = customers.reduce((s, c) => s + c.orderCount, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const vipCount = customers.filter((c) => c.isVip).length;
    const activeRecently = customers.filter((c) =>
      isAfter(c.lastOrderDate, subDays(new Date(), 7)),
    ).length;
    const avgLifetimeValue =
      customers.length > 0 ? totalRevenue / customers.length : 0;

    return {
      totalCustomers: customers.length,
      totalRevenue,
      avgOrderValue,
      vipCount,
      activeRecently,
      avgLifetimeValue,
    };
  }, [customers]);

  // Sort & filter
  const displayed = useMemo(() => {
    let filtered = customers;
    if (search) {
      const q = search.toLowerCase();
      filtered = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          c.favoriteDrink.toLowerCase().includes(q),
      );
    }

    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = a.name.localeCompare(b.name);
      else if (sortBy === "totalSpent") cmp = a.totalSpent - b.totalSpent;
      else if (sortBy === "orderCount") cmp = a.orderCount - b.orderCount;
      else if (sortBy === "lastOrderDate")
        cmp = a.lastOrderDate.getTime() - b.lastOrderDate.getTime();
      return sortDesc ? -cmp : cmp;
    });
  }, [customers, search, sortBy, sortDesc]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(field);
      setSortDesc(true);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-stone-800 rounded-lg" />
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 bg-stone-900 rounded-2xl border border-stone-800"
              />
            ))}
          </div>
          <div className="h-96 bg-stone-900 rounded-2xl border border-stone-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-100">
            Customer Analytics
          </h1>
          <p className="text-stone-400 mt-1">
            {customers.length} customer{customers.length !== 1 && "s"} tracked
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            icon={<Users className="w-4 h-4" />}
            label="Total Customers"
            value={stats.totalCustomers.toString()}
          />
          <StatCard
            icon={<DollarSign className="w-4 h-4" />}
            label="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(0)}`}
          />
          <StatCard
            icon={<ShoppingBag className="w-4 h-4" />}
            label="Avg. Order"
            value={`$${stats.avgOrderValue.toFixed(2)}`}
          />
          <StatCard
            icon={<TrendingUp className="w-4 h-4" />}
            label="Avg. LTV"
            value={`$${stats.avgLifetimeValue.toFixed(2)}`}
          />
          <StatCard
            icon={<Crown className="w-4 h-4" />}
            label="VIP Customers"
            value={stats.vipCount.toString()}
            highlight
          />
          <StatCard
            icon={<Star className="w-4 h-4" />}
            label="Active (7d)"
            value={stats.activeRecently.toString()}
          />
        </div>
      )}

      {/* Search + Table */}
      <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-stone-800">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, email, or drink..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-sm text-stone-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-950/50 text-stone-500 text-xs uppercase tracking-wider font-medium">
              <tr>
                <SortableHeader
                  label="Customer"
                  field="name"
                  current={sortBy}
                  desc={sortDesc}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Orders"
                  field="orderCount"
                  current={sortBy}
                  desc={sortDesc}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Lifetime Value"
                  field="totalSpent"
                  current={sortBy}
                  desc={sortDesc}
                  onSort={handleSort}
                />
                <th className="px-6 py-4">Favorite Drink</th>
                <SortableHeader
                  label="Last Seen"
                  field="lastOrderDate"
                  current={sortBy}
                  desc={sortDesc}
                  onSort={handleSort}
                />
                <th className="px-6 py-4">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {displayed.map((customer, i) => (
                <tr
                  key={customer.userId}
                  className="hover:bg-stone-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          customer.isVip
                            ? "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50"
                            : "bg-stone-800 text-stone-400"
                        }`}
                      >
                        {customer.isVip ? (
                          <Crown className="w-4 h-4" />
                        ) : (
                          customer.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-stone-200 flex items-center gap-2">
                          {customer.name}
                          {customer.isVip && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase font-bold tracking-wide">
                              VIP
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-stone-500">
                          {customer.email || customer.userId.slice(0, 12) + "…"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-stone-300 font-medium">
                      {customer.orderCount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-amber-400 font-bold">
                      ${customer.totalSpent.toFixed(2)}
                    </span>
                    <div className="text-[10px] text-stone-500">
                      avg ${customer.averageOrderValue.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-stone-300 text-sm">
                      {customer.favoriteDrink}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-stone-400 text-sm">
                    {formatDistanceToNow(customer.lastOrderDate, {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="px-6 py-4 text-stone-500 text-sm">
                    {format(customer.firstOrderDate, "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
              {displayed.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-stone-500"
                  >
                    {search
                      ? "No customers match your search."
                      : "No customer data yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function StatCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-2xl border ${
        highlight
          ? "bg-amber-500/5 border-amber-500/20"
          : "bg-stone-900 border-stone-800"
      }`}
    >
      <div
        className={`flex items-center gap-2 mb-2 ${
          highlight ? "text-amber-500" : "text-stone-500"
        }`}
      >
        {icon}
        <span className="text-[10px] uppercase tracking-wider font-medium">
          {label}
        </span>
      </div>
      <p
        className={`text-2xl font-bold ${
          highlight ? "text-amber-400" : "text-stone-100"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SortableHeader({
  label,
  field,
  current,
  desc,
  onSort,
}: {
  label: string;
  field: SortField;
  current: SortField;
  desc: boolean;
  onSort: (field: SortField) => void;
}) {
  const active = current === field;
  return (
    <th className="px-6 py-4">
      <button
        onClick={() => onSort(field)}
        className={`flex items-center gap-1 hover:text-stone-300 transition-colors ${
          active ? "text-amber-500" : ""
        }`}
      >
        {label}
        <ArrowUpDown className="w-3 h-3" />
        {active && <span className="text-[9px]">{desc ? "↓" : "↑"}</span>}
      </button>
    </th>
  );
}
