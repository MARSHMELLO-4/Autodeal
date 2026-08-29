import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useVehicles } from "./useVehicles";
import * as apiClient from "../api/api-client";

describe("useVehicles hook", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch vehicles and manage loading state", async () => {
    const mockVehicles = [
      { id: 1, title: "Honda Activa 6G", price: 75000 },
      { id: 2, title: "Royal Enfield 350", price: 180000 },
    ];

    vi.spyOn(apiClient, "getVehicles").mockResolvedValue({
      content: mockVehicles,
    } as any);

    const { result } = renderHook(() =>
      useVehicles({ search: "", category: "", status: "AVAILABLE" })
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.vehicles).toEqual(mockVehicles);
  });

  it("should refetch vehicles when filters change", async () => {
    const mockVehicles1 = [
      { id: 1, title: "Honda Activa 6G", price: 75000 },
    ];
    const mockVehicles2 = [
      { id: 2, title: "Royal Enfield 350", price: 180000 },
    ];

    const getVehiclesSpy = vi
      .spyOn(apiClient, "getVehicles")
      .mockResolvedValueOnce({
        content: mockVehicles1,
      } as any)
      .mockResolvedValueOnce({
        content: mockVehicles2,
      } as any);

    const { result, rerender } = renderHook(
      ({ filters }) => useVehicles(filters),
      {
        initialProps: {
          filters: { search: "", category: "", status: "AVAILABLE" },
        },
      }
    );

    await waitFor(() => {
      expect(result.current.vehicles).toEqual(mockVehicles1);
    });

    expect(getVehiclesSpy).toHaveBeenCalledWith({
      search: "",
      category: "",
      status: "AVAILABLE",
    });

    // Change filters
    rerender({
      filters: { search: "", category: "scooters", status: "AVAILABLE" },
    });

    await waitFor(() => {
      expect(result.current.vehicles).toEqual(mockVehicles2);
    });

    expect(getVehiclesSpy).toHaveBeenCalledWith({
      search: "",
      category: "scooters",
      status: "AVAILABLE",
    });
    expect(getVehiclesSpy).toHaveBeenCalledTimes(2);
  });

  it("should handle empty vehicle list", async () => {
    vi.spyOn(apiClient, "getVehicles").mockResolvedValue({
      content: [],
    } as any);

    const { result } = renderHook(() =>
      useVehicles({ search: "nonexistent", category: "", status: "AVAILABLE" })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.vehicles).toEqual([]);
  });

  it("should handle errors gracefully", async () => {
    vi.spyOn(apiClient, "getVehicles").mockRejectedValue(
      new Error("Failed to fetch vehicles")
    );

    const { result } = renderHook(() =>
      useVehicles({ search: "", category: "", status: "AVAILABLE" })
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Vehicles should remain empty array on error
    expect(result.current.vehicles).toEqual([]);
    // Error should be set
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toBe("Failed to fetch vehicles");
  });

  it("should apply search filter correctly", async () => {
    const mockVehicles = [
      { id: 1, title: "Honda Activa 6G", price: 75000 },
    ];

    const getVehiclesSpy = vi.spyOn(apiClient, "getVehicles").mockResolvedValue({
      content: mockVehicles,
    } as any);

    renderHook(() =>
      useVehicles({ search: "Activa", category: "", status: "AVAILABLE" })
    );

    await waitFor(() => {
      expect(getVehiclesSpy).toHaveBeenCalledWith({
        search: "Activa",
        category: "",
        status: "AVAILABLE",
      });
    });
  });

  it("should apply category filter correctly", async () => {
    const mockVehicles = [
      { id: 1, title: "Honda Activa 6G", price: 75000 },
    ];

    const getVehiclesSpy = vi.spyOn(apiClient, "getVehicles").mockResolvedValue({
      content: mockVehicles,
    } as any);

    renderHook(() =>
      useVehicles({ search: "", category: "scooters", status: "AVAILABLE" })
    );

    await waitFor(() => {
      expect(getVehiclesSpy).toHaveBeenCalledWith({
        search: "",
        category: "scooters",
        status: "AVAILABLE",
      });
    });
  });
});
