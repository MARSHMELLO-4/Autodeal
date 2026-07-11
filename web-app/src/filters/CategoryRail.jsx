import React from "react";

const CategoryRail = ({categories, setFilters, filters}) => {
  return (
    <div>
      <aside className="category-rail">
        <button
          className={!filters.category ? "active" : ""}
          onClick={() =>
            setFilters((current) => ({ ...current, category: "" }))
          }
          type="button"
        >
          All stock
        </button>
        {categories.map((category) => (
          <button
            className={filters.category === category.slug ? "active" : ""}
            key={category.id}
            onClick={() =>
              setFilters((current) => ({
                ...current,
                category: category.slug,
              }))
            }
            type="button"
          >
            {category.name}
          </button>
        ))}
      </aside>
    </div>
  );
};

export default CategoryRail;
