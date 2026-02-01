"use client";

import { useAuth } from "contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "components/admin/sidebar";
import { Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Basic auth check - in production we'd check user.role === 'admin'
    // For now, we allow any logged in user but eventually we should enforce role
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-amber-500 animate-pulse">
          Loading Admin Portal...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-30 bg-stone-900 border-b border-stone-800 px-4 py-3 flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-stone-300 hover:text-amber-400 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">
          <span className="text-amber-400">Personal Coffeshop</span>
          <span className="text-stone-100">Admin</span>
        </h1>
      </div>

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content - offset for sidebar on desktop */}
      <main className="md:pl-64 p-4 md:p-8">{children}</main>
    </div>
  );
}
