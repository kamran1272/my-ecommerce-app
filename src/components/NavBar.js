import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/products', label: 'Products', icon: 'bi-laptop' },
  { to: '/cart', label: 'Cart', icon: 'bi-cart' },
  { to: '/wishlist', label: 'Wishlist', icon: 'bi-heart' },
  { to: '/about', label: 'About', icon: 'bi-info-circle' },
  { to: '/faq', label: 'FAQ', icon: 'bi-question-circle' },
  { to: '/contact', label: 'Contact', icon: 'bi-envelope' },
];

const NavItems = ({ cartCount, closeMenu, location, variant = 'light' }) => (
  <>
    {navLinks.map((link) => {
      const isActive = location.pathname === link.to;
      const desktopTone =
        variant === 'dark'
          ? isActive
            ? 'font-semibold text-white'
            : 'text-slate-200 hover:text-white'
          : isActive
            ? 'font-semibold text-blue-600'
            : 'text-slate-900 hover:text-blue-600';

      return (
        <li key={link.to}>
          <Link
            to={link.to}
            onClick={closeMenu}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 md:px-0 md:py-0 lg:text-[15px] ${desktopTone} hover:bg-blue-50 md:hover:bg-transparent`}
          >
            <i className={`bi ${link.icon} text-lg`} aria-hidden="true"></i>
            {link.label}
            {link.to === '/cart' && cartCount > 0 && (
              <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </li>
      );
    })}
  </>
);

const NavBar = ({ cartCount = 0, mode = 'default', variant = 'light' }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (mode === 'desktop') {
    return (
      <nav className="hidden md:block" aria-label="Main Navigation">
        <ul className="flex items-center gap-3 whitespace-nowrap lg:gap-5">
          <NavItems cartCount={cartCount} closeMenu={undefined} location={location} variant={variant} />
        </ul>
      </nav>
    );
  }

  return (
    <nav ref={menuRef} className="relative md:hidden" aria-label="Main Navigation">
      <button
        type="button"
        className={`flex h-10 w-10 items-center justify-center rounded-md border transition ${
          variant === 'dark'
            ? 'border-white/15 bg-white/5 text-white hover:border-white/30'
            : 'border-slate-300 hover:border-blue-400'
        }`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Toggle navigation"
      >
        <i className="bi bi-list text-xl" aria-hidden="true"></i>
      </button>

      <ul
        className={`absolute right-0 top-12 z-50 w-[min(88vw,260px)] min-w-[220px] rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg transition-all duration-200 ${
          open ? 'visible scale-100 opacity-100' : 'invisible pointer-events-none scale-95 opacity-0'
        }`}
      >
        <NavItems cartCount={cartCount} closeMenu={() => setOpen(false)} location={location} />
      </ul>
    </nav>
  );
};

export default NavBar;
