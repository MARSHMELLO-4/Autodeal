import type { filterModel } from "../models/fIltersModels";
import type { VehicleModel } from "../models/vehicleModel";

export function vehicleMatchesFilters(vehicle: VehicleModel, filters: filterModel) {
  if (filters.status !== "ALL" && vehicle.status !== filters.status) {
    return false;
  }

  if (filters.category && vehicle.category?.slug !== filters.category) {
    return false;
  }

  const search = filters.search.trim().toLowerCase();
  if (!search) {
    return true;
  }

  return [
    vehicle.title,
    vehicle.brand,
    vehicle.modelName,
    vehicle.location,
    String(vehicle.manufactureYear),
  ]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(search));
}
