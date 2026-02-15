import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./index";
import type { MenuItem, Category } from "./types";

const MENU_COLLECTION = "menu";

/**
 * Add a new menu item
 */
export async function addMenuItem(item: Omit<MenuItem, "id">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, MENU_COLLECTION), item);
    return docRef.id;
  } catch (error) {
    console.error("Error adding menu item:", error);
    throw error;
  }
}

/**
 * Delete a menu item
 */
export async function deleteMenuItem(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, MENU_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting menu item:", error);
    throw error;
  }
}

/**
 * Update a menu item
 */
export async function updateMenuItem(
  id: string,
  updates: Partial<MenuItem>,
): Promise<void> {
  try {
    const docRef = doc(db, MENU_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating menu item:", error);
    throw error;
  }
}

/**
 * Get all menu items from Firebase
 */
export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const querySnapshot = await getDocs(collection(db, MENU_COLLECTION));
    const items: MenuItem[] = [];

    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as MenuItem);
    });

    return items;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}

/**
 * Get a single menu item by ID
 */
export async function getMenuItem(id: string): Promise<MenuItem | undefined> {
  try {
    const docRef = doc(db, MENU_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as MenuItem;
    }
    return undefined;
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return undefined;
  }
}

/**
 * Get menu items by category
 */
export async function getMenuByCategory(category: string): Promise<MenuItem[]> {
  try {
    const q = query(
      collection(db, MENU_COLLECTION),
      where("category", "==", category),
    );
    const querySnapshot = await getDocs(q);
    const items: MenuItem[] = [];

    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as MenuItem);
    });

    return items;
  } catch (error) {
    console.error("Error fetching menu by category:", error);
    return [];
  }
}

/**
 * Get available menu items only
 */
export async function getAvailableMenuItems(): Promise<MenuItem[]> {
  try {
    const q = query(
      collection(db, MENU_COLLECTION),
      where("available", "==", true),
    );
    const querySnapshot = await getDocs(q);
    const items: MenuItem[] = [];

    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as MenuItem);
    });

    return items;
  } catch (error) {
    console.error("Error fetching available menu items:", error);
    return [];
  }
}

/**
 * Get all categories from menu items
 */
export async function getCategories(): Promise<Category[]> {
  const items = await getMenuItems();
  const categorySet = new Set(items.map((item) => item.category));

  const categories: Category[] = [
    { id: "all", name: "All", description: "All drinks", path: "/menu" },
  ];

  categorySet.forEach((cat) => {
    categories.push({
      id: cat.toLowerCase(),
      name: cat,
      description: `${cat} drinks`,
      path: `/menu/${cat.toLowerCase()}`,
    });
  });

  return categories;
}
