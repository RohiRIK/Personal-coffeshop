'use client';

import { useState, useEffect } from 'react';
import { getMenuItems, updateMenuItem } from 'lib/firebase/menu';
import { MenuItem } from 'lib/firebase/types';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Pencil, Plus } from 'lucide-react';

export default function MenuAdminPage() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const menuItems = await getMenuItems();
        // Sort by Category then Name
        menuItems.sort((a, b) => {
            if (a.category !== b.category) return a.category.localeCompare(b.category);
            return a.name.localeCompare(b.name);
        });
        setItems(menuItems);
        setLoading(false);
    };

    const toggleAvailability = async (item: MenuItem) => {
        try {
            // Optimistic update
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, available: !i.available } : i));
            await updateMenuItem(item.id, { available: !item.available });
            toast.success(`Updated ${item.name}`);
        } catch (error) {
            toast.error('Failed to update status');
            loadItems(); // Revert
        }
    };

    if (loading) return <div className="text-stone-400">Loading menu...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-stone-100">Menu Management</h1>
                <button
                    disabled
                    className="px-4 py-2 bg-stone-800 text-stone-500 rounded-xl font-medium cursor-not-allowed"
                >
                    + Add New Item (Coming Soon)
                </button>
            </div>

            <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-stone-800 text-stone-400 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4 font-medium">Item Name</th>
                            <th className="px-6 py-4 font-medium">Category</th>
                            <th className="px-6 py-4 font-medium">Price</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-stone-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-stone-200">{item.name}</td>
                                <td className="px-6 py-4 text-stone-400">
                                    <span className="px-2 py-1 rounded-md bg-stone-800 text-xs border border-stone-700">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-stone-300">${item.price.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${item.available
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                        {item.available
                                            ? <><CheckCircle2 className="w-3 h-3" /> Available</>
                                            : <><XCircle className="w-3 h-3" /> Sold Out</>
                                        }
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => toggleAvailability(item)}
                                        className={`text-sm font-medium transition-colors ${item.available ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'
                                            }`}
                                    >
                                        {item.available ? 'Mark Sold Out' : 'Mark Available'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
