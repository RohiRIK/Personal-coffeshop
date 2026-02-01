// Sorting options for menu display
export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: "name" | "price" | "category";
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: "Default",
  slug: null,
  sortKey: "name",
  reverse: false,
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: "Price: Low to high",
    slug: "price-asc",
    sortKey: "price",
    reverse: false,
  },
  {
    title: "Price: High to low",
    slug: "price-desc",
    sortKey: "price",
    reverse: true,
  },
  {
    title: "Name: A to Z",
    slug: "name-asc",
    sortKey: "name",
    reverse: false,
  },
  {
    title: "Name: Z to A",
    slug: "name-desc",
    sortKey: "name",
    reverse: true,
  },
];

// Cache tags for revalidation
export const TAGS = {
  menu: "menu",
  orders: "orders",
  cart: "cart",
  inventory: "inventory",
};

// Menu categories
export const CATEGORIES = [
  { id: "all", name: "All", path: "/menu" },
  { id: "coffee", name: "Coffee", path: "/menu/coffee" },
  { id: "iced", name: "Iced", path: "/menu/iced" },
  { id: "non-coffee", name: "Non-Coffee", path: "/menu/non-coffee" },
  { id: "dessert", name: "Dessert", path: "/menu/dessert" },
];

// Milk options
export const MILK_OPTIONS = [
  { id: "whole", name: "Whole Milk", available: true },
  { id: "oat", name: "Oat Milk", available: true },
  { id: "almond", name: "Almond Milk", available: true },
  { id: "soy", name: "Soy Milk", available: true },
  { id: "none", name: "No Milk", available: true },
];

// Cup options (no takeaway allowed!)
export const CUP_OPTIONS = [
  { id: "ceramic", name: "Ceramic Mug", description: "Classic coffee mug" },
  { id: "glass", name: "Glass Cup", description: "Elegant glass cup" },
];

// Order statuses
export const ORDER_STATUSES = {
  pending: { label: "Pending", color: "yellow" },
  preparing: { label: "Preparing", color: "blue" },
  ready: { label: "Ready", color: "green" },
  completed: { label: "Completed", color: "gray" },
  cancelled: { label: "Cancelled", color: "red" },
};

// Site configuration
export const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME || "Personal Coffeshop";
export const COMPANY_NAME = process.env.COMPANY_NAME || "Personal Coffeshop";
