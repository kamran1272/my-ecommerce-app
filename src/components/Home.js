import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import BannerCarousel from './BannerCarousel';
import Promotions from './Promotions';
import FeaturedProducts from './FeaturedProducts';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const Home = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, login, register, logout, loginAsGuest, isAdmin } = useAuth();
  const [authType, setAuthType] = useState('login');

  const handleAuth = async ({ email, password }) => {
    try {
      const nextUser =
        authType === 'register'
          ? await register({ email, password, name: email.split('@')[0] })
          : await login({ email, password });

      showToast(
        authType === 'register'
          ? 'Account created successfully.'
          : `Welcome back, ${nextUser.name || nextUser.email}.`,
        'success'
      );

      if (nextUser.role === 'admin') {
        navigate('/admin');
      }
    } catch (error) {
      showToast(error.message || 'Unable to continue. Please try again.', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    setAuthType('login');
    showToast('Logged out successfully.', 'info');
    navigate('/');
  };

  const handleGuestContinue = () => {
    loginAsGuest();
    showToast('Continuing as guest.', 'info');
  };

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <h1 className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-center text-4xl font-black text-transparent md:text-5xl">
          Kamran Laptop Hub
        </h1>

        <div className="mb-6 flex w-full max-w-sm">
          <button
            className={`flex-1 rounded-l-lg border px-5 py-2 font-semibold ${
              authType === 'login' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
            }`}
            onClick={() => setAuthType('login')}
          >
            Login
          </button>

          <button
            className={`flex-1 rounded-r-lg border px-5 py-2 font-semibold ${
              authType === 'register' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
            }`}
            onClick={() => setAuthType('register')}
          >
            Register
          </button>
        </div>

        <AuthForm onAuth={handleAuth} type={authType} />

        <button
          onClick={handleGuestContinue}
          className="mt-6 text-sm text-slate-500 transition hover:text-blue-600"
        >
          Continue as Guest
        </button>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8 md:px-8 md:py-10">
      <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-slate-800 md:text-4xl">Welcome back</h1>
          <p className="break-all text-sm text-slate-500 sm:break-normal">{user.email}</p>
          {isAdmin && (
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
              Admin access enabled
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate('/profile')}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            My Profile
          </button>

          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800"
            >
              Admin Panel
            </button>
          )}

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <BannerCarousel />
      <Promotions />
      <FeaturedProducts />
    </section>
  );
};

export default Home;
