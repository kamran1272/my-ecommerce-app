import React from 'react';
import { Link } from 'react-router-dom';

const links = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/returns', label: 'Returns & Warranty' },
  { to: '/shipping', label: 'Shipping Info' },
  { to: '/faq', label: 'Laptop FAQ' },
  { to: '/contact', label: 'Support Center' },
  { to: '/about', label: 'About Us' },
  { to: '/products', label: 'All Products' },
];

const socials = [
  { href: 'https://facebook.com', icon: 'bi-facebook', label: 'Facebook' },
  { href: 'https://twitter.com', icon: 'bi-twitter', label: 'Twitter/X' },
  { href: 'https://instagram.com', icon: 'bi-instagram', label: 'Instagram' },
  { href: 'https://youtube.com', icon: 'bi-youtube', label: 'YouTube' },
  { href: 'https://linkedin.com', icon: 'bi-linkedin', label: 'LinkedIn' },
];

const shareLinks = [
  {
    href: 'https://www.facebook.com/sharer/sharer.php?u=https://www.kamranlaptops.com',
    icon: 'bi-share',
    label: 'Share on Facebook',
  },
  {
    href: 'https://twitter.com/intent/tweet?url=https://www.kamranlaptops.com&text=Found%20great%20laptops%20at%20Kamran%20Laptop%20Hub',
    icon: 'bi-twitter',
    label: 'Tweet about us',
  },
  {
    href: 'https://www.linkedin.com/shareArticle?mini=true&url=https://www.kamranlaptops.com&title=Kamran%20Laptop%20Hub',
    icon: 'bi-linkedin',
    label: 'Share on LinkedIn',
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-16 w-full border-t border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 pb-8 pt-12 text-white shadow-[0_-12px_36px_rgba(2,6,23,0.32)]"
      role="contentinfo"
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xl font-black">
              <img
                src={`${process.env.PUBLIC_URL}/logo.png`}
                alt="Kamran Laptop Hub logo"
                className="h-14 w-14 flex-shrink-0 scale-[1.38] object-contain drop-shadow-[0_8px_18px_rgba(15,23,42,0.45)]"
              />
              <span className="bg-gradient-to-r from-slate-100 via-blue-100 to-blue-300 bg-clip-text text-transparent">
                Kamran Laptop Hub
              </span>
            </div>

            <p className="text-sm leading-relaxed text-slate-300">
              Premium laptops from Apple, Dell, Lenovo, ASUS, HP, and MSI with expert guidance,
              reliable support, and admin-managed inventory.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-100">
                SSL Secure
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-100">
                30-Day Returns
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-100">
                Free Shipping $499+
              </span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-slate-100 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
                >
                  <i className={`bi ${social.icon}`} aria-hidden="true"></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-300">Explore</h3>
            <div className="grid grid-cols-1 gap-y-2 text-sm">
              {links.map((link) => (
                <Link key={link.to} to={link.to} className="text-slate-300 transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-300">Support</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <span className="text-blue-300">Sales:</span>{' '}
                <strong className="text-white">+1 (800) 555-LAPTOP</strong>
              </li>
              <li>
                <span className="text-blue-300">Support:</span>{' '}
                <strong className="text-white">+1 (800) 555-TECH</strong>
              </li>
              <li>
                <span className="text-blue-300">Email:</span>{' '}
                <strong className="text-white">support@kamranlaptops.com</strong>
              </li>
              <li>
                <span className="text-blue-300">Live Chat:</span> Mon-Fri 8am-10pm EST
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-300">Share</h3>
            <div className="flex flex-col gap-3">
              {shareLinks.map((shareLink) => (
                <a
                  key={shareLink.label}
                  href={shareLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={shareLink.label}
                  className="inline-flex w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-white/25 hover:bg-white/10 hover:text-white sm:w-fit"
                >
                  <i className={`bi ${shareLink.icon}`} aria-hidden="true"></i>
                  {shareLink.label}
                </a>
              ))}
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Join thousands of customers shopping premium laptops and accessories.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {year} <span className="font-semibold text-white">Kamran Laptop Hub</span>. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-4 text-xs">
            <Link to="/faq" className="hover:text-white">
              FAQ
            </Link>
            <Link to="/shipping" className="hover:text-white">
              Shipping
            </Link>
            <Link to="/privacy" className="hover:text-white">
              Privacy
            </Link>
          </div>

          <p className="text-xs">
            Prices and specifications may change without notice. All trademarks belong to their owners.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
