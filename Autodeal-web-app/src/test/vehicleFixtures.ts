import type { categoryModel } from "../models/categoryModel";
import type { SingleVehicleModel } from "../models/singleVehicleModel";
import type { VehicleModel } from "../models/vehicleModel";

export const mockCategory: categoryModel = {
  id: 1,
  name: "Motorcycles",
  slug: "motorcycles",
  description: "Bikes",
};

export function buildVehicle(overrides: Partial<VehicleModel> = {}): VehicleModel {
  return {
    id: 1,
    title: "Royal Enfield Classic 350",
    brand: "Royal Enfield",
    modelName: "Classic 350",
    manufactureYear: 2023,
    kilometersDriven: 12000,
    fuelType: "PETROL",
    price: 180000,
    status: "AVAILABLE",
    category: mockCategory,
    thumbnailUrl: "https://example.com/classic350.jpg",
    location: "Pune",
    updatedAt: "2026-08-20T10:00:00Z",
    ...overrides,
  };
}

export function buildSingleVehicle(
  overrides: Partial<SingleVehicleModel> = {},
): SingleVehicleModel {
  return {
    ...buildVehicle(),
    registrationNumber: "MH12XY1234",
    variantName: "Halcyon",
    registrationYear: 2023,
    ownerSerial: 1,
    color: "Metallic Black",
    description: "Excellent condition",
    images: [],
    documents: [],
    sales: [],
    createdAt: "2026-08-20T10:00:00Z",
    ...overrides,
  };
}
