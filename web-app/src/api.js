const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }
  return response.json();
}

export function getCategories() {
  return request("/api/catalog/categories");
}

export function getVehicles(filters) {
  const params = new URLSearchParams({ page: "0", size: "60" });
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.status && filters.status !== "ALL") params.set("status", filters.status);
  return request(`/api/catalog/vehicles?${params.toString()}`);
}

export function getVehicle(id) {
  return request(`/api/catalog/vehicles/${id}`);
}
