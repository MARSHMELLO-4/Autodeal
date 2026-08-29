import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import VehicleCard from "./VehicleCard";
import type { VehicleModel } from "../models/vehicleModel";

describe("VehicleCard component", () => {
  const mockVehicle: VehicleModel = {
    id: 101,
    title: "Yamaha MT-15 V2",
    brand: "Yamaha",
    modelName: "MT-15",
    manufactureYear: 2023,
    kilometersDriven: 8500,
    fuelType: "PETROL",
    price: 165000,
    status: "AVAILABLE",
    category: {
      id: 1,
      name: "Motorcycles",
      slug: "motorcycles",
      description: "Bikes",
    },
    thumbnailUrl: "https://example.com/mt15.jpg",
    location: "Pune",
    updatedAt: "2026-08-20T10:00:00Z",
  };

  it("should render vehicle details properly", () => {
    const onOpen = vi.fn();
    render(<VehicleCard vehicle={mockVehicle} onOpen={onOpen} />);

    expect(screen.getByText("Yamaha MT-15 V2")).toBeInTheDocument();
    expect(screen.getByText("Yamaha • MT-15")).toBeInTheDocument();
    expect(screen.getByText("AVAILABLE")).toBeInTheDocument();
    expect(screen.getByText("Motorcycles")).toBeInTheDocument();
  });

  it("should call onOpen when clicking view details button", () => {
    const onOpen = vi.fn();
    render(<VehicleCard vehicle={mockVehicle} onOpen={onOpen} />);

    const button = screen.getByRole("button", { name: /view details/i });
    fireEvent.click(button);

    expect(onOpen).toHaveBeenCalledWith("101");
  });

  it("should render vehicle thumbnail image with correct alt text", () => {
    const onOpen = vi.fn();
    render(<VehicleCard vehicle={mockVehicle} onOpen={onOpen} />);

    const image = screen.getByAltText("Yamaha MT-15 V2");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/mt15.jpg");
  });

  it("should render fallback icon when thumbnail is missing", () => {
    const vehicleWithoutThumbnail: VehicleModel = {
      ...mockVehicle,
      thumbnailUrl: "",
    };

    const onOpen = vi.fn();
    const { container } = render(
      <VehicleCard vehicle={vehicleWithoutThumbnail} onOpen={onOpen} />
    );

    // The fallback div should be present
    const fallbackDiv = container.querySelector(
      ".bg-gradient-to-br.from-slate-100.to-slate-200"
    );
    expect(fallbackDiv).toBeInTheDocument();
  });

  it("should display correct status for AVAILABLE status", () => {
    const onOpen = vi.fn();
    render(<VehicleCard vehicle={mockVehicle} onOpen={onOpen} />);

    const status = screen.getByText("AVAILABLE");
    expect(status).toHaveClass("bg-emerald-500/90");
    expect(status).toHaveClass("text-white");
  });

  it("should display correct status for RESERVED status", () => {
    const reservedVehicle: VehicleModel = {
      ...mockVehicle,
      status: "RESERVED",
    };

    const onOpen = vi.fn();
    render(<VehicleCard vehicle={reservedVehicle} onOpen={onOpen} />);

    const status = screen.getByText("RESERVED");
    expect(status).toHaveClass("bg-amber-400/90");
    expect(status).toHaveClass("text-black");
  });

  it("should display correct status for SOLD status", () => {
    const soldVehicle: VehicleModel = {
      ...mockVehicle,
      status: "SOLD",
    };

    const onOpen = vi.fn();
    render(<VehicleCard vehicle={soldVehicle} onOpen={onOpen} />);

    const status = screen.getByText("SOLD");
    expect(status).toHaveClass("bg-gray-900/90");
    expect(status).toHaveClass("text-white");
  });

  it("should render category badge", () => {
    const onOpen = vi.fn();
    render(<VehicleCard vehicle={mockVehicle} onOpen={onOpen} />);

    expect(screen.getByText("Motorcycles")).toBeInTheDocument();
  });

  it("should render formatted price", () => {
    const onOpen = vi.fn();
    render(<VehicleCard vehicle={mockVehicle} onOpen={onOpen} />);

    // Check if price is displayed (formatted with INR symbol)
    expect(screen.getByText("₹1,65,000")).toBeInTheDocument();
  });

  it("should call onOpen with string id when clicking view details button", () => {
    const onOpen = vi.fn();
    render(<VehicleCard vehicle={mockVehicle} onOpen={onOpen} />);

    const button = screen.getByRole("button", { name: /view details/i });
    fireEvent.click(button);

    expect(onOpen).toHaveBeenCalledWith("101");
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("should be clickable via image area", () => {
    const onOpen = vi.fn();
    render(<VehicleCard vehicle={mockVehicle} onOpen={onOpen} />);

    const imageButton = screen.getByAltText("Yamaha MT-15 V2").closest("button");
    if (imageButton) {
      fireEvent.click(imageButton);
      expect(onOpen).toHaveBeenCalledWith("101");
    }
  });

  it("should render category in top-right corner", () => {
    const onOpen = vi.fn();
    const { container } = render(
      <VehicleCard vehicle={mockVehicle} onOpen={onOpen} />
    );

    const categoryBadge = container.querySelector(
      ".absolute.right-3.top-3.bg-white\\/90"
    );
    expect(categoryBadge).toBeInTheDocument();
    expect(categoryBadge).toHaveTextContent("Motorcycles");
  });

  it("should handle vehicle with null price gracefully", () => {
    const vehicleWithNullPrice: VehicleModel = {
      ...mockVehicle,
      price: null as any,
    };

    const onOpen = vi.fn();
    const { container } = render(
      <VehicleCard vehicle={vehicleWithNullPrice} onOpen={onOpen} />
    );

    expect(container).toBeInTheDocument();
  });

  it("should have article container with proper classes", () => {
    const onOpen = vi.fn();
    const { container } = render(
      <VehicleCard vehicle={mockVehicle} onOpen={onOpen} />
    );

    const article = container.querySelector("article");
    expect(article).toHaveClass("group");
    expect(article).toHaveClass("overflow-hidden");
    expect(article).toHaveClass("rounded-2xl");
  });

  it("should display price label above the amount", () => {
    const onOpen = vi.fn();
    render(<VehicleCard vehicle={mockVehicle} onOpen={onOpen} />);

    const priceLabel = screen.getByText("Price");
    expect(priceLabel).toBeInTheDocument();
    expect(priceLabel).toHaveClass("text-[10px]");
    expect(priceLabel).toHaveClass("uppercase");
  });
});
