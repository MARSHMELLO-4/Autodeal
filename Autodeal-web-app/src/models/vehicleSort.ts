import type { Translations } from "../i18n/translations";

export type VehicleSortOption =
  | "newest"
  | "oldest"
  | "priceLow"
  | "priceHigh"
  | "yearNew"
  | "yearOld"
  | "mileageLow"
  | "mileageHigh"
  | "titleAZ";

export interface VehicleSortChoice {
  value: VehicleSortOption;
  labelKey: keyof Translations;
}

export const VEHICLE_SORT_OPTIONS: VehicleSortChoice[] = [
  { value: "newest", labelKey: "sortNewest" },
  { value: "oldest", labelKey: "sortOldest" },
  { value: "priceLow", labelKey: "sortPriceLow" },
  { value: "priceHigh", labelKey: "sortPriceHigh" },
  { value: "yearNew", labelKey: "sortYearNew" },
  { value: "yearOld", labelKey: "sortYearOld" },
  { value: "mileageLow", labelKey: "sortMileageLow" },
  { value: "mileageHigh", labelKey: "sortMileageHigh" },
  { value: "titleAZ", labelKey: "sortTitleAZ" },
];

export const DEFAULT_VEHICLE_SORT: VehicleSortOption = "newest";
