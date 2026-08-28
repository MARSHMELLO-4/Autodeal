
import { Search, SlidersHorizontal } from "lucide-react";
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
  return (
    <section
      className="rounded-2xl border border-[var(--ink)]/8 bg-white p-4 shadow-sm"
      id="categories"
    >
      <div className="flex flex-col gap-3 md:flex-row">

        {/* Search */}

        <label className="flex flex-1 items-center gap-3 rounded-xl border border-[var(--ink)]/10 px-4 py-3 transition focus-within:border-[var(--maroon)]">
          <Search
            className="shrink-0 text-[var(--maroon)]"
            size={19}
          />

          <input
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                search: event.target.value,
              }))
            }
            placeholder="Search by brand, model, colour or registration number"
            className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink)]/35"
          />
        </label>


        {/* Category */}

        <label className="flex w-full items-center gap-3 rounded-xl border border-[var(--ink)]/10 px-4 py-3 transition focus-within:border-[var(--maroon)] md:w-64">
          <SlidersHorizontal
            className="shrink-0 text-[var(--maroon)]"
            size={18}
          />

          <select
            value={filters.category}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                category: event.target.value,
              }))
            }
            className="w-full bg-transparent text-sm text-[var(--ink)] outline-none"
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.slug}
              >
                {category.name}
              </option>
            ))}
          </select>
        </label>

      </div>
    </section>
  );
};

export default FilterPanel;
