"use client";

import { useState, useEffect } from "react";
import { useInventory } from "hooks/use-inventory";
import { MILK_OPTIONS, CUP_OPTIONS } from "lib/constants";
import { Milk, Coffee } from "lucide-react";

export default function InventoryPage() {
  const { isAvailable, getQuantity, toggleAvailability, updateStock, loading } =
    useInventory();

  if (loading) {
    return <div className="text-stone-400">Loading inventory...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
      <p className="text-stone-400 mb-8">
        Manage real-time availability and stock levels.
      </p>

      <div className="space-y-8">
        {/* Milk Inventory */}
        <section className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
          <div className="p-6 border-b border-stone-800 flex items-center gap-3">
            <div className="p-2 bg-stone-800 rounded-lg">
              <Milk className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-stone-100">Milk Options</h2>
          </div>
          <InventoryTable
            items={MILK_OPTIONS}
            isAvailable={isAvailable}
            getQuantity={getQuantity}
            onToggle={toggleAvailability}
            onUpdateStock={updateStock}
          />
        </section>

        {/* Cup Inventory */}
        <section className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
          <div className="p-6 border-b border-stone-800 flex items-center gap-3">
            <div className="p-2 bg-stone-800 rounded-lg">
              <Coffee className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-stone-100">Cup Options</h2>
          </div>
          <InventoryTable
            items={CUP_OPTIONS}
            isAvailable={isAvailable}
            getQuantity={getQuantity}
            onToggle={toggleAvailability}
            onUpdateStock={updateStock}
          />
        </section>
      </div>
    </div>
  );
}

interface InventoryItemData {
  id: string;
  name: string;
}

interface InventoryTableProps {
  items: InventoryItemData[];
  isAvailable: (id: string) => boolean;
  getQuantity: (id: string) => number;
  onToggle: (id: string, current: boolean) => void;
  onUpdateStock: (id: string, qty: number) => void;
}

function InventoryTable({
  items,
  isAvailable,
  getQuantity,
  onToggle,
  onUpdateStock,
}: InventoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-stone-950/50 text-stone-500 text-xs uppercase tracking-wider font-medium">
          <tr>
            <th className="px-6 py-4">Item Name</th>
            <th className="px-6 py-4">Stock Level</th>
            <th className="px-6 py-4 text-right">Availability</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-800">
          {items.map((item) => (
            <InventoryRow
              key={item.id}
              item={item}
              available={isAvailable(item.id)}
              quantity={getQuantity(item.id)}
              onToggle={() => onToggle(item.id, isAvailable(item.id))}
              onUpdateStock={(qty) => onUpdateStock(item.id, qty)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InventoryRow({
  item,
  available,
  quantity,
  onToggle,
  onUpdateStock,
}: {
  item: InventoryItemData;
  available: boolean;
  quantity: number;
  onToggle: () => void;
  onUpdateStock: (qty: number) => void;
}) {
  const isLowStock = quantity < 10 && quantity > 0;
  const isOutOfStock = quantity === 0;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(quantity.toString());

  useEffect(() => {
    if (!isEditing) setEditValue(quantity.toString());
  }, [quantity, isEditing]);

  const handleSave = () => {
    const val = parseInt(editValue);
    if (!isNaN(val) && val >= 0) {
      onUpdateStock(val);
    } else {
      setEditValue(quantity.toString());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditValue(quantity.toString());
      setIsEditing(false);
    }
  };

  return (
    <tr className="hover:bg-stone-800/30 transition-colors group">
      <td className="px-6 py-4">
        <div className="font-bold text-stone-200">{item.name}</div>
        <div className="text-xs text-stone-500 font-mono mt-0.5">
          ID: {item.id}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-20 bg-stone-950 border border-amber-500 rounded px-2 py-1 text-sm text-stone-100 focus:outline-none"
              />
              <span className="text-xs text-stone-500">Enter to save</span>
            </div>
          ) : (
            <div
              className="group/qty flex items-center gap-2 cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              <span
                className={`text-lg font-mono font-medium ${isOutOfStock ? "text-red-500" : isLowStock ? "text-amber-500" : "text-stone-300"}`}
              >
                {quantity}
              </span>
              <span className="text-xs text-stone-500 opacity-0 group-hover/qty:opacity-100 transition-opacity bg-stone-800 px-1.5 py-0.5 rounded">
                Edit
              </span>
            </div>
          )}

          <div className="flex gap-2">
            {isOutOfStock && (
              <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase font-bold tracking-wide">
                Out of Stock
              </span>
            )}
            {isLowStock && (
              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase font-bold tracking-wide">
                Low Stock
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            available ? "bg-green-500" : "bg-stone-700"
          }`}
        >
          <span
            className={`${
              available ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}
          />
          <span className="sr-only">Toggle availability</span>
        </button>
        <div className="text-[10px] text-stone-500 mt-1 font-medium uppercase tracking-wide">
          {available ? "Active" : "Disabled"}
        </div>
      </td>
    </tr>
  );
}
