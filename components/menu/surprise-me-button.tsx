"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { MenuItem } from "lib/firebase/types";
import { Shuffle } from "lucide-react";

interface SurpriseMeButtonProps {
  items: MenuItem[];
}

export function SurpriseMeButton({ items }: SurpriseMeButtonProps) {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);
  const [displayName, setDisplayName] = useState("Surprise Me 🎲");
  const availableItems = items.filter((i) => i.available);

  const handleSurprise = useCallback(() => {
    if (spinning || availableItems.length === 0) return;
    setSpinning(true);

    // Rapid shuffle through names for the slot-machine effect
    let tick = 0;
    const maxTicks = 15;
    const interval = setInterval(() => {
      const rand =
        availableItems[Math.floor(Math.random() * availableItems.length)]!;
      setDisplayName(rand.name);
      tick++;

      if (tick >= maxTicks) {
        clearInterval(interval);

        // Final pick
        const winner =
          availableItems[Math.floor(Math.random() * availableItems.length)]!;
        setDisplayName(`🎉 ${winner.name}!`);

        // Navigate after a brief pause to show the result
        setTimeout(() => {
          router.push(`/drink/${winner.id}`);
          // Reset after navigation
          setTimeout(() => {
            setSpinning(false);
            setDisplayName("Surprise Me 🎲");
          }, 500);
        }, 800);
      }
    }, 80);
  }, [spinning, availableItems, router]);

  if (availableItems.length === 0) return null;

  return (
    <button
      onClick={handleSurprise}
      disabled={spinning}
      className={`
        group relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm
        transition-all duration-300 overflow-hidden
        ${
          spinning
            ? "bg-amber-500 text-stone-900 scale-105 shadow-lg shadow-amber-500/30"
            : "bg-stone-800 text-amber-400 hover:bg-stone-700 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/10"
        }
      `}
    >
      <Shuffle
        className={`w-4 h-4 transition-transform ${spinning ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
      />
      <span
        className={`min-w-[120px] text-center transition-all ${spinning ? "animate-pulse font-bold" : ""}`}
      >
        {displayName}
      </span>

      {/* Shimmer effect when spinning */}
      {spinning && (
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      )}
    </button>
  );
}
