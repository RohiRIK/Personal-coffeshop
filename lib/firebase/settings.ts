import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./index";
import type { AppSettings } from "./types";

const SETTINGS_DOC = doc(db, "settings", "app");

const DEFAULT_SETTINGS: AppSettings = {
  hidePrices: false,
};

export async function getAppSettings(): Promise<AppSettings> {
  const snap = await getDoc(SETTINGS_DOC);
  if (snap.exists()) {
    return snap.data() as AppSettings;
  }
  // Create default settings if they don't exist
  await setDoc(SETTINGS_DOC, DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

export async function updateAppSettings(
  settings: Partial<AppSettings>,
): Promise<void> {
  await setDoc(SETTINGS_DOC, settings, { merge: true });
}

export function onAppSettingsChange(
  callback: (settings: AppSettings) => void,
): Unsubscribe {
  return onSnapshot(SETTINGS_DOC, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as AppSettings);
    } else {
      callback(DEFAULT_SETTINGS);
    }
  });
}
