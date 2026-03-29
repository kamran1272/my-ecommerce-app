import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import NavBar from './NavBar';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

const Header = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const handleProfile = () => {
    setProfileOpen(false);
    navigate('/profile');
  };

  const displayName = user?.name?.trim() || 'Profile';
  const avatarInitial = displayName[0]?.toUpperCase?.() || 'U';
  const profileImage = user?.profileImage;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 shadow-[0_12px_36px_rgba(2,6,23,0.38)]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="py-3 md:py-4">
          <div className="flex items-center gap-3 md:flex-nowrap md:gap-4">
            <Link
              to="/"
              className="group flex flex-shrink-0 items-center"
              aria-label="Go to homepage"
            >
              <img
                src={`${process.env.PUBLIC_URL}/logo.png`}
                alt="Kamran Laptop Hub logo"
                className="h-14 w-14 flex-shrink-0 scale-[1.58] object-contain drop-shadow-[0_8px_18px_rgba(15,23,42,0.45)] transition group-hover:scale-[1.66] sm:h-16 sm:w-16 lg:h-[4.5rem] lg:w-[4.5rem]"
              />
            </Link>

            <div className="hidden lg:block">
              <SearchBar compact />
            </div>

            <div className="hidden min-w-0 flex-1 justify-center md:flex">
              <NavBar mode="desktop" variant="dark" cartCount={cartCount} />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <NavBar mode="mobile" variant="dark" cartCount={cartCount} />

              <div className="flex-shrink-0" ref={menuRef}>
                {user ? (
                  <div className="relative">
                    <button
                      type="button"
                      className="flex items-center justify-center rounded-full border border-white/15 bg-white/10 p-2 text-white shadow-sm backdrop-blur transition hover:bg-white/15 hover:shadow-md"
                      aria-haspopup="true"
                      aria-expanded={profileOpen}
                      onClick={() => setProfileOpen((prev) => !prev)}
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt={displayName}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                          {avatarInitial}
                        </span>
                      )}
                    </button>
                    <div
                      className={`absolute right-0 mt-2 w-48 rounded-xl border border-slate-100 bg-white shadow-lg transition duration-200 ${
                        profileOpen ? 'visible opacity-100' : 'invisible opacity-0'
                      }`}
                    >
                      <button
                        className="w-full rounded-t-xl px-4 py-3 text-left text-sm hover:bg-blue-50"
                        onClick={handleProfile}
                      >
                        My Profile
                      </button>
                      <button
                        className="w-full rounded-b-xl px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/"
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-slate-100 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 md:hidden">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
