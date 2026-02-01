"use client";

import { useCart } from "contexts/cart-context";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, total } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-stone-900 border-l border-stone-700 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-100">Your Order</h2>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <span className="text-4xl mb-4">☕</span>
              <p className="text-stone-400 text-lg mb-4">Your cart is empty</p>
              <button
                onClick={onClose}
                className="text-amber-400 hover:text-amber-300 font-medium"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-stone-800 rounded-xl p-3 flex gap-4 border border-stone-700"
              >
                {/* Image (Small) */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-stone-700">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      ☕
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-stone-100 truncate pr-2">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-stone-500 hover:text-red-400 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="text-xs text-stone-400 space-y-0.5 mb-3">
                    {item.options.milk && <p>Milk: {item.options.milk}</p>}
                    {item.options.cup && <p>Cup: {item.options.cup}</p>}
                    {item.options.sugar && <p>Sugar: {item.options.sugar}</p>}
                    {item.options.instructions && (
                      <p className="italic truncated">
                        "{item.options.instructions}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-stone-900 rounded-lg p-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-amber-400 rounded transition-colors"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-amber-400 rounded transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-amber-400">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-stone-800 bg-stone-900">
            <div className="flex justify-between items-center mb-4">
              <span className="text-stone-400">Total</span>
              <span className="text-2xl font-bold text-amber-400">
                ${total.toFixed(2)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full py-4 rounded-xl font-bold text-lg bg-amber-500 hover:bg-amber-400 text-stone-900 text-center transition-colors active:scale-[0.98]"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
