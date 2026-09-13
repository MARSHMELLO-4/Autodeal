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

interface HeaderProps {
  onOpenSubscribe?: () => void;
}

const Header = ({ onOpenSubscribe }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Inventory", href: "#inventory" },
    { label: "Categories", href: "#categories" },
    { label: "Why Us", href: "#why-us" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3.5 py-3 sm:px-6 sm:py-3.5">
          {/* Brand Logo & Name */}
          <a
            href="#"
            className="flex items-center gap-2.5 sm:gap-3.5 group transition-transform active:scale-95"
          >
            <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 shadow-sm ring-1 ring-black/5">
              <img
                src="/sga_logo.jpg"
                alt="Shree Ganesh Autodeal Logo"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-xl font-extrabold tracking-tight text-[var(--ink)]">
                  Shree Ganesh
                  <span className="ml-1 text-[var(--maroon)]">Autodeal</span>
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-700">
                <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                <span>Verified Pre-Owned Bikes</span>
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-semibold text-slate-700 transition-colors hover:text-[var(--maroon)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop & Tablet Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Subscribe / Alerts Button */}
            {onOpenSubscribe && (
              <button
                type="button"
                onClick={onOpenSubscribe}
                className="flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50/80 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-[var(--maroon)] transition-all hover:bg-red-100/80 hover:shadow-sm active:scale-95 cursor-pointer"
              >
                <Bell size={14} className="text-[var(--maroon)]" />
                <span className="hidden xs:inline">Get Alerts</span>
                <span className="xs:hidden">Alerts</span>
              </button>
            )}

            {/* Desktop WhatsApp & Call */}
            <div className="hidden sm:flex items-center gap-2">
              <a
                href="https://wa.me/918982883521"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-emerald-500 hover:text-emerald-700 hover:shadow"
              >
                <MessageCircle size={15} className="text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              <a
                href="tel:+918982883521"
                className="flex items-center gap-1.5 rounded-full bg-[var(--maroon)] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[var(--maroon-dark)] hover:shadow active:scale-95"
              >
                <Phone size={14} />
                <span>Call Dealer</span>
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-800 transition-colors hover:bg-slate-100 active:scale-95 lg:hidden cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-xl lg:hidden animate-[fadeIn_.2s_ease]">
            <nav className="flex flex-col gap-1 pb-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 active:bg-slate-100"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
              <a
                href="tel:+918982883521"
                className="flex items-center justify-center gap-2 rounded-xl bg-[var(--maroon)] py-2.5 text-xs font-bold text-white shadow-sm"
              >
                <Phone size={15} />
                Call Dealer
              </a>

              <a
                href="https://wa.me/918982883521"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-emerald-50/50 py-2.5 text-xs font-bold text-emerald-700"
              >
                <MessageCircle size={15} className="text-emerald-600" />
                WhatsApp
              </a>
            </div>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <MapPin size={12} className="text-[var(--maroon)]" />
              <span>Indore, Madhya Pradesh • Open All Days</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;