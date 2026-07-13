import { Bike, Phone, MessageCircle, Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-800/10 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-lg">
            <Bike size={24} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-wide text-emerald-900">
              Shree Ganesh Autodeal
            </h1>

            <p className="text-sm text-gray-500">
              Trusted Pre-Owned Two Wheelers
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          <a
            href="#inventory"
            className="font-medium text-gray-600 transition hover:text-emerald-700"
          >
            Inventory
          </a>

          <a
            href="#why-us"
            className="font-medium text-gray-600 transition hover:text-emerald-700"
          >
            Why Us
          </a>

          <a
            href="#contact"
            className="font-medium text-gray-600 transition hover:text-emerald-700"
          >
            Contact
          </a>
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://wa.me/919999999999"
            className="flex items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>

          <a
            href="tel:+919999999999"
            className="flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition duration-300 hover:bg-emerald-800 hover:shadow-xl"
          >
            <Phone size={18} />
            Call Now
          </a>
        </div>

        {/* Mobile Menu */}
        <button className="rounded-lg p-2 transition hover:bg-emerald-50 lg:hidden">
          <Menu className="text-emerald-800" size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;