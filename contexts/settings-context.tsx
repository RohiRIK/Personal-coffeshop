"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { onAppSettingsChange, updateAppSettings } from "lib/firebase/settings";
import type { AppSettings } from "lib/firebase/types";

interface SettingsContextType {
  hidePrices: boolean;
  toggleHidePrices: () => void;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  hidePrices: false,
  toggleHidePrices: () => {},
  loading: true,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>({ hidePrices: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAppSettingsChange((newSettings) => {
      setSettings(newSettings);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleHidePrices = useCallback(() => {
    const newValue = !settings.hidePrices;
    // Optimistic update
    setSettings((prev) => ({ ...prev, hidePrices: newValue }));
    updateAppSettings({ hidePrices: newValue });
  }, [settings.hidePrices]);

  return (
    <SettingsContext.Provider
      value={{
        hidePrices: settings.hidePrices,
        toggleHidePrices,
        loading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
