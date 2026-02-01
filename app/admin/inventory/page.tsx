"use client";

import { useInventory } from "hooks/use-inventory";
import { MILK_OPTIONS, CUP_OPTIONS } from "lib/constants";
import { Milk, Coffee } from "lucide-react";

export default function InventoryPage() {
  const { isAvailable, getQuantity, toggleAvailability, loading } = useInventory();

  if (loading) {
    return <div className="text-stone-400">Loading inventory...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
      <p className="text-stone-400 mb-8">
        Manage real-time availability and stock levels.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Milk Inventory */}
        <section className="bg-stone-900 rounded-2xl p-6 border border-stone-800">
          <h2 className="text-xl font-bold text-stone-100 mb-6 flex items-center gap-2">
            <Milk className="w-5 h-5 text-amber-500" />
            <span>Milk Options</span>
          </h2>
          <div className="space-y-4">
            {MILK_OPTIONS.map((item) => (
              <InventoryItemRow
                key={item.id}
                name={item.name}
                available={isAvailable(item.id)}
                quantity={getQuantity(item.id)}
                onToggle={() =>
                  toggleAvailability(item.id, isAvailable(item.id))
                }
              />
            ))}
          </div>
        </section>

        {/* Cup Inventory */}
        <section className="bg-stone-900 rounded-2xl p-6 border border-stone-800">
          <h2 className="text-xl font-bold text-stone-100 mb-6 flex items-center gap-2">
            <Coffee className="w-5 h-5 text-amber-500" />
            <span>Cup Options</span>
          </h2>
          <div className="space-y-4">
            {CUP_OPTIONS.map((item) => (
              <InventoryItemRow
                key={item.id}
                name={item.name}
                available={isAvailable(item.id)}
                quantity={getQuantity(item.id)}
                onToggle={() =>
                  toggleAvailability(item.id, isAvailable(item.id))
                }
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function InventoryItemRow({
  name,
  available,
  quantity,
  onToggle,
}: {
  name: string;
  available: boolean;
  quantity: number;
  onToggle: () => void;
}) {
  const isLowStock = quantity < 10 && quantity > 0;
  const isOutOfStock = quantity === 0;

  return (
    <div className="flex items-center justify-between p-4 bg-stone-800 rounded-xl border border-stone-700">
      <div>
        <div className="flex items-center gap-3">
          <span
            className={`font-medium ${available ? "text-stone-200" : "text-stone-500 line-through"}`}
          >
            {name}
          </span>
          {isLowStock && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/20 uppercase tracking-wide">
              Low Stock
            </span>
          )}
          {isOutOfStock && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 border border-red-500/20 uppercase tracking-wide">
              Out of Stock
            </span>
          )}
        </div>
        <div className="text-xs text-stone-500 mt-0.5 font-mono">
          {quantity} units remaining
        </div>
      </div>

      <button
        onClick={onToggle}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-stone-900 ${available ? "bg-green-500" : "bg-red-500"
          }`}
      >
        <span
          className={`${available ? "translate-x-7" : "translate-x-1"
            } inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}
        />
        <span className="sr-only">Toggle availability</span>
      </button>
    </div>
  );
}
