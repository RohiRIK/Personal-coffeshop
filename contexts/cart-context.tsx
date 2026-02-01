'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface CartItem {
    id: string;
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    options: {
        milk?: string;
        cup?: string;
        instructions?: string;
    };
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'id'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    count: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'personal_coffeshop_cart_v1';

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            if (savedCart) {
                setItems(JSON.parse(savedCart));
            }
        } catch (error) {
            console.error('Failed to load cart from local storage:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = (newItem: Omit<CartItem, 'id'>) => {
        setItems((prev) => {
            // Check for identical item to merge
            const existingItemIndex = prev.findIndex(item =>
                item.menuItemId === newItem.menuItemId &&
                item.options.milk === newItem.options.milk &&
                item.options.cup === newItem.options.cup &&
                item.options.instructions === newItem.options.instructions
            );

            if (existingItemIndex > -1) {
                const newItems = [...prev];
                const existingItem = newItems[existingItemIndex];
                if (existingItem) {
                    existingItem.quantity += newItem.quantity;
                }
                return newItems;
            }

            return [...prev, { ...newItem, id: Date.now().toString() + Math.random().toString(36).substr(2, 9) }];
        });
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(id);
            return;
        }
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                total,
                count,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
