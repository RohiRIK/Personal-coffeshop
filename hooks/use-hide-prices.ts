"use client";

import { useEffect, useState, useCallback } from "react";
import { onAppSettingsChange, updateAppSettings } from "lib/firebase/settings";

/**
 * Standalone hook for hide-prices state.
 * Each consumer gets its own Firestore listener, but in practice
 * only 1-2 components use it at a time so this is fine.
 * This approach avoids wrapping the entire app in a provider
 * that can crash the whole React tree on Firestore errors.
 */
export function useHidePrices() {
  const [hidePrices, setHidePrices] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = onAppSettingsChange(
        (settings) => {
          setHidePrices(settings.hidePrices);
          setLoading(false);
        },
        (error) => {
          console.warn("Settings listener error (non-fatal):", error.message);
          setLoading(false);
        },
      );
    } catch (error) {
      console.warn("Failed to start settings listener (non-fatal):", error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const toggleHidePrices = useCallback(() => {
    const newValue = !hidePrices;
    setHidePrices(newValue); // Optimistic update
    updateAppSettings({ hidePrices: newValue }).catch((err) =>
      console.warn("Failed to update settings:", err),
    );
  }, [hidePrices]);

  return { hidePrices, toggleHidePrices, loading };
}
