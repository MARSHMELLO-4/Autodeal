import { useContext } from "react";
import { LanguageContext } from "./language-context";
import { translations, type Translations } from "./translations";

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    // Safe fallback if used outside provider (e.g. in tests without provider)
    return {
      language: "en" as const,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key: keyof Translations) => translations.en[key] || "",
    };
  }

  return context;
}