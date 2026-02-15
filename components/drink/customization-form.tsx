"use client";

import { useState } from "react";
import { MILK_OPTIONS, CUP_OPTIONS, SUGAR_OPTIONS } from "lib/constants";
import { useCart } from "contexts/cart-context";
import { useInventory } from "hooks/use-inventory";
import { useHidePrices } from "hooks/use-hide-prices";
import { toast } from "sonner";

interface CustomizationFormProps {
  menuItemId: string;
  imageUrl: string;
  price: number;
  itemName: string;
}

export function CustomizationForm({
  menuItemId,
  imageUrl,
  price,
  itemName,
}: CustomizationFormProps) {
  const { addItem } = useCart();
  const { isAvailable } = useInventory();
  const { hidePrices } = useHidePrices();
  const [selectedMilk, setSelectedMilk] = useState("whole");
  const [selectedCup, setSelectedCup] = useState("ceramic");
  const [selectedSugar, setSelectedSugar] = useState("none");
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");

  const handleAddToOrder = () => {
    addItem({
      menuItemId,
      name: itemName,
      price,
      quantity,
      imageUrl,
      options: {
        milk: MILK_OPTIONS.find((m) => m.id === selectedMilk)?.name,
        cup: CUP_OPTIONS.find((c) => c.id === selectedCup)?.name,
        sugar: SUGAR_OPTIONS.find((s) => s.id === selectedSugar)?.name,
        instructions: instructions || undefined,
      },
    });
    toast.success(`Added ${quantity}x ${itemName} to cart!`);
  };

  return (
    <div className="space-y-6">
      {/* Milk Selection */}
      <div>
        <h3 className="text-lg font-bold text-stone-100 mb-3">
          Choose Your Milk
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MILK_OPTIONS.map((milk) => {
            const available = isAvailable(milk.id);
            return (
              <button
                key={milk.id}
                onClick={() => available && setSelectedMilk(milk.id)}
                disabled={!available}
                className={`p-3 rounded-lg border-2 transition-all duration-200 relative overflow-hidden ${
                  selectedMilk === milk.id
                    ? "border-amber-500 bg-amber-500/20 text-amber-400"
                    : "border-stone-700 bg-stone-800 text-stone-300"
                } ${!available ? "opacity-50 cursor-not-allowed grayscale" : "hover:border-stone-600 hover:bg-stone-700"}`}
              >
                {milk.name}
                {!available && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/60 font-bold text-red-500 text-sm rotate-12">
                    SOLD OUT
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cup Selection */}
      <div>
        <h3 className="text-lg font-bold text-stone-100 mb-3">
          Choose Your Cup
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {CUP_OPTIONS.map((cup) => {
            const available = isAvailable(cup.id);
            return (
              <button
                key={cup.id}
                onClick={() => available && setSelectedCup(cup.id)}
                disabled={!available}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left relative overflow-hidden ${
                  selectedCup === cup.id
                    ? "border-amber-500 bg-amber-500/20"
                    : "border-stone-700 bg-stone-800"
                } ${!available ? "opacity-50 cursor-not-allowed grayscale" : "hover:border-stone-600 hover:bg-stone-700"}`}
              >
                <span
                  className={`block font-bold ${selectedCup === cup.id ? "text-amber-400" : "text-stone-100"}`}
                >
                  {cup.name}
                </span>
                <span className="text-sm text-stone-400">
                  {cup.description}
                </span>
                {!available && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/60 font-bold text-red-500 text-lg -rotate-12">
                    OUT OF STOCK
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-stone-500 mt-2">
          🌱 We only serve in reusable cups to reduce waste
        </p>
      </div>

      {/* Sugar Level */}
      <div>
        <h3 className="text-lg font-bold text-stone-100 mb-3">Sugar Level</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SUGAR_OPTIONS.map((sugar) => (
            <button
              key={sugar.id}
              onClick={() => setSelectedSugar(sugar.id)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                selectedSugar === sugar.id
                  ? "border-amber-500 bg-amber-500/20 text-amber-400"
                  : "border-stone-700 bg-stone-800 text-stone-300 hover:border-stone-600 hover:bg-stone-700"
              }`}
            >
              <span className="flex justify-center gap-0.5 mb-1">
                {sugar.level === 0 ? (
                  <span className="w-2 h-2 rounded-full border border-stone-500" />
                ) : (
                  Array.from({ length: sugar.level }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        selectedSugar === sugar.id
                          ? "bg-amber-400"
                          : "bg-stone-500"
                      }`}
                    />
                  ))
                )}
              </span>
              <span className="text-xs font-medium">{sugar.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <h3 className="text-lg font-bold text-stone-100 mb-3">Quantity</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-full bg-stone-800 text-stone-100 text-xl hover:bg-stone-700 transition-colors active:scale-95"
          >
            -
          </button>
          <span className="text-2xl font-bold text-stone-100 w-12 text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-full bg-stone-800 text-stone-100 text-xl hover:bg-stone-700 transition-colors active:scale-95"
          >
            +
          </button>
        </div>
      </div>

      {/* Special Instructions */}
      <div>
        <h3 className="text-lg font-bold text-stone-100 mb-3">
          Special Instructions
        </h3>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          maxLength={100}
          placeholder="Any special requests? (optional, max 100 chars)"
          className="w-full p-3 rounded-lg bg-stone-800 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 resize-none transition-colors"
          rows={3}
        />
        <p className="text-right text-xs text-stone-500 mt-1">
          {instructions.length}/100
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
        <h4 className="font-bold text-stone-100 mb-2">Summary</h4>
        <div className="text-sm text-stone-300 space-y-1">
          <p>
            • {quantity}x {itemName}
          </p>
          <p>• {MILK_OPTIONS.find((m) => m.id === selectedMilk)?.name}</p>
          <p>• {CUP_OPTIONS.find((c) => c.id === selectedCup)?.name}</p>
          <p>
            • Sugar: {SUGAR_OPTIONS.find((s) => s.id === selectedSugar)?.name}
          </p>
          {instructions && (
            <p className="italic text-stone-400">"{instructions}"</p>
          )}
        </div>
        {!hidePrices && (
          <div className="mt-4 pt-4 border-t border-stone-700 flex justify-between items-center">
            <span className="font-medium text-stone-300">Total Price</span>
            <span className="text-xl font-bold text-amber-400">
              ${(price * quantity).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Add to Order Button */}
      <button
        onClick={handleAddToOrder}
        disabled={quantity < 1 || quantity > 10}
        className="w-full py-4 rounded-xl font-bold text-lg bg-amber-500 hover:bg-amber-400 text-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        Add to Order
      </button>
    </div>
  );
}
