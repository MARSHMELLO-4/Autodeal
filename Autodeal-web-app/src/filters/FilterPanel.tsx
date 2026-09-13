
import { Search, X, SlidersHorizontal, RotateCcw } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { filterModel } from "../models/fIltersModels";
import type { categoryModel } from "../models/categoryModel";

interface FilterPanelProps {
  filters: filterModel;
  categories: categoryModel[];
  setFilters: Dispatch<SetStateAction<filterModel>>;
}

const FilterPanel = ({
  filters,
  categories,
  setFilters,
}: FilterPanelProps) => {
  const isFiltered = filters.search !== "" || filters.category !== "" || filters.status !== "AVAILABLE";

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      status: "AVAILABLE",
    });
  };

  return (
    <section
      className="space-y-3"
      id="categories"
    >
      {/* Search & Status Bar */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex flex-1 items-center rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-xs transition-all focus-within:border-[var(--maroon)] focus-within:ring-2 focus-within:ring-red-100">
          <Search
            className="shrink-0 text-slate-400 mr-2.5"
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
            placeholder="Search by brand, model, colour..."
            className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-slate-400 font-medium"
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
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition active:scale-95"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filter & Reset */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-44">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-xs focus-within:border-[var(--maroon)] focus-within:ring-2 focus-within:ring-red-100">
              <SlidersHorizontal size={16} className="text-slate-400 shrink-0" />
              <select
                value={filters.status}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    status: event.target.value as any,
                  }))
                }
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="AVAILABLE">Available Only</option>
                <option value="ALL">All Inventory</option>
                <option value="RESERVED">Reserved</option>
                <option value="SOLD">Sold</option>
              </select>
            </div>
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-2xl border border-red-200 bg-red-50/70 px-3 py-2.5 text-xs font-bold text-[var(--maroon)] transition hover:bg-red-100 active:scale-95 cursor-pointer shrink-0"
              title="Reset all filters"
            >
              <RotateCcw size={14} />
              <span className="hidden xs:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Touch-scrollable Category Chips */}
      <div className="relative -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
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
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
              filters.category === ""
                ? "bg-[var(--maroon)] text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span>All Bikes</span>
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
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                  isActive
                    ? "bg-[var(--maroon)] text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FilterPanel;
