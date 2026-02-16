"use client";

import { useState, useEffect } from "react";
import { updateAppSettings, onAppSettingsChange } from "lib/firebase/settings";
import { getMenuItems } from "lib/firebase/menu";
import type { MenuItem, AppSettings } from "lib/firebase/types";
import { Sparkles, X } from "lucide-react";
import { toast } from "sonner";

interface DailySpecialDialogProps {
  open: boolean;
  onClose: () => void;
}

export function DailySpecialDialog({ open, onClose }: DailySpecialDialogProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    // Load menu items
    getMenuItems().then((items) =>
      setMenuItems(items.filter((i) => i.available)),
    );

    // Load current special
    const unsub = onAppSettingsChange((settings: AppSettings) => {
      setSelectedId(settings.dailySpecialId || "");
      setNote(settings.dailySpecialNote || "");
    });
    return () => unsub();
  }, [open]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateAppSettings({
        dailySpecialId: selectedId || undefined,
        dailySpecialNote: note || undefined,
      });
      toast.success(
        selectedId ? "Daily special set!" : "Daily special cleared!",
      );
      onClose();
    } catch {
      toast.error("Failed to update daily special");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-md p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-stone-100">
              Set Daily Special
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drink selector */}
        <div>
          <label className="block text-sm text-stone-400 mb-1">
            Featured Drink
          </label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700 rounded-xl px-4 py-2.5 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
          >
            <option value="">None (clear special)</option>
            {menuItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} — ${item.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm text-stone-400 mb-1">
            Barista&apos;s Note
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Try it with oat milk today!"
            className="w-full bg-stone-950 border border-stone-700 rounded-xl px-4 py-2.5 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-700 text-stone-400 text-sm hover:bg-stone-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 text-stone-900 font-bold text-sm hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
