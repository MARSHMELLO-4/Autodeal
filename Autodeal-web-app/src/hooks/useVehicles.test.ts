import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { createElement, type PropsWithChildren } from "react";
import { useVehicles } from "./useVehicles";
import * as apiClient from "../api/api-client";
import { store } from "../store/store";
import { vehiclesReceived } from "../store/vehiclesSlice";
import type { filterModel } from "../models/fIltersModels";
import { buildVehicle } from "../test/vehicleFixtures";

function page<T>(content: T[]) {
  return {
    content,
    totalElements: content.length,
    totalPages: 1,
    number: 0,
    size: 60,
  };
}

function wrapper({ children }: PropsWithChildren) {
  return createElement(Provider, { store, children });
}

describe("useVehicles hook", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    store.dispatch(vehiclesReceived([]));
  });

  it("should fetch vehicles and manage loading state", async () => {
    const mockVehicles = [
      buildVehicle({ id: 1, title: "Honda Activa 6G", price: 75000 }),
      buildVehicle({ id: 2, title: "Royal Enfield 350", price: 180000 }),
    ];

    vi.spyOn(apiClient, "getVehicles").mockResolvedValue(page(mockVehicles));

    const filters: filterModel = { search: "", category: "", status: "AVAILABLE" };
    const { result } = renderHook(() => useVehicles(filters), { wrapper });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.vehicles).toEqual(mockVehicles);
  });

  it("should refetch vehicles when filters change", async () => {
    const mockVehicles1 = [
      buildVehicle({ id: 1, title: "Honda Activa 6G", price: 75000 }),
    ];
    const mockVehicles2 = [
      buildVehicle({ id: 2, title: "Royal Enfield 350", price: 180000 }),
    ];

    const getVehiclesSpy = vi
      .spyOn(apiClient, "getVehicles")
      .mockResolvedValueOnce(page(mockVehicles1))
      .mockResolvedValueOnce(page(mockVehicles2));

    const { result, rerender } = renderHook(
      ({ filters }) => useVehicles(filters),
      {
        initialProps: {
          filters: { search: "", category: "", status: "AVAILABLE" as const },
        },
        wrapper,
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
      filters: { search: "", category: "scooters", status: "AVAILABLE" as const },
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

  it("should forward the selected sort to the api", async () => {
    const getVehiclesSpy = vi
      .spyOn(apiClient, "getVehicles")
      .mockResolvedValue(page([buildVehicle()]));

    const filters: filterModel = {
      search: "",
      category: "",
      status: "AVAILABLE",
      sort: "priceLow",
    };

    renderHook(() => useVehicles(filters), { wrapper });

    await waitFor(() => {
      expect(getVehiclesSpy).toHaveBeenCalledWith({
        search: "",
        category: "",
        status: "AVAILABLE",
        sort: "priceLow",
      });
    });
  });

  it("should handle empty vehicle list", async () => {
    vi.spyOn(apiClient, "getVehicles").mockResolvedValue(page([]));

    const filters: filterModel = {
      search: "nonexistent",
      category: "",
      status: "AVAILABLE",
    };
    const { result } = renderHook(() => useVehicles(filters), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.vehicles).toEqual([]);
  });

  it("should handle errors gracefully", async () => {
    vi.spyOn(apiClient, "getVehicles").mockRejectedValue(
      new Error("Failed to fetch vehicles")
    );

    const filters: filterModel = { search: "", category: "", status: "AVAILABLE" };
    const { result } = renderHook(() => useVehicles(filters), { wrapper });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Vehicles should remain empty array on error
    expect(result.current.vehicles).toEqual([]);
    // Error should be set
    expect(result.current.error).toBe("Failed to fetch vehicles");
  });

  it("should apply search filter correctly", async () => {
    const getVehiclesSpy = vi
      .spyOn(apiClient, "getVehicles")
      .mockResolvedValue(page([buildVehicle()]));

    const filters: filterModel = {
      search: "Activa",
      category: "",
      status: "AVAILABLE",
    };
    renderHook(() => useVehicles(filters), { wrapper });

    await waitFor(() => {
      expect(getVehiclesSpy).toHaveBeenCalledWith({
        search: "Activa",
        category: "",
        status: "AVAILABLE",
      });
    });
  });

  it("should apply category filter correctly", async () => {
    const getVehiclesSpy = vi
      .spyOn(apiClient, "getVehicles")
      .mockResolvedValue(page([buildVehicle()]));

    const filters: filterModel = {
      search: "",
      category: "scooters",
      status: "AVAILABLE",
    };
    renderHook(() => useVehicles(filters), { wrapper });

    await waitFor(() => {
      expect(getVehiclesSpy).toHaveBeenCalledWith({
        search: "",
        category: "scooters",
        status: "AVAILABLE",
      });
    });
  });
});
