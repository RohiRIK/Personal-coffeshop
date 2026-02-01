"use client";

import { useState } from "react";
import { useAdminOrders } from "hooks/use-admin-orders";
import { Order } from "lib/firebase/types";
import { formatDistanceToNow, format } from "date-fns";
import { OrderDetailsModal } from "components/admin/order-details-modal";
import {
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  List,
  History,
  Filter,
  Star,
} from "lucide-react";

export default function OrdersPage() {
  const { orders, loading, updateStatus } = useAdminOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewMode, setViewMode] = useState<"live" | "history">("live");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-stone-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading system...</span>
      </div>
    );
  }

  // Filter Orders
  const liveOrders = orders.filter((o) =>
    ["pending", "preparing", "ready"].includes(o.status),
  );
  const historyOrders = orders.filter((o) =>
    ["completed", "cancelled"].includes(o.status),
  );
  const activeList = viewMode === "live" ? liveOrders : historyOrders;

  // Sort: Live (Oldest First? No, Newest First usually better for "Just In")
  // Actually, for Kitchen, Oldest First (FIFO) is standard for Pending.
  // But let's keep it simple: Descending time (Newest top) for now as per hook default.

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-100 mb-1">
            {viewMode === "live" ? "Kitchen Display" : "Order History"}
          </h1>
          <p className="text-stone-400 text-sm flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${viewMode === "live" ? "bg-green-500 animate-pulse" : "bg-stone-500"}`}
            />
            {viewMode === "live" ? "Live System" : "Archive"} •{" "}
            {activeList.length} orders
          </p>
        </div>

        <div className="flex bg-stone-900 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setViewMode("live")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "live"
                ? "bg-stone-800 text-stone-100 shadow-sm"
                : "text-stone-500 hover:text-stone-300"
            }`}
          >
            <List className="w-4 h-4" /> Live Queue
          </button>
          <button
            onClick={() => setViewMode("history")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "history"
                ? "bg-stone-800 text-stone-100 shadow-sm"
                : "text-stone-500 hover:text-stone-300"
            }`}
          >
            <History className="w-4 h-4" /> Past Orders
          </button>
        </div>
      </div>

      <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-950 text-stone-400 text-xs uppercase tracking-wider sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-medium border-b border-stone-800">
                  Time
                </th>
                <th className="px-6 py-4 font-medium border-b border-stone-800">
                  Order ID
                </th>
                <th className="px-6 py-4 font-medium border-b border-stone-800">
                  Customer
                </th>
                <th className="px-6 py-4 font-medium border-b border-stone-800">
                  Items
                </th>
                <th className="px-6 py-4 font-medium border-b border-stone-800">
                  Total
                </th>
                <th className="px-6 py-4 font-medium border-b border-stone-800">
                  Status
                </th>
                <th className="px-6 py-4 font-medium border-b border-stone-800 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {activeList.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-stone-800/50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 text-stone-400 text-sm whitespace-nowrap">
                    <div>{format(order.createdAt, "h:mm a")}</div>
                    <div className="text-xs text-stone-600">
                      {formatDistanceToNow(order.createdAt, {
                        addSuffix: true,
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-500 font-mono text-xs">
                    #{order.id.slice(-4).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 font-medium text-stone-200">
                    {order.userName}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-stone-300 text-sm">
                      {order.items.length} items
                    </span>
                    <div className="text-xs text-stone-500 truncate max-w-[200px]">
                      {order.items.map((i) => i.name).join(", ")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-amber-500 font-bold font-mono">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={order.status} />
                      {order.rating && (
                        <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          <Star className="w-3 h-3 fill-current text-amber-500" />
                          <span className="text-xs font-bold text-amber-500">
                            {order.rating}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div
                      className="flex justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {order.status === "pending" && (
                        <ActionButton
                          onClick={() => updateStatus(order.id, "preparing")}
                          label="Prepare"
                          color="amber"
                        />
                      )}
                      {order.status === "preparing" && (
                        <ActionButton
                          onClick={() => updateStatus(order.id, "ready")}
                          label="Ready"
                          color="blue"
                        />
                      )}
                      {order.status === "ready" && (
                        <ActionButton
                          onClick={() => updateStatus(order.id, "completed")}
                          label="Complete"
                          color="green"
                        />
                      )}
                      {viewMode === "history" && (
                        <span className="text-stone-600 text-xs italic">
                          Archived
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {activeList.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-stone-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-8 h-8 opacity-20" />
                      <span>No orders found in {viewMode} view</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    preparing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    ready: "bg-green-500/10 text-green-500 border-green-500/20",
    completed: "bg-stone-500/10 text-stone-500 border-stone-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${styles[status as keyof typeof styles] || styles.completed}`}
    >
      {status}
    </span>
  );
}

function ActionButton({
  onClick,
  label,
  color,
}: {
  onClick: () => void;
  label: string;
  color: "amber" | "blue" | "green";
}) {
  const colors = {
    amber: "bg-amber-500 hover:bg-amber-400 text-stone-900",
    blue: "bg-blue-500 hover:bg-blue-400 text-white",
    green: "bg-green-500 hover:bg-green-400 text-white",
  };
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm ${colors[color]}`}
    >
      {label}
    </button>
  );
}
