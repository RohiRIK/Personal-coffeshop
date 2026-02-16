"use client";

import { useState, useEffect, useMemo } from "react";
import { getOrders } from "lib/firebase/orders";
import Link from "next/link";
import { Crown, Medal, Trophy, Coffee, ArrowLeft, Flame } from "lucide-react";

interface LeaderboardEntry {
  userId: string;
  name: string;
  orderCount: number;
  totalSpent: number;
  favoriteDrink: string;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const allOrders = await getOrders();
        const customerMap = new Map<
          string,
          LeaderboardEntry & { drinkCounts: Record<string, number> }
        >();

        allOrders.forEach((order) => {
          const existing = customerMap.get(order.userId);
          const drinkCounts: Record<string, number> = {};
          order.items.forEach((item) => {
            drinkCounts[item.name] =
              (drinkCounts[item.name] || 0) + item.quantity;
          });

          if (existing) {
            existing.orderCount += 1;
            existing.totalSpent += order.total;
            Object.entries(drinkCounts).forEach(([drink, count]) => {
              existing.drinkCounts[drink] =
                (existing.drinkCounts[drink] || 0) + count;
            });
          } else {
            customerMap.set(order.userId, {
              userId: order.userId,
              name: order.userName || "Mystery Drinker",
              orderCount: 1,
              totalSpent: order.total,
              favoriteDrink: "",
              drinkCounts,
            });
          }
        });

        const processed = Array.from(customerMap.values())
          .map((c) => {
            const topDrink = Object.entries(c.drinkCounts).sort(
              (a, b) => b[1] - a[1],
            )[0];
            return {
              userId: c.userId,
              name: c.name,
              orderCount: c.orderCount,
              totalSpent: c.totalSpent,
              favoriteDrink: topDrink ? topDrink[0] : "—",
            };
          })
          .sort((a, b) => b.orderCount - a.orderCount);

        setEntries(processed);
      } catch (error) {
        console.error("Error loading leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Crown className="w-6 h-6 text-amber-400" />;
    if (rank === 1) return <Medal className="w-5 h-5 text-stone-300" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-amber-700" />;
    return (
      <span className="text-sm font-bold text-stone-500">#{rank + 1}</span>
    );
  };

  const getRankColors = (rank: number) => {
    if (rank === 0)
      return "bg-amber-500/10 border-amber-500/30 ring-1 ring-amber-500/20";
    if (rank === 1) return "bg-stone-800/50 border-stone-600/30";
    if (rank === 2) return "bg-amber-900/10 border-amber-700/20";
    return "bg-stone-900 border-stone-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Trophy className="w-12 h-12 text-stone-700" />
          <p className="text-stone-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Link
            href="/menu"
            className="text-amber-400 hover:text-amber-300 text-sm mb-4 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Menu
          </Link>
          <div className="flex items-center justify-center gap-3 mb-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-bold text-stone-100">Leaderboard</h1>
          </div>
          <p className="text-stone-400">
            {entries.length} caffeine warrior{entries.length !== 1 && "s"}{" "}
            ranked
          </p>
        </div>

        {/* Podium — Top 3 */}
        {entries.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-10">
            {/* 2nd place */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-stone-700 flex items-center justify-center text-xl font-bold text-stone-300 mb-2">
                {entries[1]!.name.charAt(0).toUpperCase()}
              </div>
              <Medal className="w-5 h-5 text-stone-400 mb-1" />
              <p className="text-sm font-bold text-stone-300 truncate max-w-[100px]">
                {entries[1]!.name}
              </p>
              <p className="text-xs text-stone-500">
                {entries[1]!.orderCount} orders
              </p>
              <div className="w-20 h-20 bg-stone-700/50 rounded-t-lg mt-2" />
            </div>

            {/* 1st place */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center text-2xl font-bold text-amber-400 mb-2 ring-2 ring-amber-500/40">
                {entries[0]!.name.charAt(0).toUpperCase()}
              </div>
              <Crown className="w-6 h-6 text-amber-400 mb-1" />
              <p className="text-sm font-bold text-amber-400 truncate max-w-[120px]">
                {entries[0]!.name}
              </p>
              <p className="text-xs text-amber-500/70">
                {entries[0]!.orderCount} orders
              </p>
              <div className="w-24 h-28 bg-amber-500/10 rounded-t-lg mt-2 border-x border-t border-amber-500/20" />
            </div>

            {/* 3rd place */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-amber-900/20 flex items-center justify-center text-xl font-bold text-amber-700 mb-2">
                {entries[2]!.name.charAt(0).toUpperCase()}
              </div>
              <Medal className="w-5 h-5 text-amber-700 mb-1" />
              <p className="text-sm font-bold text-stone-400 truncate max-w-[100px]">
                {entries[2]!.name}
              </p>
              <p className="text-xs text-stone-500">
                {entries[2]!.orderCount} orders
              </p>
              <div className="w-20 h-14 bg-amber-900/10 rounded-t-lg mt-2" />
            </div>
          </div>
        )}

        {/* Full Rankings */}
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01] ${getRankColors(i)}`}
            >
              <div className="w-8 flex items-center justify-center shrink-0">
                {getRankIcon(i)}
              </div>

              <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-sm font-bold text-stone-300 shrink-0">
                {entry.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-stone-200 truncate">
                  {entry.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <Coffee className="w-3 h-3" />
                  <span>{entry.favoriteDrink}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Flame className="w-4 h-4" />
                  <span>{entry.orderCount}</span>
                </div>
                <p className="text-[10px] text-stone-500">orders</p>
              </div>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="text-center py-16 text-stone-500">
              <Coffee className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-lg">No orders yet!</p>
              <p className="text-sm mt-1">
                Start ordering to claim the top spot.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
