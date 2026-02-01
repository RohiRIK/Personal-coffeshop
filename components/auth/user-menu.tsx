'use client';

import Link from 'next/link';
import { useAuth } from 'contexts/auth-context';

export function UserMenu() {
    const { user, loading, signOut } = useAuth();

    if (loading) {
        return (
            <div className="w-8 h-8 rounded-full bg-stone-700 animate-pulse" />
        );
    }

    if (!user) {
        return (
            <Link
                href="/login"
                className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-900 font-medium text-sm transition-colors"
            >
                Sign In
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-stone-100">{user.displayName}</p>
                <p className="text-xs text-stone-400">{user.email}</p>
            </div>
            <button
                onClick={() => signOut()}
                className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center hover:bg-amber-500/30 transition-colors"
            >
                {(user.displayName || user.email || 'Guest')?.[0]?.toUpperCase()}
            </button>
        </div>
    );
}
