import { describe, test, expect } from "bun:test";
import {
  CATEGORIES,
  MILK_OPTIONS,
  CUP_OPTIONS,
  SUGAR_OPTIONS,
  ORDER_STATUSES,
  SITE_NAME,
  sorting,
  defaultSort,
  TAGS,
} from "lib/constants";

describe("Constants", () => {
  describe("CATEGORIES", () => {
    test("should include 'all' as first category", () => {
      expect(CATEGORIES[0]!.id).toBe("all");
      expect(CATEGORIES[0]!.path).toBe("/menu");
    });

    test("should have at least 4 drink categories", () => {
      expect(CATEGORIES.length).toBeGreaterThanOrEqual(4);
    });

    test("every category should have id, name, and path", () => {
      CATEGORIES.forEach((cat) => {
        expect(cat.id).toBeTruthy();
        expect(cat.name).toBeTruthy();
        expect(cat.path).toStartWith("/");
      });
    });
  });

  describe("MILK_OPTIONS", () => {
    test("should have at least 4 milk options", () => {
      expect(MILK_OPTIONS.length).toBeGreaterThanOrEqual(4);
    });

    test("should include 'none' option", () => {
      const none = MILK_OPTIONS.find((m) => m.id === "none");
      expect(none).toBeTruthy();
      expect(none!.name).toBe("No Milk");
    });

    test("every option should have id and name", () => {
      MILK_OPTIONS.forEach((opt) => {
        expect(opt.id).toBeTruthy();
        expect(opt.name).toBeTruthy();
      });
    });
  });

  describe("CUP_OPTIONS", () => {
    test("should have at least 2 cup options", () => {
      expect(CUP_OPTIONS.length).toBeGreaterThanOrEqual(2);
    });

    test("every option should have id, name, and description", () => {
      CUP_OPTIONS.forEach((opt) => {
        expect(opt.id).toBeTruthy();
        expect(opt.name).toBeTruthy();
        expect(opt.description).toBeTruthy();
      });
    });
  });

  describe("SUGAR_OPTIONS", () => {
    test("should have at least 3 sugar levels", () => {
      expect(SUGAR_OPTIONS.length).toBeGreaterThanOrEqual(3);
    });

    test("should include a 'no sugar' option with level 0", () => {
      const noSugar = SUGAR_OPTIONS.find((s) => s.level === 0);
      expect(noSugar).toBeTruthy();
    });

    test("levels should be ordered ascending", () => {
      for (let i = 1; i < SUGAR_OPTIONS.length; i++) {
        expect(SUGAR_OPTIONS[i]!.level).toBeGreaterThanOrEqual(
          SUGAR_OPTIONS[i - 1]!.level,
        );
      }
    });
  });

  describe("ORDER_STATUSES", () => {
    test("should have all 5 statuses", () => {
      expect(Object.keys(ORDER_STATUSES)).toEqual([
        "pending",
        "preparing",
        "ready",
        "completed",
        "cancelled",
      ]);
    });

    test("every status should have label and color", () => {
      Object.values(ORDER_STATUSES).forEach((status) => {
        expect(status.label).toBeTruthy();
        expect(status.color).toBeTruthy();
      });
    });
  });

  describe("Sorting", () => {
    test("default sort should sort by name ascending", () => {
      expect(defaultSort.sortKey).toBe("name");
      expect(defaultSort.reverse).toBe(false);
    });

    test("should have at least 4 sorting options", () => {
      expect(sorting.length).toBeGreaterThanOrEqual(4);
    });

    test("first sort option should be default", () => {
      expect(sorting[0]).toEqual(defaultSort);
    });
  });

  describe("TAGS", () => {
    test("should have menu, orders, cart, inventory tags", () => {
      expect(TAGS.menu).toBe("menu");
      expect(TAGS.orders).toBe("orders");
      expect(TAGS.cart).toBe("cart");
      expect(TAGS.inventory).toBe("inventory");
    });
  });

  describe("SITE_NAME", () => {
    test("should have a default site name", () => {
      expect(SITE_NAME).toBeTruthy();
      expect(typeof SITE_NAME).toBe("string");
    });
  });
});
