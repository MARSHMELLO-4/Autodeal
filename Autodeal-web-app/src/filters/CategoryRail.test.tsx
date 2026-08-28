import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CategoryRail from "./CategoryRail";
import type { categoryModel } from "../models/categoryModel";
import type { filterModel } from "../models/fIltersModels";

describe("CategoryRail component", () => {
  const mockCategories: categoryModel[] = [
    { id: 1, name: "Scooters", slug: "scooters", description: "Automatic scooters" },
    { id: 2, name: "Cruiser", slug: "cruiser", description: "Cruisers" },
  ];

  const mockFilters: filterModel = {
    search: "",
    category: "",
    status: "AVAILABLE",
  };

  it("should render categories count and category buttons", () => {
    const setFilters = vi.fn();
    render(
      <CategoryRail
        categories={mockCategories}
        filters={mockFilters}
        setFilters={setFilters}
      />
    );

    expect(screen.getByText("Browse by category")).toBeInTheDocument();
    expect(screen.getByText("3 Categories")).toBeInTheDocument();
    expect(screen.getByText("All Stock")).toBeInTheDocument();
    expect(screen.getByText("Scooters")).toBeInTheDocument();
    expect(screen.getByText("Cruiser")).toBeInTheDocument();
  });

  it("should update category filter when clicked", () => {
    let currentFilters = { ...mockFilters };
    const setFilters = vi.fn((updater) => {
      if (typeof updater === "function") {
        currentFilters = updater(currentFilters);
      }
    });

    render(
      <CategoryRail
        categories={mockCategories}
        filters={mockFilters}
        setFilters={setFilters}
      />
    );

    const scooterButton = screen.getByRole("button", { name: /scooters/i });
    fireEvent.click(scooterButton);

    expect(setFilters).toHaveBeenCalled();
    expect(currentFilters.category).toBe("scooters");
  });
});
