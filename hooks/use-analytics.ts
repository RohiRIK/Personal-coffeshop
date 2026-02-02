import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "lib/firebase";
import { Order } from "lib/firebase/types";

interface DailySales {
  date: string;
  revenue: number;
  orders: number;
}

interface ItemPopularity {
  name: string;
  count: number;
  revenue: number;
}

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  salesByDate: DailySales[];
  popularItems: ItemPopularity[];
  loading: boolean;
  error: string | null;
}

export function useAnalytics(days = 30) {
  const [data, setData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    salesByDate: [],
    popularItems: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Calculate start date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          let totalRevenue = 0;
          let totalOrders = 0;
          const salesMap = new Map<
            string,
            { revenue: number; orders: number }
          >();
          const itemsMap = new Map<
            string,
            { count: number; revenue: number }
          >();

          // Initialize sales map with dates
          for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            salesMap.set(dateStr, { revenue: 0, orders: 0 });
          }

          snapshot.docs.forEach((doc) => {
            const order = { id: doc.id, ...doc.data() } as Order;
            const orderDate =
              order.createdAt instanceof Timestamp
                ? order.createdAt.toDate()
                : new Date();

            // Only count completed or ready orders within date range
            if (
              (order.status === "completed" || order.status === "ready") &&
              orderDate >= startDate
            ) {
              totalRevenue += order.total;
              totalOrders += 1;

              // Daily Sales
              const dateStr = orderDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
              if (salesMap.has(dateStr)) {
                const current = salesMap.get(dateStr)!;
                salesMap.set(dateStr, {
                  revenue: current.revenue + order.total,
                  orders: current.orders + 1,
                });
              }

              // Item Popularity
              order.items.forEach((item) => {
                const current = itemsMap.get(item.name) || {
                  count: 0,
                  revenue: 0,
                };
                itemsMap.set(item.name, {
                  count: current.count + item.quantity,
                  revenue: current.revenue + item.price * item.quantity,
                });
              });
            }
          });

          // Convert maps to arrays
          const salesByDate = Array.from(salesMap.entries())
            .map(([date, stats]) => ({ date, ...stats }))
            .reverse();

          const popularItems = Array.from(itemsMap.entries())
            .map(([name, stats]) => ({ name, ...stats }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5 items

          setData({
            totalRevenue,
            totalOrders,
            averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
            salesByDate,
            popularItems,
            loading: false,
            error: null,
          });
        } catch (err) {
          console.error("Error calculating analytics:", err);
          setData((prev) => ({
            ...prev,
            loading: false,
            error: "Failed to process analytics data",
          }));
        }
      },
      (err) => {
        console.error("Error fetching orders:", err);
        setData((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to fetch orders",
        }));
      },
    );

    return () => unsubscribe();
  }, [days]);

  return data;
}
