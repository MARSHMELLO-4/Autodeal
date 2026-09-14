import { useEffect, useState, type ReactNode } from "react";
import { translations, type Language, type Translations } from "./translations";
import { LanguageContext } from "./language-context";

const STORAGE_KEY = "autodeal_language";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "hi") {
        return saved;
      }
    } catch {
      // localStorage may fail in private browsing or testing
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  const t = (key: keyof Translations): string => {
    return translations[language]?.[key] || translations.en[key] || "";
  };

  useEffect(() => {
    // Update document html lang attribute
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
