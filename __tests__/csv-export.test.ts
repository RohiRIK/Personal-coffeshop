import { describe, test, expect } from "bun:test";
import { convertOrdersToCSV } from "lib/utils/csv-export";
import type { Order } from "lib/firebase/types";

// Helper to create a test order
function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "order-abc123",
    userId: "user-1",
    userName: "Test User",
    userEmail: "test@example.com",
    items: [
      {
        menuItemId: "latte-1",
        name: "Caffè Latte",
        price: 4.5,
        quantity: 2,
        milk: "Oat Milk",
        cup: "Ceramic Mug",
        sugar: "Normal",
      },
    ],
    total: 9.0,
    status: "completed",
    createdAt: new Date("2025-01-15T10:30:00Z"),
    ...overrides,
  };
}

describe("CSV Export", () => {
  describe("convertOrdersToCSV", () => {
    test("should return header row for empty orders", () => {
      const csv = convertOrdersToCSV([]);
      const lines = csv.split("\n");
      expect(lines.length).toBe(1);
      expect(lines[0]).toBe(
        "Order ID,Date,Time,Customer,Email,Total,Status,Items",
      );
    });

    test("should create correct CSV for single order", () => {
      const csv = convertOrdersToCSV([makeOrder()]);
      const lines = csv.split("\n");
      expect(lines.length).toBe(2); // header + 1 data row
    });

    test("should include order ID in output", () => {
      const csv = convertOrdersToCSV([makeOrder()]);
      expect(csv).toContain("order-abc123");
    });

    test("should include customer name", () => {
      const csv = convertOrdersToCSV([makeOrder()]);
      expect(csv).toContain("Test User");
    });

    test("should include email", () => {
      const csv = convertOrdersToCSV([makeOrder()]);
      expect(csv).toContain("test@example.com");
    });

    test("should format total with 2 decimal places", () => {
      const csv = convertOrdersToCSV([makeOrder()]);
      expect(csv).toContain("9.00");
    });

    test("should include item summary with quantity and milk", () => {
      const csv = convertOrdersToCSV([makeOrder()]);
      expect(csv).toContain("2x Caffè Latte (Oat Milk)");
    });

    test("should handle items without milk option", () => {
      const csv = convertOrdersToCSV([
        makeOrder({
          items: [
            {
              menuItemId: "cookie-1",
              name: "Cookie",
              price: 2.5,
              quantity: 1,
            },
          ],
        }),
      ]);
      expect(csv).toContain("1x Cookie (Standard)");
    });

    test("should handle multiple items with semicolon separator", () => {
      const csv = convertOrdersToCSV([
        makeOrder({
          items: [
            {
              menuItemId: "latte-1",
              name: "Latte",
              price: 4.5,
              quantity: 1,
              milk: "Whole Milk",
            },
            {
              menuItemId: "mocha-1",
              name: "Mocha",
              price: 5.0,
              quantity: 1,
              milk: "Oat Milk",
            },
          ],
        }),
      ]);
      expect(csv).toContain("1x Latte (Whole Milk); 1x Mocha (Oat Milk)");
    });

    test("should escape fields with commas", () => {
      const csv = convertOrdersToCSV([makeOrder({ userName: "Smith, John" })]);
      expect(csv).toContain('"Smith, John"');
    });

    test("should escape fields with double quotes", () => {
      const csv = convertOrdersToCSV([
        makeOrder({ userName: 'The "Coffee" King' }),
      ]);
      expect(csv).toContain('"The ""Coffee"" King"');
    });

    test("should handle multiple orders", () => {
      const csv = convertOrdersToCSV([
        makeOrder({ id: "order-1" }),
        makeOrder({ id: "order-2" }),
        makeOrder({ id: "order-3" }),
      ]);
      const lines = csv.split("\n");
      expect(lines.length).toBe(4); // header + 3 data rows
    });

    test("should include status", () => {
      const csv = convertOrdersToCSV([makeOrder({ status: "preparing" })]);
      expect(csv).toContain("preparing");
    });
  });
});
