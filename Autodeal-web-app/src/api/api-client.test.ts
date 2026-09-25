import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getCategories,
  getVehicles,
  getVehicle,
  trackVehicleClick,
} from "./api-client";

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
      } as unknown as Response);

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
      } as unknown as Response);

      await expect(getCategories()).rejects.toThrow("Internal server error");
    });
  });

  describe("getVehicles", () => {
    it("should construct query params and fetch vehicles", async () => {
      const mockResponse = { content: [{ id: 10, title: "Activa" }] };
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as unknown as Response);

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
      } as unknown as Response);

      await getVehicles({
        search: "",
        category: "",
        status: "ALL",
      });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.not.stringContaining("status=ALL")
      );
    });

    it("should send the selected sortBy", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: [] }),
      } as unknown as Response);

      await getVehicles({
        search: "",
        category: "",
        status: "AVAILABLE",
        sort: "priceLow",
      });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("sortBy=priceLow")
      );
    });

    it("should omit sortBy when no sort is provided", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: [] }),
      } as unknown as Response);

      await getVehicles({
        search: "",
        category: "",
        status: "AVAILABLE",
      });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.not.stringContaining("sortBy")
      );
    });
  });

  describe("trackVehicleClick", () => {
    it("should post a click beacon with the source", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        status: 202,
      } as unknown as Response);

      const result = await trackVehicleClick(10, "card");

      expect(result).toBe(true);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/catalog/vehicles/10/clicks?source=card"),
        expect.objectContaining({ method: "POST" })
      );
    });

    it("should report failure without throwing when the request fails", async () => {
      vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error("Network error"));

      await expect(trackVehicleClick(10, "card")).resolves.toBe(false);
    });

    it("should report failure when the server rejects the beacon", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as unknown as Response);

      await expect(trackVehicleClick(10, "card")).resolves.toBe(false);
    });
  });

  describe("getVehicle", () => {
    it("should fetch single vehicle by id", async () => {
      const mockDetail = { id: 10, title: "Classic 350" };
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockDetail,
      } as unknown as Response);

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
      } as unknown as Response);

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
      } as unknown as Response);

      await expect(getCategories()).rejects.toThrow("Request failed");
    });

    it("should use correct API base URL from environment", async () => {
      const mockResponse = [{ id: 1, name: "Test" }];
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as unknown as Response);

      await getCategories();
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/catalog/categories")
      );
    });
  });
});
