import type { VehicleModel } from "./vehicleModel";

export interface VehicleImage {
  id: number;
  imageUrl: string;
  altText: string;
  displayOrder: number;
}

export interface VehicleCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export type VehicleDocument = Record<string, never>;

export type VehicleSale = Record<string, never>;

export interface SingleVehicleModel extends VehicleModel {
  registrationNumber: string;
  variantName: string;
  registrationYear: number;
  ownerSerial: number;
  color: string;
  description: string;

  images: VehicleImage[];
  documents: VehicleDocument[];
  sales: VehicleSale[];

  createdAt: string;
}