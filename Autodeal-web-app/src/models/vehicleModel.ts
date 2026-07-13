import type { categoryModel } from "./CategoryModel";

export interface VehicleModel {
  id: number;
  title: string;
  brand: string;
  modelName: string;
  manufactureYear: number;
  kilometersDriven: number;
  fuelType: "PETROL" | "DIESEL" | "ELECTRIC" | "CNG" | "HYBRID";
  price: number;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  category: categoryModel;
  thumbnailUrl: string | null;
  location: string;
  updatedAt: string;
}