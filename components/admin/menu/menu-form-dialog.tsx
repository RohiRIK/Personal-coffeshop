"use client";

import { useState, useEffect } from "react";
import { MenuItem } from "lib/firebase/types";
import { addMenuItem, updateMenuItem } from "lib/firebase/menu";
import { toast } from "sonner";
import { X, Save, Loader2, Upload } from "lucide-react";

interface MenuFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    itemToEdit?: MenuItem | null;
}

const CATEGORIES = ["Coffee", "Iced", "Non-Coffee", "Dessert"] as const;
const TAGS = ["Hot", "Cold"] as const;

export function MenuFormDialog({
    isOpen,
    onClose,
    onSuccess,
    itemToEdit,
}: MenuFormDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<MenuItem>>({
        name: "",
        description: "",
        price: 0,
        category: "Coffee",
        imageUrl: "",
        tag: "Hot",
        available: true,
    });

    // Reset or populate form when dialog opens/changes
    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                setFormData(itemToEdit);
            } else {
                setFormData({
                    name: "",
                    description: "",
                    price: 0,
                    category: "Coffee",
                    imageUrl: "",
                    tag: "Hot",
                    available: true,
                });
            }
        }
    }, [isOpen, itemToEdit]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.name || !formData.price || !formData.category) {
                toast.error("Please fill in all required fields");
                setLoading(false);
                return;
            }

            const itemData = {
                name: formData.name,
                description: formData.description || "",
                price: Number(formData.price),
                category: formData.category as MenuItem["category"],
                imageUrl: formData.imageUrl || "/placeholder-drink.png",
                tag: formData.tag as MenuItem["tag"],
                available: formData.available ?? true,
            };

            if (itemToEdit) {
                await updateMenuItem(itemToEdit.id, itemData);
                toast.success("Item updated successfully");
            } else {
                await addMenuItem(itemData);
                toast.success("New item added successfully");
            }

            onSuccess();
            onClose();
        } catch (error) {
            toast.error("Failed to save item");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-stone-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-stone-100">
                        {itemToEdit ? "Edit Item" : "Add New Item"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-stone-400 hover:text-stone-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-medium text-stone-400">Name</label>
                            <input
                                required
                                type="text"
                                value={formData.name || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-stone-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                placeholder="e.g. Camel Latte"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-400">
                                Price ($)
                            </label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, price: parseFloat(e.target.value) })
                                }
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-stone-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-400">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category: e.target.value as MenuItem["category"],
                                    })
                                }
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-stone-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 appearance-none"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-medium text-stone-400">
                                Description
                            </label>
                            <textarea
                                value={formData.description || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                rows={3}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-stone-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                                placeholder="Brief description of the drink..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-400">Tag</label>
                            <div className="flex gap-2">
                                {TAGS.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() =>
                                            setFormData({ ...formData, tag: tag as MenuItem["tag"] })
                                        }
                                        className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-colors ${formData.tag === tag
                                                ? "bg-amber-500/10 text-amber-500 border-amber-500/50"
                                                : "bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800"
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-400">
                                Image URL
                            </label>
                            <div className="relative">
                                <input
                                    type="url"
                                    value={formData.imageUrl || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, imageUrl: e.target.value })
                                    }
                                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-stone-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                                    placeholder="https://..."
                                />
                                <Upload className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-stone-800 text-stone-300 rounded-xl font-medium hover:bg-stone-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-amber-500 text-stone-900 rounded-xl font-bold hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Item
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
