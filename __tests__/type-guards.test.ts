import { describe, test, expect } from "bun:test";
import { isObject, isShopifyError } from "lib/type-guards";

describe("Type Guards", () => {
  describe("isObject", () => {
    test("should return true for plain object", () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ key: "value" })).toBe(true);
    });

    test("should return false for null", () => {
      expect(isObject(null)).toBe(false);
    });

    test("should return false for array", () => {
      expect(isObject([])).toBe(false);
      expect(isObject([1, 2, 3])).toBe(false);
    });

    test("should return false for primitives", () => {
      expect(isObject("string")).toBe(false);
      expect(isObject(42)).toBe(false);
      expect(isObject(true)).toBe(false);
      expect(isObject(undefined)).toBe(false);
    });

    test("should return true for nested objects", () => {
      expect(isObject({ nested: { deep: true } })).toBe(true);
    });
  });

  describe("isShopifyError", () => {
    test("should return true for Error instances", () => {
      expect(isShopifyError(new Error("test"))).toBe(true);
    });

    test("should return false for plain objects", () => {
      expect(isShopifyError({ message: "not an error" })).toBe(false);
    });

    test("should return false for non-objects", () => {
      expect(isShopifyError("string error")).toBe(false);
      expect(isShopifyError(null)).toBe(false);
      expect(isShopifyError(undefined)).toBe(false);
      expect(isShopifyError(42)).toBe(false);
    });
  });
});
