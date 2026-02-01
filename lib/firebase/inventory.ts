import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "./index";
import { MILK_OPTIONS, CUP_OPTIONS } from "../constants";
import type { InventoryItem } from "./types";

const INVENTORY_COLLECTION = "inventory";

/**
 * Initialize inventory if empty
 * Seeds Firestore with default constants
 */
export async function initializeInventory() {
  try {
    const querySnapshot = await getDocs(collection(db, INVENTORY_COLLECTION));

    if (querySnapshot.empty) {
      console.log("Seeding inventory...");
      const batch = [];

      // Seed Milks
      for (const milk of MILK_OPTIONS) {
        const item: InventoryItem = {
          id: milk.id,
          name: milk.name,
          type: "milk",
          available: true,
          quantity: 100, // Default stock
        };
        await setDoc(doc(db, INVENTORY_COLLECTION, milk.id), item);
      }

      // Seed Cups
      for (const cup of CUP_OPTIONS) {
        const item: InventoryItem = {
          id: cup.id,
          name: cup.name,
          type: "topping", // reused type or new one
          available: true,
          quantity: 100,
        };
        await setDoc(doc(db, INVENTORY_COLLECTION, cup.id), item);
      }
    }
  } catch (error) {
    console.error("Error initializing inventory:", error);
  }
}

/**
 * Update inventory availability
 */
export async function updateInventoryStatus(
  itemId: string,
  available: boolean,
): Promise<void> {
  try {
    const itemRef = doc(db, INVENTORY_COLLECTION, itemId);
    await updateDoc(itemRef, {
      available,
    });
  } catch (error) {
    console.error("Error updating inventory status:", error);
    throw error;
  }
}
