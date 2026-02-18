import Link from "next/link";
import { getAvailableMenuItems } from "lib/firebase/menu";
import type { MenuItem } from "lib/firebase/types";
import { CATEGORIES } from "lib/constants";
import { MenuCard } from "components/menu/menu-card";
import { SurpriseMeButton } from "components/menu/surprise-me-button";
import { DailySpecialBanner } from "components/menu/daily-special-banner";

export const revalidate = 0; // Disable static caching for menu

export const metadata = {
  title: "Menu",
  description: "Browse our selection of hand-crafted beverages",
};

// Category filter component
function CategoryFilter({ activeCategory }: { activeCategory?: string }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.id}
          href={cat.path}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === cat.id || (!activeCategory && cat.id === "all")
              ? "bg-amber-500 text-stone-900"
              : "bg-stone-800 text-stone-300 hover:bg-stone-700"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}

export default async function MenuPage() {
  let menuItems: MenuItem[] = [];

  try {
    menuItems = await getAvailableMenuItems();
    // Redundant filter to ensure no sold-out items appear
    menuItems = menuItems.filter((item) => item.available);
  } catch (error) {
    console.error("Error loading menu:", error);
  }

  return (
    <div className="min-h-screen bg-stone-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="text-amber-400 hover:text-amber-300 text-sm mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-100">
            Our Menu
          </h1>
          <p className="text-stone-400 mt-3 text-lg">
            Hand-crafted beverages and artisanal pastries
          </p>
          <p className="text-sm text-stone-500 italic mt-2">
            Powered by caffeine and questionable life choices ☕
          </p>
        </div>

        {/* Daily Special */}
        <DailySpecialBanner />

        {/* Category Filter */}
        <CategoryFilter />

        {/* Surprise Me */}
        <div className="flex justify-center mb-8">
          <SurpriseMeButton items={menuItems} />
        </div>

        {/* Menu Grid */}
        {menuItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-stone-400 text-lg">Loading menu...</p>
          </div>
        )}
      </div>
    </div>
  );
}
