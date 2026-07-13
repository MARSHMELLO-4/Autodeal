import { Bike, Phone, MessageCircle, Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-[var(--paper)]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--maroon)] text-[var(--maroon)]">
            <Bike size={20} strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="font-display text-xl italic text-[var(--ink)]">
              Shree Ganesh <span className="text-[var(--maroon)]">Autodeal</span>
            </h1>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--ink)]/45">
              Trusted Pre-Owned Two Wheelers
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          <a href="#inventory" className="text-sm font-medium text-[var(--ink)]/70 transition hover:text-[var(--maroon)]">Inventory</a>
          <a href="#why-us" className="text-sm font-medium text-[var(--ink)]/70 transition hover:text-[var(--maroon)]">Why Us</a>
          <a href="#contact" className="text-sm font-medium text-[var(--ink)]/70 transition hover:text-[var(--maroon)]">Contact</a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://wa.me/919999999999"
            className="flex items-center gap-2 rounded-full border border-[var(--ink)]/15 px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--moss)] hover:text-[var(--moss)]"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
          <a
            href="tel:+919999999999"
            className="flex items-center gap-2 rounded-full bg-[var(--maroon)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--maroon-dark)]"
          >
            <Phone size={16} />
            Call Now
          </a>
        </div>

        <button className="rounded-lg p-2 transition hover:bg-[var(--ink)]/5 lg:hidden">
          <Menu className="text-[var(--ink)]" size={22} />
        </button>
      </div>
      <div className="road-line" />
    </header>
  );
};

export default Header;