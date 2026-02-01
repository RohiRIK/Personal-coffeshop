"use client";

import { useAuth } from "contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/login") {
      router.push("/login");
    }
  }, [user, loading, router, pathname]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in and not on login page, show nothing (redirect will happen)
  if (!user && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
