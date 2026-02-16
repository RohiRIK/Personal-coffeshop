"use client";

import Link from "next/link";
import { useState } from "react";
import { UserMenu } from "components/auth/user-menu";
import { CartSidebar } from "components/cart/cart-sidebar";
import { useCart } from "contexts/cart-context";
import {
  Menu,
  X,
  Coffee,
  ClipboardList,
  ShoppingBag,
  Trophy,
  BookOpen,
} from "lucide-react";

export function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur-sm border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <span className="text-amber-400">Personal Coffeshop</span>
            <Coffee className="w-6 h-6 text-amber-500" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/menu"
              className="text-stone-300 hover:text-amber-400 text-sm font-medium transition-colors"
            >
              Menu
            </Link>
            <Link
              href="/orders"
              className="text-stone-300 hover:text-amber-400 text-sm font-medium transition-colors"
            >
              My Orders
            </Link>
            <Link
              href="/leaderboard"
              className="text-stone-300 hover:text-amber-400 text-sm font-medium transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/guestbook"
              className="text-stone-300 hover:text-amber-400 text-sm font-medium transition-colors"
            >
              Guestbook
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-300 hover:text-amber-400 transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-stone-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            <UserMenu />
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-300 hover:text-amber-400 transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-stone-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-stone-300 hover:text-amber-400 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-800 bg-stone-900">
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg text-stone-300 hover:bg-stone-800 hover:text-amber-400 transition-colors"
              >
                <Coffee className="w-5 h-5" />
                Menu
              </Link>
              <Link
                href="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg text-stone-300 hover:bg-stone-800 hover:text-amber-400 transition-colors"
              >
                <ClipboardList className="w-5 h-5" />
                My Orders
              </Link>
              <Link
                href="/leaderboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg text-stone-300 hover:bg-stone-800 hover:text-amber-400 transition-colors"
              >
                <Trophy className="w-5 h-5" />
                Leaderboard
              </Link>
              <Link
                href="/guestbook"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg text-stone-300 hover:bg-stone-800 hover:text-amber-400 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Guestbook
              </Link>
              <div className="pt-3 border-t border-stone-800">
                <UserMenu />
              </div>
            </div>
          </div>
        )}
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
