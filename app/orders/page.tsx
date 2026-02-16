"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "contexts/auth-context";
import { db } from "lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { Order } from "lib/firebase/types";
import { formatDistanceToNow, format } from "date-fns";
import {
  Loader2,
  Package,
  Clock,
  CheckCircle2,
  Coffee,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RateOrderModal } from "components/orders/rate-order-modal";
import { Star } from "lucide-react";
import { useCustomerInsights } from "hooks/use-customer-insights";
import { VIPBadge } from "components/ui/vip-badge";
import { StampCard } from "components/loyalty/stamp-card";

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const router = useRouter();
  const { insights } = useCustomerInsights(user?.uid);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userOrders: Order[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const order: Order = {
          id: docSnap.id,
          userId: data.userId,
          userName: data.userName,
          items: data.items,
          total: data.total,
          status: data.status,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          rating: data.rating,
          review: data.review,
        };
        if (data.updatedAt) {
          order.updatedAt = data.updatedAt.toDate?.() || data.updatedAt;
        }
        userOrders.push(order);
      });
      setOrders(userOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const activeOrders = orders.filter((o) =>
    ["pending", "preparing", "ready"].includes(o.status),
  );
  const pastOrders = orders.filter((o) =>
    ["completed", "cancelled"].includes(o.status),
  );

  const ordersUntilVip = Math.max(0, 10 - (insights?.orderCount || 0));

  return (
    <div className="min-h-screen bg-stone-950 pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-stone-900 border-b border-stone-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-stone-100 flex items-center gap-3">
              My Orders
              {insights?.isVip && <VIPBadge />}
            </h1>
            {!insights?.isVip && ordersUntilVip > 0 && (
              <p className="text-xs text-amber-500/80 mt-1 font-medium">
                {ordersUntilVip} more orders to reach VIP status!
              </p>
            )}
          </div>
          <Link
            href="/menu"
            className="text-amber-500 hover:text-amber-400 text-sm font-medium flex items-center gap-1"
          >
            <Coffee className="w-4 h-4" />
            Order Now
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stamp Card */}
        <StampCard />

        {/* Active Orders Section */}
        {activeOrders.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              In Progress
            </h2>
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-stone-900 rounded-2xl p-6 border border-amber-500/20 shadow-lg shadow-amber-900/10 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4">
                    <StatusBadge status={order.status} size="large" />
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">
                      Order #{order.id.slice(-4)}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {order.status === "ready"
                        ? "Ready for Pickup"
                        : order.status === "preparing"
                          ? "Preparing your order..."
                          : "Order Received"}
                    </div>
                    <div className="text-stone-400 text-sm mt-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {formatDistanceToNow(order.createdAt, {
                        addSuffix: true,
                      })}
                    </div>
                  </div>

                  <div className="space-y-3 bg-stone-950/50 p-4 rounded-xl border border-stone-800">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-start text-sm"
                      >
                        <div className="flex gap-3">
                          <span className="font-bold text-stone-500">
                            {item.quantity}x
                          </span>
                          <div>
                            <span className="text-stone-200 block">
                              {item.name}
                            </span>
                            <span className="text-stone-500 text-xs text block">
                              {[item.milk, item.cup, item.sugar]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </div>
                        </div>
                        <span className="text-stone-500">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-3 mt-3 border-t border-stone-800 flex justify-between font-bold">
                      <span className="text-stone-400">Total</span>
                      <span className="text-amber-500">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Past Orders Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
              <HistoryIcon className="w-4 h-4" />
              Past Orders
            </h2>
          </div>

          <div className="space-y-3">
            {pastOrders.map((order) => (
              <div
                key={order.id}
                className="bg-stone-900/50 hover:bg-stone-900 transition-colors rounded-xl p-4 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between group gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-stone-800 shrink-0 overflow-hidden relative border border-stone-700">
                    {order.items[0]?.imageUrl ? (
                      <Image
                        src={order.items[0].imageUrl}
                        alt={order.items[0].name}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-500">
                        <Coffee className="w-6 h-6" />
                      </div>
                    )}
                    {order.items.length > 1 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold backdrop-blur-[1px]">
                        +{order.items.length - 1}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-stone-200 text-sm">
                      {order.items.map((i) => i.name).join(", ")}
                    </div>
                    <div className="text-xs text-stone-500 flex items-center gap-2">
                      <span>{format(order.createdAt, "MMM d, h:mm a")}</span>
                      <span>•</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:self-center self-end">
                  {order.status === "completed" && !order.rating && (
                    <button
                      onClick={() => setRatingOrder(order)}
                      className="text-xs font-bold text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 px-3 py-1.5 rounded-full transition-colors border border-amber-500/20"
                    >
                      Rate Order
                    </button>
                  )}
                  {order.rating && (
                    <div className="flex gap-0.5" title="You rated this order">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < order.rating!
                              ? "fill-amber-500 text-amber-500"
                              : "text-stone-700"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  <StatusBadge status={order.status} size="small" />
                </div>
              </div>
            ))}

            {pastOrders.length === 0 && orders.length > 0 && (
              <div className="text-stone-500 italic text-sm text-center py-8 bg-stone-900/30 rounded-xl">
                No past orders yet.
              </div>
            )}

            {orders.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-600">
                  <Package className="w-8 h-8 scale-x-[-1]" />
                </div>
                <h3 className="text-lg font-bold text-stone-300 mb-2">
                  No orders yet
                </h3>
                <p className="text-stone-500 mb-6 max-w-xs mx-auto">
                  Looks like you haven't tried our delicious coffee yet!
                </p>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-colors"
                >
                  Browse Menu <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      {ratingOrder && (
        <RateOrderModal
          order={ratingOrder}
          onClose={() => setRatingOrder(null)}
          onRatingSubmit={() => {
            // No need to refresh manually, onSnapshot will handle it
          }}
        />
      )}
    </div>
  );
}

function StatusBadge({
  status,
  size = "small",
}: {
  status: string;
  size?: "small" | "large";
}) {
  const styles = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    preparing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    ready: "bg-green-500 text-stone-950 border-green-500", // Solid green for visibility
    completed: "bg-stone-800 text-stone-400 border-stone-700",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const labels = {
    pending: "Pending",
    preparing: "Preparing",
    ready: "Ready for Pickup",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <span
      className={`
            inline-flex items-center justify-center rounded-full font-bold border uppercase tracking-wider
            ${styles[status as keyof typeof styles] || styles.completed}
            ${size === "large" ? "px-4 py-1.5 text-xs" : "px-2 py-0.5 text-[10px]"}
        `}
    >
      {labels[status as keyof typeof styles] || status}
    </span>
  );
}

function HistoryIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" />
      <path d="M3 3v9h9" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
