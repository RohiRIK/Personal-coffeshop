import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  increment,
  where,
} from "firebase/firestore";
import { db } from "./index";
import { MILK_OPTIONS, CUP_OPTIONS } from "../constants";
import type { InventoryItem, RecipeIngredient } from "./types";

const INVENTORY_COLLECTION = "inventory";

// Base ingredients to seed alongside milks/cups
const BASE_INGREDIENTS: InventoryItem[] = [
  {
    id: "espresso-beans",
    name: "Espresso Beans (shots)",
    type: "other",
    available: true,
    quantity: 200,
  },
  {
    id: "chocolate-syrup",
    name: "Chocolate Syrup",
    type: "syrup",
    available: true,
    quantity: 100,
  },
  {
    id: "vanilla-syrup",
    name: "Vanilla Syrup",
    type: "syrup",
    available: true,
    quantity: 100,
  },
  {
    id: "caramel-syrup",
    name: "Caramel Syrup",
    type: "syrup",
    available: true,
    quantity: 100,
  },
  {
    id: "matcha-powder",
    name: "Matcha Powder",
    type: "other",
    available: true,
    quantity: 80,
  },
  {
    id: "whipped-cream",
    name: "Whipped Cream",
    type: "topping",
    available: true,
    quantity: 100,
  },
  { id: "ice", name: "Ice", type: "other", available: true, quantity: 500 },
];

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

      // Seed base ingredients
      for (const ingredient of BASE_INGREDIENTS) {
        await setDoc(doc(db, INVENTORY_COLLECTION, ingredient.id), ingredient);
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

/**
 * Deduct inventory based on order items
 */
export async function deductInventory(
  items: any[],
  recipes?: Map<string, RecipeIngredient[]>,
): Promise<void> {
  try {
    const deductions: Record<string, number> = {};

    items.forEach((item) => {
      // 1. Customization-based deductions (milk, cup, sugar)
      if (item.milk) {
        const milkOption = MILK_OPTIONS.find((m) => m.name === item.milk);
        const milkId = milkOption?.id || item.milk.toLowerCase();
        deductions[milkId] = (deductions[milkId] || 0) + item.quantity;
      }
      if (item.cup) {
        const cupOption = CUP_OPTIONS.find((c) => c.name === item.cup);
        const cupId = cupOption?.id || item.cup.toLowerCase();
        deductions[cupId] = (deductions[cupId] || 0) + item.quantity;
      }
      if (item.sugar && item.sugar !== "none") {
        let amount = 0;
        if (item.sugar === "light") amount = 1;
        if (item.sugar === "normal") amount = 2;
        if (item.sugar === "extra") amount = 3;
        deductions["sugar"] =
          (deductions["sugar"] || 0) + amount * item.quantity;
      }

      // 2. Recipe-based deductions (base ingredients)
      if (recipes && item.menuItemId) {
        const recipe = recipes.get(item.menuItemId);
        if (recipe) {
          recipe.forEach((ingredient) => {
            deductions[ingredient.inventoryItemId] =
              (deductions[ingredient.inventoryItemId] || 0) +
              ingredient.quantity * item.quantity;
          });
        }
      }
    });

    // Execute atomic updates
    const updates = Object.entries(deductions).map(async ([id, amount]) => {
      if (!id) return;
      const itemRef = doc(db, INVENTORY_COLLECTION, id);

      try {
        await updateDoc(itemRef, {
          quantity: increment(-amount),
        });
      } catch (e) {
        console.error(`Failed to update inventory for ${id}:`, e);
      }
    });

    await Promise.all(updates);
    console.log("Inventory deducted:", deductions);
  } catch (error) {
    console.error("Error deducting inventory:", error);
  }
}

/**
 * Update inventory quantity manually
 */
export async function updateInventoryQuantity(
  itemId: string,
  quantity: number,
): Promise<void> {
  try {
    const itemRef = doc(db, INVENTORY_COLLECTION, itemId);
    await updateDoc(itemRef, {
      quantity,
    });
  } catch (error) {
    console.error("Error updating inventory quantity:", error);
    throw error;
  }
}
