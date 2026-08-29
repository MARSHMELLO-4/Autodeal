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

  it("should handle 'All Stock' button click to clear category filter", () => {
    let currentFilters: filterModel = {
      ...mockFilters,
      category: "scooters",
    };

    const setFilters = vi.fn((updater) => {
      if (typeof updater === "function") {
        currentFilters = updater(currentFilters);
      }
    });

    render(
      <CategoryRail
        categories={mockCategories}
        filters={currentFilters}
        setFilters={setFilters}
      />
    );

    const allStockButton = screen.getByRole("button", { name: /all stock/i });
    fireEvent.click(allStockButton);

    expect(setFilters).toHaveBeenCalled();
    expect(currentFilters.category).toBe("");
  });

  it("should highlight active category button", () => {
    const activeFilters: filterModel = {
      ...mockFilters,
      category: "cruiser",
    };

    const setFilters = vi.fn();

    render(
      <CategoryRail
        categories={mockCategories}
        filters={activeFilters}
        setFilters={setFilters}
      />
    );

    const cruiserButton = screen.getByRole("button", { name: /cruiser/i });
    expect(cruiserButton).toHaveClass("bg-[var(--maroon)]");
    expect(cruiserButton).toHaveClass("text-white");
  });

  it("should render with empty categories list", () => {
    const setFilters = vi.fn();

    render(
      <CategoryRail
        categories={[]}
        filters={mockFilters}
        setFilters={setFilters}
      />
    );

    expect(screen.getByText("Browse by category")).toBeInTheDocument();
    expect(screen.getByText("1 Categories")).toBeInTheDocument();
    expect(screen.getByText("All Stock")).toBeInTheDocument();
  });

  it("should render description text", () => {
    const setFilters = vi.fn();

    render(
      <CategoryRail
        categories={mockCategories}
        filters={mockFilters}
        setFilters={setFilters}
      />
    );

    expect(screen.getByText("Find the perfect bike for your lifestyle.")).toBeInTheDocument();
  });

  it("should maintain other filters when updating category", () => {
    let currentFilters: filterModel = {
      search: "Yamaha",
      category: "",
      status: "AVAILABLE",
    };

    const setFilters = vi.fn((updater) => {
      if (typeof updater === "function") {
        currentFilters = updater(currentFilters);
      }
    });

    render(
      <CategoryRail
        categories={mockCategories}
        filters={currentFilters}
        setFilters={setFilters}
      />
    );

    const scooterButton = screen.getByRole("button", { name: /scooters/i });
    fireEvent.click(scooterButton);

    expect(currentFilters.category).toBe("scooters");
    expect(currentFilters.search).toBe("Yamaha");
    expect(currentFilters.status).toBe("AVAILABLE");
  });

  it("should render all category names correctly", () => {
    const setFilters = vi.fn();

    render(
      <CategoryRail
        categories={mockCategories}
        filters={mockFilters}
        setFilters={setFilters}
      />
    );

    mockCategories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });
});
