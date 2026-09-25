import type { categoryModel } from "../models/categoryModel";
import type { SingleVehicleModel } from "../models/singleVehicleModel";
import type { VehicleModel } from "../models/vehicleModel";
import type { VehicleSortOption } from "../models/vehicleSort";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

async function request(path: string) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }
  return response.json();
}

export function getCategories(): Promise<categoryModel[]> {
  return request("/api/catalog/categories");
}

export function getVehicles(filters: {
  search: string;
  category: string;
  status: string;
  sort?: VehicleSortOption;
}): Promise<PageResponse<VehicleModel>> {
  const params = new URLSearchParams({ page: "0", size: "60" });
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.status && filters.status !== "ALL")
    params.set("status", filters.status);
  if (filters.sort) params.set("sortBy", filters.sort);
  return request(`/api/catalog/vehicles?${params.toString()}`);
}

export function getVehicle(id: string): Promise<SingleVehicleModel> {
  return request(`/api/catalog/vehicles/${id}`);
}

