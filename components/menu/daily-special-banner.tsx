"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { onAppSettingsChange } from "lib/firebase/settings";
import { getMenuItem } from "lib/firebase/menu";
import type { MenuItem, AppSettings } from "lib/firebase/types";
import { Sparkles } from "lucide-react";

export function DailySpecialBanner() {
  const [special, setSpecial] = useState<{
    item: MenuItem;
    note: string;
  } | null>(null);

  useEffect(() => {
    const unsub = onAppSettingsChange(async (settings: AppSettings) => {
      if (settings.dailySpecialId) {
        try {
          const item = await getMenuItem(settings.dailySpecialId);
          if (item) {
            setSpecial({
              item,
              note: settings.dailySpecialNote || "Today's special pick!",
            });
          }
        } catch {
          setSpecial(null);
        }
      } else {
        setSpecial(null);
      }
    });
    return () => unsub();
  }, []);

  if (!special) return null;

  return (
    <Link href={`/drink/${special.item.id}`} className="block mb-8 group">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-amber-500/10 via-amber-500/5 to-stone-900 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300">
        <div className="flex items-center gap-4 p-4 md:p-6">
          {/* Image */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 ring-2 ring-amber-500/30 group-hover:ring-amber-500/60 transition-all">
            <Image
              src={special.item.imageUrl}
              alt={special.item.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                Barista&apos;s Pick
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-stone-100 group-hover:text-amber-400 transition-colors truncate">
              {special.item.name}
            </h3>
            <p className="text-sm text-stone-400 mt-1 line-clamp-1">
              {special.note}
            </p>
          </div>

          {/* Price */}
          <div className="shrink-0 text-right">
            <span className="text-2xl font-bold text-amber-400">
              ${special.item.price.toFixed(2)}
            </span>
            <p className="text-[10px] text-stone-500 uppercase tracking-wider mt-1">
              Order Now →
            </p>
          </div>
        </div>

        {/* Animated shimmer */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-amber-500/5 to-transparent animate-shimmer pointer-events-none" />
      </div>
    </Link>
  );
}
