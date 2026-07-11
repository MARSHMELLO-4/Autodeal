import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import React from "react";
import { statusOptions } from "../utils/constants";

const FilterPanel = ({filters, categories, onChange}) => {
  return (
    <section className="catalog-head">
      <div>
        <p className="eyebrow">
          <Sparkles size={16} /> Verified resale bikes
        </p>
        <h1>Find the right two-wheeler for your next ride.</h1>
      </div>
      <div className="search-panel">
        <label className="search-box">
          <Search size={18} />
          <input
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                search: event.target.value,
              }))
            }
            placeholder="Search by brand, model, color, number"
          />
        </label>
        <div className="filter-row">
          <label>
            <SlidersHorizontal size={16} />
            <select
              value={filters.category}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  category: event.target.value,
                }))
              }
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option value={category.slug} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <div className="segmented" aria-label="Vehicle status filter">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                className={filters.status === option.value ? "active" : ""}
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    status: option.value,
                  }))
                }
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterPanel;
