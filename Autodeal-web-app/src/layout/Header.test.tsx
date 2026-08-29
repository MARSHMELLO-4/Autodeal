import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header component", () => {
  it("should render dealership title and navigation links", () => {
    render(<Header />);

    expect(screen.getByText("Shree Ganesh")).toBeInTheDocument();
    expect(screen.getByText("Autodeal")).toBeInTheDocument();
    expect(screen.getByText("Verified Pre-Owned Bikes")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /inventory/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /categories/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /whatsapp/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /call dealer/i })).toBeInTheDocument();
  });

  it("should render all navigation links with correct hrefs", () => {
    render(<Header />);

    const inventoryLink = screen.getByRole("link", { name: /inventory/i });
    const categoriesLink = screen.getByRole("link", { name: /categories/i });
    const whatsappLink = screen.getByRole("link", { name: /whatsapp/i });
    const callLink = screen.getByRole("link", { name: /call dealer/i });

    expect(inventoryLink).toHaveAttribute("href", "#inventory");
    expect(categoriesLink).toHaveAttribute("href", "#categories");
    expect(whatsappLink).toHaveAttribute("href", expect.stringContaining("wa.me"));
    expect(callLink).toHaveAttribute("href", "tel:+918982883521");
  });

  it("should render mobile menu button", () => {
    render(<Header />);

    const menuButton = screen.getByRole("button");
    expect(menuButton).toBeInTheDocument();
  });

  it("should have sticky positioning", () => {
    const { container } = render(<Header />);
    
    const header = container.querySelector("header");
    expect(header).toHaveClass("sticky");
    expect(header).toHaveClass("top-0");
    expect(header).toHaveClass("z-50");
  });

  it("should render with accessible semantic structure", () => {
    const { container } = render(<Header />);

    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();

    const nav = container.querySelector("nav");
    expect(nav).toBeInTheDocument();
  });

  it("should render WhatsApp link with phone number", () => {
    render(<Header />);

    const whatsappLink = screen.getByRole("link", { name: /whatsapp/i });
    expect(whatsappLink).toHaveAttribute("href", "https://wa.me/918982883521");
  });

  it("should render call dealer link with phone number", () => {
    render(<Header />);

    const callLink = screen.getByRole("link", { name: /call dealer/i });
    expect(callLink).toHaveAttribute("href", "tel:+918982883521");
  });

  it("should display tagline text", () => {
    render(<Header />);

    const tagline = screen.getByText("Verified Pre-Owned Bikes");
    expect(tagline).toBeInTheDocument();
  });
});
