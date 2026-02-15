"use client";

import { useState, useEffect } from "react";
import { getMenuItems, updateMenuItem, deleteMenuItem } from "lib/firebase/menu";
import { MenuItem } from "lib/firebase/types";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { MenuFormDialog } from "components/admin/menu/menu-form-dialog";

export default function MenuAdminPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const menuItems = await getMenuItems();
    // Sort by Category then Name
    menuItems.sort((a, b) => {
      if (a.category !== b.category)
        return a.category.localeCompare(b.category);
      return a.name.localeCompare(b.name);
    });
    setItems(menuItems);
    setLoading(false);
  };

  const toggleAvailability = async (item: MenuItem) => {
    try {
      // Optimistic update
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, available: !i.available } : i,
        ),
      );
      await updateMenuItem(item.id, { available: !item.available });
      toast.success(`Updated ${item.name}`);
    } catch (error) {
      toast.error("Failed to update status");
      loadItems(); // Revert
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    try {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      await deleteMenuItem(item.id);
      toast.success(`Deleted ${item.name}`);
    } catch (error) {
      toast.error("Failed to delete item");
      loadItems(); // Revert
    }
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  if (loading) return <div className="text-stone-400">Loading menu...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-stone-100">Menu Management</h1>
        <button
          onClick={openAddDialog}
          className="px-4 py-2 bg-amber-500 text-stone-900 rounded-xl font-bold hover:bg-amber-400 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add New Item
        </button>
      </div>

      <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-950/50 text-stone-400 text-sm uppercase">
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
              <tr
                key={item.id}
                className="hover:bg-stone-800/50 transition-colors group"
              >
                <td className="px-6 py-4 font-medium text-stone-200">
                  <div className="flex items-center gap-3">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-stone-800"
                      />
                    )}
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs text-stone-500 max-w-[200px] truncate">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-stone-400">
                  <span className="px-2 py-1 rounded-md bg-stone-950 border border-stone-800 text-xs font-mono">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-amber-500 font-mono font-bold">
                  ${item.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleAvailability(item)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${item.available
                      ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                      }`}
                  >
                    {item.available ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Available
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" /> Sold Out
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditDialog(item)}
                      className="p-2 text-stone-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                      title="Edit Item"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MenuFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={loadItems}
        itemToEdit={editingItem}
      />
    </div>
  );
}
