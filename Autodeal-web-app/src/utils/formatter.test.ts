import { describe, it, expect } from "vitest";
import { formatPrice, formatKm } from "./formatter";

describe("formatter utils", () => {
  describe("formatPrice", () => {
    it("should format valid number into INR currency string", () => {
      const result = formatPrice(185000);
      // \u20B9 is ₹
      expect(result).toMatch(/₹\s?1,85,000/);
    });

    it("should return 'Price on request' when value is null or undefined", () => {
      expect(formatPrice(null)).toBe("Price on request");
      expect(formatPrice(undefined)).toBe("Price on request");
    });
  });

  describe("formatKm", () => {
    it("should format kilometers driven with km suffix", () => {
      const result = formatKm(15000);
      expect(result).toMatch(/15,000\s?km/);
    });

    it("should handle 0 or null km gracefully", () => {
      expect(formatKm(0)).toBe("0 km");
      expect(formatKm(null)).toBe("0 km");
      expect(formatKm(undefined)).toBe("0 km");
    });
  });
});
