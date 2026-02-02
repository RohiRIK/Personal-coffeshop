import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./index";
import type { Order, OrderItem } from "./types";
import { deductInventory } from "./inventory";
import { v4 as uuidv4 } from "uuid";

const ORDERS_COLLECTION = "orders";

/**
 * Create a new order
 */
export async function createOrder(
  userId: string,
  userName: string,
  items: OrderItem[],
  userEmail?: string,
): Promise<string> {
  try {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Generate a rating token for email-based rating
    const ratingToken = uuidv4();

    const orderData = {
      userId,
      userName,
      userEmail: userEmail || null,
      ratingToken,
      items,
      total,
      status: "pending",
      createdAt: serverTimestamp(),
      emailSentReady: false,
      emailSentRating: false,
    };

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData);

    // Deduct Inventory asynchronously (don't await to keep UI fast)
    deductInventory(items).catch((err) =>
      console.error("Inventory deduction failed:", err),
    );

    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

/**
 * Get all orders (for admin)
 */
export async function getOrders(): Promise<Order[]> {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
      } as Order);
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

/**
 * Get orders by user ID
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
      } as Order);
    });

    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}

/**
 * Get orders by status (for admin dashboard)
 */
export async function getOrdersByStatus(
  status: Order["status"],
): Promise<Order[]> {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where("status", "==", status),
      orderBy("createdAt", "asc"),
    );
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
      } as Order);
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    return [];
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

/**
 * Get a single order by ID
 */
export async function getOrder(orderId: string): Promise<Order | undefined> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
      } as Order;
    }
    return undefined;
  } catch (error) {
    console.error("Error fetching order:", error);
    return undefined;
  }
}

/**
 * Rate an order
 */
export async function rateOrder(
  orderId: string,
  rating: number,
  review?: string,
): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      rating,
      review: review || null,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error rating order:", error);
    throw error;
  }
}
