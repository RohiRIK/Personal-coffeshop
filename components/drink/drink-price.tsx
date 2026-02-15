"use client";

import { useSettings } from "contexts/settings-context";

export function DrinkPrice({ price }: { price: number }) {
  const { hidePrices } = useSettings();

  if (hidePrices) return null;

  return (
    <p className="text-2xl font-bold text-amber-400 mt-2">
      ${price.toFixed(2)}
    </p>
  );
}
