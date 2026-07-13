import type { Dispatch, SetStateAction } from "react";
import {
  Bike,
  ChevronRight,
} from "lucide-react";

import type { categoryModel } from "../models/CategoryModel";
import type { filterModel } from "../models/FIltersModels";

interface CategoryRailProps {
  categories: categoryModel[];
  filters: filterModel;
  setFilters: Dispatch<SetStateAction<filterModel>>;
}

const CategoryRail = ({
  categories,
  filters,
  setFilters,
}: CategoryRailProps) => {
  return (
    <section className="mb-10">

      <div className="mb-5 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Browse by Category
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Find the perfect bike for your lifestyle.
          </p>
        </div>

        <span className="hidden rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 md:block">
          {categories.length + 1} Categories
        </span>

      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">

        {/* All Stock */}

        <button
          onClick={() =>
            setFilters((current) => ({
              ...current,
              category: "",
            }))
          }
          className={`group flex min-w-fit items-center gap-3 rounded-2xl border px-6 py-4 transition-all duration-300 ${
            filters.category === ""
              ? "border-emerald-700 bg-emerald-700 text-white shadow-lg"
              : "border-gray-200 bg-white hover:border-emerald-400 hover:bg-emerald-50"
          }`}
        >
          <Bike size={20} />

          <span className="font-medium">
            All Stock
          </span>

          <ChevronRight
            size={18}
            className="transition group-hover:translate-x-1"
          />
        </button>

        {/* Categories */}

        {categories.map((category) => {

          const active =
            filters.category === category.slug;

          return (
            <button
              key={category.id}
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  category: category.slug,
                }))
              }
              className={`group flex min-w-fit items-center gap-3 rounded-2xl border px-6 py-4 transition-all duration-300 ${
                active
                  ? "border-emerald-700 bg-emerald-700 text-white shadow-lg"
                  : "border-gray-200 bg-white hover:border-emerald-400 hover:bg-emerald-50"
              }`}
            >
              <Bike size={20} />

              <span className="font-medium capitalize">
                {category.name}
              </span>

              <ChevronRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryRail;