import { Bike, Phone, MessageCircle, Menu, ShieldCheck } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/75 px-5 py-3 shadow-xl backdrop-blur-xl">

          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--maroon)] to-[var(--maroon-dark)] text-white shadow-lg">
              <Bike size={26} strokeWidth={2.2} />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight text-[var(--ink)] sm:text-2xl">
                Shree Ganesh
                <span className="ml-2 text-[var(--maroon)]">
                  Autodeal
                </span>
              </h1>

              <div className="mt-1 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--moss)]">
                <ShieldCheck size={13} className="text-green-600" />
                Verified Pre-Owned Bikes
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-10 lg:flex">
            {[
              "Inventory",
              "Categories",
              "Why Us",
              "Reviews",
              "Contact",
            ].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="relative text-sm font-semibold text-[var(--ink)] transition duration-300 hover:text-[var(--maroon)] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[var(--maroon)] after:transition-all after:duration-300 hover:after:w-full"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right Buttons */}
          <div className="hidden items-center gap-3 md:flex">

            <a
              href="https://wa.me/919999999999"
              className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-green-500 hover:text-green-600 hover:shadow-md"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>

            <a
              href="tel:+919999999999"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--maroon)] to-[var(--maroon-dark)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Phone size={18} />
              Call Dealer
            </a>

          </div>

          {/* Mobile Menu */}
          <button
            className="rounded-xl border border-[var(--border)] bg-white p-3 shadow-sm transition-all duration-300 hover:bg-[var(--paper)] lg:hidden"
          >
            <Menu size={22} className="text-[var(--ink)]" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;