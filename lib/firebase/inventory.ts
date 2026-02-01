import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  increment,
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

      // Seed Sugar (Generic for now)
      await setDoc(doc(db, INVENTORY_COLLECTION, "sugar"), {
        id: "sugar",
        name: "Sugar Packets",
        type: "other",
        available: true,
        quantity: 500,
      });
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

/**
 * Deduct inventory based on order items
 */
export async function deductInventory(items: any[]): Promise<void> {
  try {
    const deductions: Record<string, number> = {};

    items.forEach((item) => {
      // 1. Milk
      if (item.milk) {
        deductions[item.milk] = (deductions[item.milk] || 0) + item.quantity;
      }
      // 2. Cup
      if (item.cup) {
        deductions[item.cup] = (deductions[item.cup] || 0) + item.quantity;
      }
      // 3. Sugar
      if (item.sugar && item.sugar !== "none") {
        let amount = 0;
        if (item.sugar === "light") amount = 1;
        if (item.sugar === "normal") amount = 2;
        if (item.sugar === "extra") amount = 3;
        deductions["sugar"] = (deductions["sugar"] || 0) + (amount * item.quantity);
      }
    });

    // Execute atomic updates
    const updates = Object.entries(deductions).map(async ([id, amount]) => {
      const itemRef = doc(db, INVENTORY_COLLECTION, id);
      // Use increment(-amount) to atomically decrease
      await updateDoc(itemRef, {
        quantity: increment(-amount),
      });
    });

    await Promise.all(updates);
    console.log("Inventory deducted:", deductions);
  } catch (error) {
    console.error("Error deducting inventory:", error);
  }
}
