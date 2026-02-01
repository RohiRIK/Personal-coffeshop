"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "lib/firebase";
import { Order } from "lib/firebase/types";

interface CustomerInsights {
  totalSpent: number;
  orderCount: number;
  favoriteDrink: string;
  favoriteMilk: string;
  lastOrderDate: Date | null;
  isVip: boolean;
}

export function useCustomerInsights(userId: string | undefined) {
  const [insights, setInsights] = useState<CustomerInsights | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setInsights(null);
      return;
    }

    async function fetchInsights() {
      setLoading(true);
      try {
        // Fetch all past orders for this user
        const q = query(
          collection(db, "orders"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc"),
        );

        const snapshot = await getDocs(q);
        const orders: Order[] = [];
        snapshot.forEach((doc) => {
          orders.push({ id: doc.id, ...doc.data() } as Order);
        });

        if (orders.length === 0) {
          setInsights(null);
          return;
        }

        // Calculate Metrics
        const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
        const orderCount = orders.length;

        // Calculate Favorites
        const drinkCounts: Record<string, number> = {};
        const milkCounts: Record<string, number> = {};

        orders.forEach((order) => {
          order.items.forEach((item) => {
            // Count Drink
            drinkCounts[item.name] = (drinkCounts[item.name] || 0) + 1;

            // Count Milk (if applicable)
            if (item.milk) {
              milkCounts[item.milk] = (milkCounts[item.milk] || 0) + 1;
            }
          });
        });

        const getTop = (counts: Record<string, number>): string => {
          const entries = Object.entries(counts);
          if (entries.length === 0) return "None";
          const sorted = entries.sort((a, b) => b[1] - a[1]);
          return sorted[0]?.[0] ?? "None";
        };

        setInsights({
          totalSpent,
          orderCount,
          favoriteDrink: getTop(drinkCounts),
          favoriteMilk: getTop(milkCounts),
          lastOrderDate: orders[0]?.createdAt || null,
          isVip: totalSpent > 50, // Arbitrary VIP threshold
        });
      } catch (error) {
        console.error("Error fetching customer insights:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, [userId]);

  return { insights, loading };
}
