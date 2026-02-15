"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "contexts/auth-context";
import {
  ClipboardList,
  Menu as MenuIcon,
  Package,
  Users,
  Home,
  LogOut,
  X,
  BarChart3,
  Eye,
  EyeOff,
} from "lucide-react";
import { useSettings } from "contexts/settings-context";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { hidePrices, toggleHidePrices } = useSettings();

  const links = [
    { href: "/admin/orders", label: "Live Orders", icon: ClipboardList },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/menu", label: "Menu", icon: MenuIcon },
    { href: "/admin/inventory", label: "Inventory", icon: Package },
    { href: "/admin/customers", label: "Customers", icon: Users },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`w-64 bg-stone-900 border-r border-stone-800 flex flex-col h-screen fixed left-0 top-0 z-50 transform transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            <span className="text-amber-400">Personal Coffeshop</span>
            <span className="text-stone-100">Admin</span>
          </h1>
          <button
            onClick={onClose}
            className="md:hidden p-2 text-stone-400 hover:text-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "text-stone-400 hover:bg-stone-800 hover:text-stone-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-800 space-y-3">
          {/* Hide Prices Toggle */}
          <button
            onClick={toggleHidePrices}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-stone-800/50 hover:bg-stone-800 transition-colors"
          >
            <div className="flex items-center gap-3 text-stone-300">
              {hidePrices ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">Hide Prices</span>
            </div>
            <div
              className={`relative w-10 h-5 rounded-full transition-colors ${
                hidePrices ? "bg-amber-500" : "bg-stone-600"
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  hidePrices ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
          </button>

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-stone-100 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Back to App</span>
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-stone-100 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
