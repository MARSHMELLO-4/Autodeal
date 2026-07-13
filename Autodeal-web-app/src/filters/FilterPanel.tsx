import {
  Search,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  Wallet,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { filterModel } from "../models/FIltersModels";
import type { categoryModel } from "../models/CategoryModel";
import { statusOptions } from "../utils/constants";

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
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 px-8 py-16 text-white shadow-2xl">

      {/* Decorative circles */}
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">

        {/* Hero */}
        <div className="max-w-3xl">

          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-100 backdrop-blur">
            <Sparkles size={16} />
            Trusted Used Two-Wheeler Dealer
          </span>

          <h1 className="mt-6 text-5xl font-black leading-tight lg:text-6xl">
            Find Your Next
            <span className="block text-emerald-300">
              Dream Ride.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-100/90">
            Explore verified pre-owned motorcycles and scooters with transparent
            pricing, quality inspections, and hassle-free documentation.
          </p>

          {/* Trust badges */}

          <div className="mt-8 flex flex-wrap gap-4">

            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
              <ShieldCheck className="text-emerald-300" size={20} />
              <span>Verified Vehicles</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
              <BadgeCheck className="text-emerald-300" size={20} />
              <span>Quality Checked</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
              <Wallet className="text-emerald-300" size={20} />
              <span>Finance Available</span>
            </div>

          </div>

        </div>

        {/* Search Panel */}

        <div className="mt-12 rounded-3xl bg-white p-6 text-gray-900 shadow-2xl">

          <div className="flex flex-col gap-6">

            {/* Search */}

            <label className="flex items-center gap-4 rounded-2xl border border-gray-200 px-5 py-4 transition focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-100">

              <Search
                className="text-emerald-700"
                size={22}
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
                className="w-full bg-transparent text-lg outline-none placeholder:text-gray-400"
              />
            </label>

            {/* Filters */}

            <div className="grid gap-5 lg:grid-cols-[250px_1fr]">

              <label className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3">

                <SlidersHorizontal
                  className="text-emerald-700"
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
                  className="w-full bg-transparent outline-none"
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

              <div className="flex flex-wrap gap-3">

                {statusOptions.map((option) => (

                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFilters((current) => ({
                        ...current,
                        status: option.value,
                      }))
                    }
                    className={`rounded-xl px-5 py-3 font-medium transition-all duration-300 ${
                      filters.status === option.value
                        ? "bg-emerald-700 text-white shadow-lg"
                        : "border border-gray-200 bg-gray-50 hover:border-emerald-500 hover:bg-emerald-50"
                    }`}
                  >
                    {option.label}
                  </button>

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default FilterPanel;