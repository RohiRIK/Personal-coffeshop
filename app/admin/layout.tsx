"use client";

import { useAuth } from "contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar } from "components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

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
    <div className="min-h-screen bg-stone-950 text-stone-100 pl-64">
      <AdminSidebar />
      <main className="p-8">{children}</main>
    </div>
  );
}
