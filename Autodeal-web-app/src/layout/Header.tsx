import { useEffect, useState } from "react";
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
  const [scrollPct, setScrollPct] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setScrollPct(total > 0 ? (doc.scrollTop / total) * 100 : 0);
      setScrolled(doc.scrollTop > 10);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: t("inventory"), href: "#inventory" },
    { label: t("categories"), href: "#categories" },
    { label: t("whyUs"), href: "#why-us" },
    { label: t("contact"), href: "#contact" },
  ];

  return (
    <header
      className={`anim-slide-down sticky top-0 z-50 w-full border-b border-hairedge/80 bg-paper-soft/90 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-[0_8px_32px_-16px_rgba(28,25,23,0.28)]" : "shadow-none"
      }`}
    >
      {/* Scroll progress bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-0.5 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-maroon-700 via-maroon-500 to-amber-400 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollPct}%` }}
        />
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3">
        {/* Brand Logo & Name */}
        <a
          href="#"
          className="group flex items-center gap-2.5 sm:gap-3 transition-transform active:scale-95"
        >
          <div className="shine relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 shadow-sm ring-1 ring-black/5">
            <img
              src="/sga_logo.jpg"
              alt="Shree Ganesh Autodeal Logo"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
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
              className="nav-link text-sm font-semibold text-moss transition-colors hover:text-maroon-700"
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
              className="btn-spring flex items-center gap-1.5 rounded-full border border-maroon-100 bg-maroon-50/80 px-2.5 py-2 sm:px-4 text-xs font-bold text-maroon-700 transition-colors hover:bg-maroon-100 cursor-pointer"
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
              className="btn-spring flex items-center gap-1.5 rounded-full border border-hairedge bg-white px-3.5 py-2 text-xs font-semibold text-ink hover:border-emerald-400 hover:text-emerald-700 cursor-pointer"
            >
              <MessageCircle size={15} className="text-emerald-600" />
              <span>{t("whatsApp")}</span>
            </a>

            <a
              href="tel:+918982883521"
              className="btn-spring flex items-center gap-1.5 rounded-full bg-maroon-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-maroon-800 active:scale-95"
            >
              <Phone size={14} />
              <span>{t("callDealer")}</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-spring flex h-10 w-10 items-center justify-center rounded-xl border border-hairedge bg-white text-ink hover:bg-paper active:scale-95 lg:hidden cursor-pointer"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="anim-slide-down border-t border-hairedge/80 bg-paper-soft px-4 py-4 shadow-xl lg:hidden">
          <nav className="flex flex-col gap-1 pb-4">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="anim-left flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-ink transition-colors hover:bg-maroon-50 active:bg-maroon-100"
                style={{ "--d": `${index * 60}ms` } as React.CSSProperties}
              >
                {item.label}
                <span className="h-1.5 w-1.5 rounded-full bg-maroon-300" />
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
                className="btn-spring flex items-center justify-center gap-2 rounded-xl bg-maroon-700 py-3 text-xs font-bold text-white shadow-sm active:scale-95"
              >
                <Phone size={15} />
                {t("callDealer")}
              </a>

              <a
                href="https://wa.me/918982883521"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-spring flex items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-emerald-50 px-3 py-3 text-xs font-bold text-emerald-700 active:scale-95"
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