"use client";

import { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "lib/firebase";
import { Order } from "lib/firebase/types";
import { updateOrderStatus } from "lib/firebase/orders";
import { toast } from "sonner";

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const previousOrderCountRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
  }, []);

  const playNotificationSound = () => {
    try {
      const ctx = audioContextRef.current;
      if (!ctx) return;

      // Create oscillator for "ding" sound
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Sound properties
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, ctx.currentTime); // High pitch
      oscillator.frequency.exponentialRampToValueAtTime(
        400,
        ctx.currentTime + 0.5,
      ); // Drop pitch

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log("Audio play failed:", e);
    }
  };

  useEffect(() => {
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

        // Check for new orders (only after initial load)
        if (previousOrderCountRef.current !== null) {
          const pendingOrders = newOrders.filter(
            (o) => o.status === "pending",
          ).length;
          const previousPendingOrders =
            previousOrderCountRef.current !== null
              ? orders.filter((o) => o.status === "pending").length
              : 0;

          if (pendingOrders > previousPendingOrders) {
            playNotificationSound();
            toast.success("🔔 New order received!", {
              description: "Check the orders queue",
              duration: 5000,
            });
          }
        }

        previousOrderCountRef.current = newOrders.length;
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

      // Trigger emails based on status change
      if (newStatus === "ready") {
        // Send "order ready" email
        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "ready", orderId }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              toast.success("📧 Ready email sent to customer");
            }
          })
          .catch(() => {
            // Silent fail - email is non-critical
          });
      }

      if (newStatus === "completed") {
        // Schedule rating email after 5 minutes
        toast.info("Rating email will be sent in 5 minutes");
        setTimeout(
          () => {
            fetch("/api/send-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: "rating", orderId }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                  console.log("Rating email sent for order:", orderId);
                }
              })
              .catch(() => {
                // Silent fail
              });
          },
          5 * 60 * 1000,
        ); // 5 minutes
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return { orders, loading, updateStatus };
}
