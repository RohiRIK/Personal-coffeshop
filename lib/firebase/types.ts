// Menu Item Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Coffee" | "Iced" | "Non-Coffee" | "Dessert";
  imageUrl: string;
  tag: "Hot" | "Cold";
  available: boolean;
}

// Order Types
export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  milk?: string;
  cup?: string;
  sugar?: string;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt?: Date;
  rating?: number;
  review?: string;
}

// User Types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: "guest" | "admin" | "vip";
  orderCount?: number;
  createdAt: Date;
}

// Cart Types (for client-side order building)
export interface CartItem extends OrderItem {
  customizationId: string; // Unique ID for this specific customization
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  name: string;
  type: "milk" | "syrup" | "topping" | "other";
  available: boolean;
  quantity?: number;
}

// Collection/Category Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  path: string;
}
