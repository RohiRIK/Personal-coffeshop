"use client";

import { useAuth } from "contexts/auth-context";
import { useCart } from "contexts/cart-context";
import { useHidePrices } from "hooks/use-hide-prices";
import { createOrder } from "lib/firebase/orders";
import { OrderItem } from "lib/firebase/types";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, total, clearCart } = useCart();
  const { hidePrices } = useHidePrices();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Redirect if cart empty
  if (!authLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-stone-100 mb-4">
          Your cart is empty
        </h1>
        <Link
          href="/menu"
          className="px-6 py-3 bg-amber-500 text-stone-900 font-bold rounded-xl hover:bg-amber-400 transition-colors"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("You must be logged in to place an order");
      return;
    }

    setSubmitting(true);
    try {
      // Map cart items to order items - filter out undefined values for Firestore
      const orderItems: OrderItem[] = items.map((item) => {
        const orderItem: OrderItem = {
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        };
        if (item.options.milk) orderItem.milk = item.options.milk;
        if (item.options.cup) orderItem.cup = item.options.cup;
        if (item.options.sugar) orderItem.sugar = item.options.sugar;
        if (item.options.instructions)
          orderItem.specialInstructions = item.options.instructions;
        return orderItem;
      });

      const orderId = await createOrder(
        user.uid,
        user.displayName || user.email || "Guest",
        orderItems,
        user.email || undefined,
      );

      clearCart();
      toast.success("Order placed successfully!");

      // Navigate to success page with order ID
      router.push(`/order-success?orderId=${orderId}`);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/menu"
          className="text-amber-400 hover:text-amber-300 text-sm mb-6 inline-block"
        >
          ← Back to Menu
        </Link>

        <h1 className="text-3xl font-bold text-stone-100 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-stone-800 rounded-2xl p-6 border border-stone-700">
              <h2 className="text-xl font-bold text-stone-100 mb-4">
                Your Items
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-stone-900/50 rounded-xl"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-stone-800">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-stone-100">
                          {item.name}
                        </h3>
                        {!hidePrices && (
                          <span className="font-medium text-amber-400">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-stone-400">
                        Qty: {item.quantity}
                      </p>
                      <div className="text-xs text-stone-500 mt-1">
                        {item.options.milk && (
                          <span>{item.options.milk} • </span>
                        )}
                        {item.options.cup && <span>{item.options.cup} • </span>}
                        {item.options.sugar && (
                          <span>{item.options.sugar}</span>
                        )}
                        {item.options.instructions && (
                          <div className="italic mt-0.5">
                            "{item.options.instructions}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-stone-800 rounded-2xl p-6 border border-stone-700">
              <h2 className="text-xl font-bold text-stone-100 mb-4">
                User Details
              </h2>
              <div className="space-y-2 text-stone-300">
                <p>
                  <span className="text-stone-500">Name:</span>{" "}
                  {user?.displayName || "Guest"}
                </p>
                <p>
                  <span className="text-stone-500">Email:</span> {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Payment / Confirm */}
          <div className="md:col-span-1">
            <div className="bg-stone-800 rounded-2xl p-6 border border-stone-700 sticky top-24">
              <h2 className="text-xl font-bold text-stone-100 mb-4">Payment</h2>

              {!hidePrices && (
                <div className="space-y-2 mb-6 pb-6 border-b border-stone-700">
                  <div className="flex justify-between text-stone-400">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Tax (0%)</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-amber-400 pt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-300 mb-2">
                  Payment Method
                </label>
                <div className="p-3 bg-stone-900 border border-amber-500/30 rounded-lg text-amber-400 text-sm font-medium flex items-center gap-2">
                  <span>💵</span> Pay at Counter
                </div>
                <p className="text-xs text-stone-500 mt-2">
                  Please pay for your order when you pick it up at the counter.
                </p>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full py-4 rounded-xl font-bold text-lg bg-amber-500 hover:bg-amber-400 text-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/10"
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
