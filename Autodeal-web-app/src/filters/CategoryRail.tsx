import type { Dispatch, SetStateAction } from "react";
import { Bike, ChevronRight } from "lucide-react";
import type { categoryModel } from "../models/categoryModel";
import type { filterModel } from "../models/fIltersModels";

interface CategoryRailProps {
  categories: categoryModel[];
  filters: filterModel;
  setFilters: Dispatch<SetStateAction<filterModel>>;
}

const CategoryRail = ({ categories, filters, setFilters }: CategoryRailProps) => {
  return (
    <section className="mb-10">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl italic text-[var(--ink)]">Browse by category</h2>
          <p className="mt-1 text-sm text-[var(--ink)]/50">Find the perfect bike for your lifestyle.</p>
        </div>
        <span className="hidden rounded-full bg-[var(--paper-soft)] px-4 py-2 text-sm font-semibold text-[var(--ink)]/60 md:block">
          {categories.length + 1} Categories
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setFilters((current) => ({ ...current, category: "" }))}
          className={`group flex min-w-fit items-center gap-2.5 rounded-full border px-5 py-3 transition-all duration-200 ${
            filters.category === ""
              ? "border-[var(--maroon)] bg-[var(--maroon)] text-white shadow-sm"
              : "border-[var(--ink)]/12 bg-white text-[var(--ink)]/70 hover:border-[var(--maroon)]/40"
          }`}
        >
          <Bike size={18} />
          <span className="text-sm font-medium">All Stock</span>
          <ChevronRight size={16} className="transition group-hover:translate-x-1" />
        </button>

        {categories.map((category) => {
          const active = filters.category === category.slug;
          return (
            <button
              key={category.id}
              onClick={() => setFilters((current) => ({ ...current, category: category.slug }))}
              className={`group flex min-w-fit items-center gap-2.5 rounded-full border px-5 py-3 transition-all duration-200 ${
                active
                  ? "border-[var(--maroon)] bg-[var(--maroon)] text-white shadow-sm"
                  : "border-[var(--ink)]/12 bg-white text-[var(--ink)]/70 hover:border-[var(--maroon)]/40"
              }`}
            >
              <Bike size={18} />
              <span className="text-sm font-medium capitalize">{category.name}</span>
              <ChevronRight size={16} className="transition group-hover:translate-x-1" />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryRail;