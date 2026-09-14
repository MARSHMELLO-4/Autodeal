import { useState } from "react";
import {
  Phone,
  MessageCircle,
  Menu,
  X,
  ShieldCheck,
  Bell,
  MapPin,
} from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "../i18n/useLanguage";

interface HeaderProps {
  onOpenSubscribe?: () => void;
}

const Header = ({ onOpenSubscribe }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { label: t("inventory"), href: "#inventory" },
    { label: t("categories"), href: "#categories" },
    { label: t("whyUs"), href: "#why-us" },
    { label: t("contact"), href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-hairedge/80 bg-paper-soft/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3">
        {/* Brand Logo & Name */}
        <a
          href="#"
          className="flex items-center gap-2.5 sm:gap-3 transition-transform active:scale-95"
        >
          <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 shadow-sm ring-1 ring-black/5">
            <img
              src="/sga_logo.jpg"
              alt="Shree Ganesh Autodeal Logo"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div>
            <div className="flex items-center gap-1">
              <span className="font-display text-sm sm:text-lg font-extrabold tracking-tight text-ink">
                Shree Ganesh
                <span className="ml-1 text-maroon-700">Autodeal</span>
              </span>
            </div>

            <div className="flex items-center gap-1 text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
              <ShieldCheck size={11} className="text-emerald-600 shrink-0" />
              <span>{t("verifiedTagline")}</span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-moss transition-colors hover:text-maroon-700"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop & Tablet Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <LanguageToggle className="hidden sm:inline-flex" />

          {/* Subscribe / Alerts */}
          {onOpenSubscribe && (
            <button
              type="button"
              onClick={onOpenSubscribe}
              className="flex items-center gap-1.5 rounded-full border border-maroon-100 bg-maroon-50/80 px-2.5 py-2 sm:px-4 text-xs font-bold text-maroon-700 transition-all hover:bg-maroon-100 active:scale-95 cursor-pointer"
            >
              <Bell size={15} className="text-maroon-600" />
              <span className="hidden sm:inline">{t("getAlerts")}</span>
            </button>
          )}

          {/* Desktop WhatsApp & Call */}
          <div className="hidden sm:flex items-center gap-2">
            <a
              href="https://wa.me/918982883521"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-hairedge bg-white px-3.5 py-2 text-xs font-semibold text-ink shadow-xs transition-all hover:border-emerald-400 hover:text-emerald-700"
            >
              <MessageCircle size={15} className="text-emerald-600" />
              <span>{t("whatsApp")}</span>
            </a>

            <a
              href="tel:+918982883521"
              className="flex items-center gap-1.5 rounded-full bg-maroon-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-maroon-800 active:scale-95"
            >
              <Phone size={14} />
              <span>{t("callDealer")}</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-hairedge bg-white text-ink transition-colors hover:bg-paper active:scale-95 lg:hidden cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-hairedge/80 bg-paper-soft px-4 py-4 shadow-xl lg:hidden animate-[fadeIn_.2s_ease]">
          <nav className="flex flex-col gap-1 pb-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-ink hover:bg-maroon-50 active:bg-maroon-100"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Language + sub-actions */}
          <div className="border-t border-hairedge/80 pt-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-moss">
                {t("categories")}
              </span>
              <LanguageToggle />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="tel:+918982883521"
                className="flex items-center justify-center gap-2 rounded-xl bg-maroon-700 py-3 text-xs font-bold text-white shadow-sm active:scale-95"
              >
                <Phone size={15} />
                {t("callDealer")}
              </a>

              <a
                href="https://wa.me/918982883521"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-emerald-50 px-3 py-3 text-xs font-bold text-emerald-700 active:scale-95"
              >
                <MessageCircle size={15} className="text-emerald-600" />
                {t("whatsApp")}
              </a>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-moss">
            <MapPin size={12} className="text-maroon-600" />
            <span>{t("showroomLocationInfo")}</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;