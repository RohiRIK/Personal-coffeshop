'use client';

import Link from 'next/link';
import { useState } from 'react';
import { UserMenu } from 'components/auth/user-menu';
import { CartSidebar } from 'components/cart/cart-sidebar';
import { useCart } from 'contexts/cart-context';

export function Navbar() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { count } = useCart();

    return (
        <>
            <nav className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur-sm border-b border-stone-800">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold">
                        <span className="text-amber-400">Personal Coffeshop</span>{' '}
                        <span className="text-stone-100">Coffee</span>
                    </Link>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link
                            href="/menu"
                            className="text-stone-300 hover:text-amber-400 text-sm font-medium transition-colors hidden sm:block"
                        >
                            Menu
                        </Link>
                        <Link
                            href="/orders"
                            className="text-stone-300 hover:text-amber-400 text-sm font-medium transition-colors hidden sm:block"
                        >
                            My Orders
                        </Link>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 text-stone-300 hover:text-amber-400 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {count > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-stone-900 text-xs font-bold rounded-full flex items-center justify-center">
                                    {count}
                                </span>
                            )}
                        </button>

                        <UserMenu />
                    </div>
                </div>
            </nav>

            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}
