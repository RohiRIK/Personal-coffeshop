"use client";

import { useHidePrices } from "hooks/use-hide-prices";

export function DrinkPrice({ price }: { price: number }) {
  const { hidePrices } = useHidePrices();

  if (hidePrices) return null;

  return (
    <p className="text-2xl font-bold text-amber-400 mt-2">
      ${price.toFixed(2)}
    </p>
  );
}
