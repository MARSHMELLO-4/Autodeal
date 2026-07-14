import { Search, SlidersHorizontal, Sparkles, ShieldCheck, BadgeCheck, Wallet } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { filterModel } from "../models/fIltersModels";
import type { categoryModel } from "../models/categoryModel";
import { statusOptions } from "../utils/constants";

interface FilterPanelProps {
  filters: filterModel;
  categories: categoryModel[];
  setFilters: Dispatch<SetStateAction<filterModel>>;
}

const FilterPanel = ({ filters, categories, setFilters }: FilterPanelProps) => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--ink)]/8 bg-[var(--paper-soft)] px-8 py-16 shadow-sm" id="categories">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[var(--marigold)]/20 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-[var(--maroon)]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--maroon)]/25 bg-white px-4 py-2 text-sm font-semibold text-[var(--maroon)]">
            <Sparkles size={16} />
            Trusted Used Two-Wheeler Dealer
          </span>

          <h1 className="font-display mt-6 text-5xl italic leading-[1.05] text-[var(--ink)] lg:text-6xl">
            Find your next
            <span className="block not-italic text-[var(--maroon)]">dream ride.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--ink)]/65">
            Explore verified pre-owned motorcycles and scooters with transparent
            pricing, quality inspections, and hassle-free documentation.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-sm">
              <ShieldCheck className="text-[var(--moss)]" size={18} />
              <span className="text-sm font-medium text-[var(--ink)]/80">Verified Vehicles</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-sm">
              <BadgeCheck className="text-[var(--moss)]" size={18} />
              <span className="text-sm font-medium text-[var(--ink)]/80">Quality Checked</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-sm">
              <Wallet className="text-[var(--marigold)]" size={18} />
              <span className="text-sm font-medium text-[var(--ink)]/80">Finance Available</span>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-6">
            <label className="flex items-center gap-4 rounded-xl border border-[var(--ink)]/12 px-5 py-4 transition focus-within:border-[var(--maroon)]">
              <Search className="text-[var(--maroon)]" size={20} />
              <input
                value={filters.search}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, search: event.target.value }))
                }
                placeholder="Search by brand, model, colour or registration number"
                className="w-full bg-transparent text-lg text-[var(--ink)] outline-none placeholder:text-[var(--ink)]/35"
              />
            </label>

            <div className="grid gap-5 lg:grid-cols-[250px_1fr]">
              <label className="flex items-center gap-3 rounded-xl border border-[var(--ink)]/12 px-4 py-3">
                <SlidersHorizontal className="text-[var(--maroon)]" size={17} />
                <select
                  value={filters.category}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, category: event.target.value }))
                  }
                  className="w-full bg-transparent text-[var(--ink)] outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
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
                    onClick={() => setFilters((current) => ({ ...current, status: option.value }))}
                    className={`rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                      filters.status === option.value
                        ? "bg-[var(--maroon)] text-white shadow-sm"
                        : "border border-[var(--ink)]/12 bg-transparent text-[var(--ink)]/70 hover:border-[var(--maroon)]/40"
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