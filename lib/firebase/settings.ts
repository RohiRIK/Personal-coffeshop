import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./index";
import type { AppSettings } from "./types";

const DEFAULT_SETTINGS: AppSettings = {
  hidePrices: false,
};

function getSettingsDoc() {
  return doc(db, "settings", "app");
}

export async function getAppSettings(): Promise<AppSettings> {
  try {
    const snap = await getDoc(getSettingsDoc());
    if (snap.exists()) {
      return snap.data() as AppSettings;
    }
    // Create default settings if they don't exist
    await setDoc(getSettingsDoc(), DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Failed to get app settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateAppSettings(
  settings: Partial<AppSettings>,
): Promise<void> {
  try {
    await setDoc(getSettingsDoc(), settings, { merge: true });
  } catch (error) {
    console.error("Failed to update app settings:", error);
  }
}

export function onAppSettingsChange(
  callback: (settings: AppSettings) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  try {
    return onSnapshot(
      getSettingsDoc(),
      (snap) => {
        if (snap.exists()) {
          callback(snap.data() as AppSettings);
        } else {
          callback(DEFAULT_SETTINGS);
        }
      },
      (error) => {
        console.error("Settings snapshot error:", error);
        if (onError) onError(error);
      },
    );
  } catch (error) {
    console.error("Failed to setup settings listener:", error);
    // Return a no-op unsubscribe
    callback(DEFAULT_SETTINGS);
    return () => {};
  }
}
