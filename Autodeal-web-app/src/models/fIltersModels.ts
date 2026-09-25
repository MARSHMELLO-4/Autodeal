import type { VehicleSortOption } from "./vehicleSort";

export interface filterModel{
    search : string,
    category : string,
    status : "AVAILABLE" | "SOLD" | "ALL" | "RESERVED",
    sort ? : VehicleSortOption,
}
