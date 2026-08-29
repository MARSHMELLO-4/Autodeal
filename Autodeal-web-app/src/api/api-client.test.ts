import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCategories, getVehicles, getVehicle } from "./api-client";

describe("api-client", () => {
  const globalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = globalFetch;
    vi.restoreAllMocks();
  });

  describe("getCategories", () => {
    it("should fetch categories from /api/catalog/categories", async () => {
      const mockCategories = [{ id: 1, name: "Scooters", slug: "scooters" }];
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
      } as Response);

      const result = await getCategories();
      expect(result).toEqual(mockCategories);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/catalog/categories")
      );
    });

    it("should throw error if response is not ok", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Internal server error" }),
      } as Response);

      await expect(getCategories()).rejects.toThrow("Internal server error");
    });
  });

  describe("getVehicles", () => {
    it("should construct query params and fetch vehicles", async () => {
      const mockResponse = { content: [{ id: 10, title: "Activa" }] };
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await getVehicles({
        search: "Activa",
        category: "scooters",
        status: "AVAILABLE",
      });

      expect(result).toEqual(mockResponse);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/catalog\/vehicles\?.*search=Activa.*category=scooters.*status=AVAILABLE/)
      );
    });

    it("should omit status param if status is ALL", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: [] }),
      } as Response);

      await getVehicles({
        search: "",
        category: "",
        status: "ALL",
      });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.not.stringContaining("status=ALL")
      );
    });
  });

  describe("getVehicle", () => {
    it("should fetch single vehicle by id", async () => {
      const mockDetail = { id: 10, title: "Classic 350" };
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockDetail,
      } as Response);

      const result = await getVehicle("10");
      expect(result).toEqual(mockDetail);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/catalog/vehicles/10")
      );
    });

    it("should throw error if vehicle not found", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Vehicle not found" }),
      } as Response);

      await expect(getVehicle("999")).rejects.toThrow("Vehicle not found");
    });

    it("should handle fetch errors gracefully", async () => {
      vi.mocked(globalThis.fetch).mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(getVehicle("10")).rejects.toThrow("Network error");
    });
  });

  describe("request helper", () => {
    it("should handle non-JSON error responses", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as Response);

      await expect(getCategories()).rejects.toThrow("Request failed");
    });

    it("should use correct API base URL from environment", async () => {
      const mockResponse = [{ id: 1, name: "Test" }];
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await getCategories();
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/catalog/categories")
      );
    });
  });
});
