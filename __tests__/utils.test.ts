import { describe, test, expect } from "bun:test";
import { createUrl, ensureStartsWith } from "lib/utils";

describe("Utils", () => {
  describe("createUrl", () => {
    test("should create URL without query params", () => {
      const params = new URLSearchParams();
      expect(createUrl("/menu", params)).toBe("/menu");
    });

    test("should create URL with query params", () => {
      const params = new URLSearchParams({ category: "coffee" });
      expect(createUrl("/menu", params)).toBe("/menu?category=coffee");
    });

    test("should handle multiple query params", () => {
      const params = new URLSearchParams({ sort: "price", order: "asc" });
      const url = createUrl("/menu", params);
      expect(url).toContain("/menu?");
      expect(url).toContain("sort=price");
      expect(url).toContain("order=asc");
    });

    test("should handle empty pathname", () => {
      const params = new URLSearchParams({ q: "latte" });
      expect(createUrl("", params)).toBe("?q=latte");
    });
  });

  describe("ensureStartsWith", () => {
    test("should add prefix if missing", () => {
      expect(ensureStartsWith("hello", "/")).toBe("/hello");
    });

    test("should not duplicate prefix if already present", () => {
      expect(ensureStartsWith("/hello", "/")).toBe("/hello");
    });

    test("should handle empty string", () => {
      expect(ensureStartsWith("", "/")).toBe("/");
    });

    test("should work with multi-char prefix", () => {
      expect(ensureStartsWith("example.com", "https://")).toBe(
        "https://example.com",
      );
      expect(ensureStartsWith("https://example.com", "https://")).toBe(
        "https://example.com",
      );
    });
  });
});
