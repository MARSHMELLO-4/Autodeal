import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import LanguageToggle from "../layout/LanguageToggle";

function TestConsumer() {
  const { language, t } = useLanguage();
  return (
    <div>
      <LanguageToggle />
      <span data-testid="current-lang">{language}</span>
      <span data-testid="translated-text">{t("verifiedInventory")}</span>
    </div>
  );
}

describe("Language switching and LanguageToggle component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to English when no preference is in localStorage", () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    );

    expect(screen.getByTestId("current-lang")).toHaveTextContent("en");
    expect(screen.getByTestId("translated-text")).toHaveTextContent("Verified Inventory");
  });

  it("switches to Hindi when clicking the Hindi toggle button", () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    );

    const hiButtons = screen.getAllByRole("tab", { name: /हिंदी/i });
    fireEvent.click(hiButtons[0]);

    expect(screen.getByTestId("current-lang")).toHaveTextContent("hi");
    expect(screen.getByTestId("translated-text")).toHaveTextContent("सत्यापित इन्वेंटरी");
    expect(localStorage.getItem("autodeal_language")).toBe("hi");
  });

  it("switches back to English when clicking the English toggle button", () => {
    localStorage.setItem("autodeal_language", "hi");

    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    );

    expect(screen.getByTestId("current-lang")).toHaveTextContent("hi");
    expect(screen.getByTestId("translated-text")).toHaveTextContent("सत्यापित इन्वेंटरी");

    const enButtons = screen.getAllByRole("tab", { name: /en/i });
    fireEvent.click(enButtons[0]);

    expect(screen.getByTestId("current-lang")).toHaveTextContent("en");
    expect(screen.getByTestId("translated-text")).toHaveTextContent("Verified Inventory");
    expect(localStorage.getItem("autodeal_language")).toBe("en");
  });
});
