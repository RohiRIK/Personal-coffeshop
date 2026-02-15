"use client";

import Link from "next/link";
import Image from "next/image";
import type { MenuItem } from "lib/firebase/types";
import { useHidePrices } from "hooks/use-hide-prices";

export function MenuCard({ item }: { item: MenuItem }) {
  const { hidePrices } = useHidePrices();

  return (
    <Link
      href={`/drink/${item.id}`}
      className={`group relative bg-stone-800 rounded-xl overflow-hidden transition-all duration-300 
        ${
          item.available
            ? "hover:shadow-xl hover:shadow-amber-500/10 hover:scale-[1.02] cursor-pointer"
            : "opacity-60 cursor-not-allowed"
        }`}
    >
      <div className="aspect-square relative">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-cover transition-transform duration-500 ${
            item.available ? "group-hover:scale-110" : "grayscale"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Tag badge */}
        <div
          className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
            item.tag === "Hot" ? "bg-orange-500" : "bg-blue-500"
          }`}
        >
          {item.tag === "Hot" ? "🔥" : "❄️"} {item.tag}
        </div>

        {/* Sold out overlay */}
        {!item.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="px-4 py-2 border-2 border-red-500 text-red-500 font-bold rounded-lg">
              SOLD OUT
            </span>
          </div>
        )}

        {/* Price badge */}
        {!hidePrices && (
          <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-sm px-3 py-1 rounded-full border border-amber-500/20">
            <span className="text-amber-400 font-bold">
              ${item.price.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-400 transition-colors">
          {item.name}
        </h3>
        <p className="text-sm text-stone-400 mt-1 line-clamp-2">
          {item.description}
        </p>
        <p className="text-xs text-stone-500 mt-2">{item.category}</p>
      </div>
    </Link>
  );
}
