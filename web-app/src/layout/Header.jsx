import { Bike } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <span className="brand-mark">
          <Bike size={22} />
        </span>
        <div>
          <strong>Shree Ganesh Autodeal</strong>
          <span>Two-wheeler resale catalog</span>
        </div>
      </div>
      <a className="call-link" href="tel:+910000000000">
        Call shop
      </a>
    </header>
  );
};

export default Header;
