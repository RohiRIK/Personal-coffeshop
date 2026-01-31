'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from 'contexts/auth-context';
import {
    ClipboardList,
    Menu as MenuIcon,
    Package,
    Users,
    Home,
    LogOut
} from 'lucide-react';

export function AdminSidebar() {
    const pathname = usePathname();
    const { signOut } = useAuth();

    const links = [
        { href: '/admin/orders', label: 'Live Orders', icon: ClipboardList },
        { href: '/admin/menu', label: 'Menu', icon: MenuIcon },
        { href: '/admin/inventory', label: 'Inventory', icon: Package },
        { href: '/admin/customers', label: 'Customers', icon: Users },
    ];

    return (
        <div className="w-64 bg-stone-900 border-r border-stone-800 flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-xl font-bold">
                    <span className="text-amber-400">Brista</span>{' '}
                    <span className="text-stone-100">Admin</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {links.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-stone-800">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-stone-100 transition-colors mb-2">
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
    );
}
