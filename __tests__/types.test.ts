import { describe, test, expect } from "bun:test";
import type {
  MenuItem,
  Order,
  OrderItem,
  CartItem,
  InventoryItem,
  AppSettings,
  RecipeIngredient,
} from "lib/firebase/types";

describe("Firebase Types", () => {
  describe("MenuItem", () => {
    test("should allow creating a valid menu item", () => {
      const item: MenuItem = {
        id: "latte-1",
        name: "Caffè Latte",
        description: "Smooth espresso with steamed milk",
        price: 4.5,
        category: "Coffee",
        imageUrl: "https://example.com/latte.jpg",
        tag: "Hot",
        available: true,
      };

      expect(item.id).toBe("latte-1");
      expect(item.price).toBe(4.5);
      expect(item.category).toBe("Coffee");
      expect(item.tag).toBe("Hot");
      expect(item.available).toBe(true);
    });

    test("should support optional recipe field", () => {
      const recipe: RecipeIngredient[] = [
        { inventoryItemId: "espresso-beans", quantity: 2 },
        { inventoryItemId: "whole-milk", quantity: 1 },
      ];

      const item: MenuItem = {
        id: "latte-1",
        name: "Latte",
        description: "A latte",
        price: 4.5,
        category: "Coffee",
        imageUrl: "",
        tag: "Hot",
        available: true,
        recipe,
      };

      expect(item.recipe).toHaveLength(2);
      expect(item.recipe![0]!.inventoryItemId).toBe("espresso-beans");
    });

    test("should enforce valid categories", () => {
      const validCategories: MenuItem["category"][] = [
        "Coffee",
        "Iced",
        "Non-Coffee",
        "Dessert",
      ];
      expect(validCategories).toHaveLength(4);
    });

    test("should enforce valid tags", () => {
      const validTags: MenuItem["tag"][] = ["Hot", "Cold"];
      expect(validTags).toHaveLength(2);
    });
  });

  describe("Order", () => {
    test("should allow creating a valid order", () => {
      const order: Order = {
        id: "order-1",
        userId: "user-1",
        items: [
          {
            menuItemId: "latte-1",
            name: "Latte",
            price: 4.5,
            quantity: 1,
          },
        ],
        total: 4.5,
        status: "pending",
        createdAt: new Date(),
      };

      expect(order.status).toBe("pending");
      expect(order.items).toHaveLength(1);
    });

    test("should support optional reaction field", () => {
      const order: Order = {
        id: "order-1",
        userId: "user-1",
        items: [],
        total: 0,
        status: "completed",
        createdAt: new Date(),
        reaction: "🔥",
      };

      expect(order.reaction).toBe("🔥");
    });

    test("should support all valid statuses", () => {
      const statuses: Order["status"][] = [
        "pending",
        "preparing",
        "ready",
        "completed",
        "cancelled",
      ];
      expect(statuses).toHaveLength(5);
    });
  });

  describe("OrderItem", () => {
    test("should allow optional customizations", () => {
      const item: OrderItem = {
        menuItemId: "mocha-1",
        name: "Mocha",
        price: 5.0,
        quantity: 1,
        milk: "Oat Milk",
        cup: "Ceramic Mug",
        sugar: "Light",
        specialInstructions: "Extra foam please",
      };

      expect(item.milk).toBe("Oat Milk");
      expect(item.specialInstructions).toBe("Extra foam please");
    });

    test("should work without optional fields", () => {
      const item: OrderItem = {
        menuItemId: "cookie-1",
        name: "Cookie",
        price: 2.5,
        quantity: 3,
      };

      expect(item.milk).toBeUndefined();
      expect(item.cup).toBeUndefined();
    });
  });

  describe("CartItem", () => {
    test("should extend OrderItem with customizationId", () => {
      const cartItem: CartItem = {
        menuItemId: "latte-1",
        name: "Latte",
        price: 4.5,
        quantity: 1,
        customizationId: "unique-id-123",
      };

      expect(cartItem.customizationId).toBe("unique-id-123");
    });
  });

  describe("InventoryItem", () => {
    test("should support all inventory types", () => {
      const types: InventoryItem["type"][] = [
        "milk",
        "syrup",
        "topping",
        "other",
      ];
      expect(types).toHaveLength(4);
    });

    test("should allow optional quantity", () => {
      const item: InventoryItem = {
        id: "oat",
        name: "Oat Milk",
        type: "milk",
        available: true,
      };
      expect(item.quantity).toBeUndefined();

      const itemWithQty: InventoryItem = {
        id: "espresso",
        name: "Espresso Beans",
        type: "other",
        available: true,
        quantity: 200,
      };
      expect(itemWithQty.quantity).toBe(200);
    });
  });

  describe("AppSettings", () => {
    test("should support daily special fields", () => {
      const settings: AppSettings = {
        hidePrices: false,
        dailySpecialId: "latte-1",
        dailySpecialNote: "Try with oat milk!",
      };

      expect(settings.dailySpecialId).toBe("latte-1");
      expect(settings.dailySpecialNote).toBe("Try with oat milk!");
    });

    test("should work with minimal settings", () => {
      const settings: AppSettings = {
        hidePrices: true,
      };

      expect(settings.hidePrices).toBe(true);
      expect(settings.dailySpecialId).toBeUndefined();
    });
  });
});
