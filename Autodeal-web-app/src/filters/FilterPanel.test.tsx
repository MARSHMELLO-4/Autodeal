import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterPanel from "./FilterPanel";
import type { filterModel } from "../models/fIltersModels";
import type { categoryModel } from "../models/categoryModel";
import { DEFAULT_VEHICLE_SORT } from "../models/vehicleSort";

describe("FilterPanel component", () => {
  const mockCategories: categoryModel[] = [
    { id: 1, name: "Scooters", slug: "scooters", description: "Automatic scooters" },
  ];

  const mockFilters: filterModel = {
    search: "",
    category: "",
    status: "AVAILABLE",
    sort: DEFAULT_VEHICLE_SORT,
  };

  function renderPanel(overrides: Partial<filterModel> = {}) {
    const filters: filterModel = { ...mockFilters, ...overrides };
    const setFilters = vi.fn();
    render(
      <FilterPanel
        filters={filters}
        categories={mockCategories}
        setFilters={setFilters}
      />,
    );
    return { filters, setFilters };
  }

  it("should render the sort control with the active option selected", () => {
    renderPanel({ sort: "priceLow" });

    const select = screen.getByLabelText("Sort by") as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(select.value).toBe("priceLow");
  });

  it("should default to newest when the filter has no sort", () => {
    renderPanel({ sort: undefined });

    const select = screen.getByLabelText("Sort by") as HTMLSelectElement;
    expect(select.value).toBe("newest");
  });

  it("should offer every supported sort option", () => {
    renderPanel();

    const select = screen.getByLabelText("Sort by") as HTMLSelectElement;
    const values = Array.from(select.options).map((option) => option.value);

    expect(values).toEqual([
      "newest",
      "oldest",
      "priceLow",
      "priceHigh",
      "yearNew",
      "yearOld",
      "mileageLow",
      "mileageHigh",
      "titleAZ",
    ]);
  });

  it("should update the sort filter when an option is selected", () => {
    let currentFilters: filterModel = { ...mockFilters };
    const setFilters = vi.fn((updater) => {
      if (typeof updater === "function") {
        currentFilters = updater(currentFilters);
      }
    });

    render(
      <FilterPanel
        filters={mockFilters}
        categories={mockCategories}
        setFilters={setFilters}
      />,
    );

    fireEvent.change(screen.getByLabelText("Sort by"), {
      target: { value: "mileageLow" },
    });

    expect(setFilters).toHaveBeenCalledTimes(1);
    expect(currentFilters).toEqual({ ...mockFilters, sort: "mileageLow" });
  });

  it("should reset sort back to newest together with other filters", () => {
    const { setFilters } = renderPanel({ search: "Activa", sort: "priceHigh" });

    const resetButton = screen.getByRole("button", { name: "Reset" });
    fireEvent.click(resetButton);

    expect(setFilters).toHaveBeenCalledWith({
      search: "",
      category: "",
      status: "AVAILABLE",
      sort: DEFAULT_VEHICLE_SORT,
    });
  });

  it("should show the reset action when only the sort changed", () => {
    renderPanel({ sort: "titleAZ" });

    expect(
      screen.getByRole("button", { name: "Reset" }),
    ).toBeInTheDocument();
  });
});
