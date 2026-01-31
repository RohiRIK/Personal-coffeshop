'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from 'lib/firebase';
import { InventoryItem } from 'lib/firebase/types';
import { initializeInventory, updateInventoryStatus } from 'lib/firebase/inventory';
import { toast } from 'sonner';

export function useInventory() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Attempt initialization on first load sidebar
        initializeInventory();

        const q = query(collection(db, 'inventory'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: InventoryItem[] = [];
            snapshot.forEach((doc) => {
                items.push(doc.data() as InventoryItem);
            });
            setInventory(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const toggleAvailability = async (id: string, currentStatus: boolean) => {
        try {
            // Optimistic updatish - listener will catch up fast
            await updateInventoryStatus(id, !currentStatus);
            toast.success('Inventory updated');
        } catch (error) {
            toast.error('Failed to update inventory');
        }
    };

    const isAvailable = (id: string) => {
        const item = inventory.find(i => i.id === id);
        return item ? item.available : true; // Default to true if not found (or false?)
    };

    return { inventory, loading, toggleAvailability, isAvailable };
}
