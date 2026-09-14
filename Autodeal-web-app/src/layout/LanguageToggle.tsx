import { Globe } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";

interface LanguageToggleProps {
  className?: string;
  variant?: "pill" | "dropdown";
}

const LanguageToggle = ({ className = "", variant = "pill" }: LanguageToggleProps) => {
  const { language, setLanguage } = useLanguage();

  if (variant === "dropdown") {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <Globe size={15} className="text-slate-500" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700 outline-none cursor-pointer"
        >
          <option value="en">English (EN)</option>
          <option value="hi">हिंदी (HI)</option>
        </select>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-full border border-slate-200 bg-slate-100/90 p-0.5 shadow-2xs ${className}`}
      role="tablist"
      aria-label="Language selection"
    >
      <button
        type="button"
        role="tab"
        aria-selected={language === "en"}
        onClick={() => setLanguage("en")}
        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
          language === "en"
            ? "bg-white text-[var(--maroon)] shadow-xs"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <span>EN</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={language === "hi"}
        onClick={() => setLanguage("hi")}
        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
          language === "hi"
            ? "bg-[var(--maroon)] text-white shadow-xs"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <span>हिंदी</span>
      </button>
    </div>
  );
};

export default LanguageToggle;
