import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useVehicle } from "./useVehicle";
import * as apiClient from "../api/api-client";

describe("useVehicle hook", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch single vehicle and manage loading state", async () => {
    const mockVehicle = { id: 10, title: "Royal Enfield 350", price: 180000 };

    vi.spyOn(apiClient, "getVehicle").mockResolvedValue({
      content: mockVehicle,
    } as any);

    const { result } = renderHook(() => useVehicle("10"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.vehicle).toEqual(mockVehicle);
  });

  it("should refetch vehicle when id changes", async () => {
    const mockVehicle1 = { id: 10, title: "Royal Enfield 350" };
    const mockVehicle2 = { id: 20, title: "Honda CB350" };

    const getVehicleSpy = vi
      .spyOn(apiClient, "getVehicle")
      .mockResolvedValueOnce({
        content: mockVehicle1,
      } as any)
      .mockResolvedValueOnce({
        content: mockVehicle2,
      } as any);

    const { result, rerender } = renderHook(
      ({ id }) => useVehicle(id),
      { initialProps: { id: "10" } }
    );

    await waitFor(() => {
      expect(result.current.vehicle).toEqual(mockVehicle1);
    });

    expect(getVehicleSpy).toHaveBeenCalledWith("10");

    rerender({ id: "20" });

    await waitFor(() => {
      expect(result.current.vehicle).toEqual(mockVehicle2);
    });

    expect(getVehicleSpy).toHaveBeenCalledWith("20");
    expect(getVehicleSpy).toHaveBeenCalledTimes(2);
  });

  it("should handle errors gracefully", async () => {
    vi.spyOn(apiClient, "getVehicle").mockRejectedValue(
      new Error("Failed to fetch vehicle")
    );

    const { result } = renderHook(() => useVehicle("10"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Vehicle should remain undefined on error
    expect(result.current.vehicle).toBeUndefined();
    // Error should be set
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toBe("Failed to fetch vehicle");
  });

  it("should set loading to false after successful fetch", async () => {
    const mockVehicle = { id: 10, title: "Yamaha MT-15" };

    vi.spyOn(apiClient, "getVehicle").mockResolvedValue({
      content: mockVehicle,
    } as any);

    const { result } = renderHook(() => useVehicle("10"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.vehicle).toEqual(mockVehicle);
    });
  });
});
