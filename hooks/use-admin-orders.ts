"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "lib/firebase";
import { Order } from "lib/firebase/types";
import { updateOrderStatus } from "lib/firebase/orders";
import { toast } from "sonner";

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for orders from the last 24 hours (or just all active ones)
    // For simplicity, we'll listen to all active orders (not completed/cancelled)
    // OR just last 100. Let's do all for now as volume is low.

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newOrders: Order[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          newOrders.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate(),
          } as Order);
        });
        setOrders(newOrders);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to orders:", error);
        toast.error("Failed to sync orders");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const updateStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
      // Revert is handled by the snapshot listener eventually, but could be better
    }
  };

  return { orders, loading, updateStatus };
}
