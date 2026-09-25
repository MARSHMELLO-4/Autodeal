import { Search, X, RotateCcw, Check, ArrowUpDown } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { filterModel } from "../models/fIltersModels";
import type { categoryModel } from "../models/categoryModel";
import {
  DEFAULT_VEHICLE_SORT,
  VEHICLE_SORT_OPTIONS,
  type VehicleSortOption,
} from "../models/vehicleSort";
import { useLanguage } from "../i18n/useLanguage";
import type { Translations } from "../i18n/translations";

interface FilterPanelProps {
  filters: filterModel;
  categories: categoryModel[];
  setFilters: Dispatch<SetStateAction<filterModel>>;
}

const STATUS_OPTIONS: {
  value: filterModel["status"];
  labelKey: keyof Translations;
}[] = [
  { value: "AVAILABLE", labelKey: "filterAvailable" },
  { value: "ALL", labelKey: "filterAll" },
  { value: "RESERVED", labelKey: "reserved" },
  { value: "SOLD", labelKey: "sold" },
];

const FilterPanel = ({
  filters,
  categories,
  setFilters,
}: FilterPanelProps) => {
  const { t } = useLanguage();
  const activeSort: VehicleSortOption = filters.sort ?? DEFAULT_VEHICLE_SORT;
  const isFiltered =
    filters.search !== "" ||
    filters.category !== "" ||
    filters.status !== "AVAILABLE" ||
    activeSort !== DEFAULT_VEHICLE_SORT;

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      status: "AVAILABLE",
      sort: DEFAULT_VEHICLE_SORT,
    });
  };

  return (
    <section className="space-y-3" id="categories">
      {/* Search + Reset */}
      <div className="flex items-center gap-2">
        <div className="relative flex flex-1 items-center rounded-2xl border border-hairedge bg-white px-4 py-3 shadow-xs transition-all duration-200 focus-within:-translate-y-px focus-within:border-maroon-300 focus-within:shadow-[0_8px_24px_-12px_rgba(153,27,27,0.35)] focus-within:ring-4 focus-within:ring-maroon-50">
          <Search
            className="shrink-0 text-moss mr-2.5 transition-colors duration-200 focus-within:text-maroon-600"
            size={18}
          />

          <input
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                search: event.target.value,
              }))
            }
            placeholder={t("searchPlaceholder")}
            className="w-full bg-transparent text-sm sm:text-base text-ink outline-none placeholder:text-moss/70 font-medium"
          />

          {filters.search && (
            <button
              type="button"
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  search: "",
                }))
              }
              className="btn-spring flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-maroon-50 text-maroon-700"
              aria-label={t("clearSearch")}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={clearFilters}
            className="anim-pop btn-spring flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-maroon-100 bg-maroon-50 text-maroon-700 hover:bg-maroon-100 cursor-pointer"
            title={t("resetFilters")}
            aria-label={t("resetFilters")}
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex flex-1 items-center rounded-2xl border border-hairedge bg-white px-4 py-2.5 shadow-xs transition-all duration-200 focus-within:border-maroon-300 focus-within:ring-4 focus-within:ring-maroon-50">
          <ArrowUpDown
            className="mr-2 shrink-0 text-moss"
            size={16}
            aria-hidden="true"
          />

          <label htmlFor="vehicle-sort" className="sr-only">
            {t("sortBy")}
          </label>

          <select
            id="vehicle-sort"
            value={activeSort}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                sort: event.target.value as VehicleSortOption,
              }))
            }
            className="w-full cursor-pointer appearance-none bg-transparent pr-6 text-xs font-bold text-ink outline-none sm:text-sm"
          >
            {VEHICLE_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey)}
              </option>
            ))}
          </select>

          <span
            className="pointer-events-none absolute right-4 text-moss"
            aria-hidden="true"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Segmented Status Control (thumb-friendly) */}
      <div className="grid grid-cols-4 gap-1 rounded-2xl border border-hairedge bg-paper p-1 shadow-xs">
        {STATUS_OPTIONS.map((option) => {
          const active = filters.status === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  status: option.value,
                }))
              }
              aria-pressed={active}
              className={`btn-spring flex items-center justify-center gap-1 rounded-xl px-1 py-2.5 text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                active
                  ? "bg-white text-maroon-800 shadow-sm ring-1 ring-black/5"
                  : "text-moss hover:text-ink"
              }`}
            >
              {active && (
                <Check size={13} className="shrink-0 text-emerald-600" />
              )}
              <span className="truncate">{t(option.labelKey)}</span>
            </button>
          );
        })}
      </div>

      {/* Touch-scrollable Category Chips */}
      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-1">
          {/* All Category Pill */}
          <button
            type="button"
            onClick={() =>
              setFilters((current) => ({
                ...current,
                category: "",
              }))
            }
            className={`btn-spring flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold cursor-pointer ${
              filters.category === ""
                ? "animate-zoom bg-gradient-to-br from-maroon-700 to-maroon-800 text-white shadow-md shadow-maroon-900/25"
                : "border border-hairedge bg-white text-ink hover:border-maroon-200 hover:bg-maroon-50/60"
            }`}
          >
            <span>{t("allBikes")}</span>
          </button>

          {/* Individual Category Pills */}
          {categories.map((category) => {
            const isActive = filters.category === category.slug;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    category: category.slug,
                  }))
                }
                className={`btn-spring flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold cursor-pointer ${
                  isActive
                    ? "animate-zoom bg-gradient-to-br from-maroon-700 to-maroon-800 text-white shadow-md shadow-maroon-900/25"
                    : "border border-hairedge bg-white text-ink hover:border-maroon-200 hover:bg-maroon-50/60"
                }`}
              >
                <span className="capitalize">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FilterPanel;