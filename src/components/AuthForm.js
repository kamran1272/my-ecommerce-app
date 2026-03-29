import React, { useState } from 'react';

const AuthForm = ({ onAuth, type = 'login' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Min 6 characters';
    if (type === 'register') {
      if (!confirmPassword) errs.confirmPassword = 'Confirm your password';
      else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    }
    setError(Object.values(errs).join(' • '));
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setError('');
    // Pass rememberMe preference to parent (e.g., set a longer session)
    onAuth({ email, password, rememberMe });
  };

  const handleForgotPassword = () => {
    alert('A password reset link will be sent to your email.\n(Feature coming soon)');
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="max-w-md w-full mx-auto">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg mb-3">
            <span className="text-2xl font-black text-white">K</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kamran Laptop Hub</h1>
          <p className="text-slate-500 text-sm mt-1">Your gateway to premium laptops & expert advice</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100 space-y-5"
        >
          <div className="text-center space-y-1">
            <p className="text-xs uppercase tracking-[0.12em] text-blue-600 font-semibold">
              {type === 'login' ? 'Welcome back' : 'Join the family'}
            </p>
            <h2 className="text-2xl font-bold text-slate-800">
              {type === 'login' ? 'Sign in to your account' : 'Create an account'}
            </h2>
            <p className="text-sm text-slate-500">
              {type === 'login'
                ? 'Access your orders, wishlist, and support tickets'
                : 'Start your journey with the best laptop deals'}
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-sm">Email address</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 pr-16"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Confirm password (register only) */}
          {type === 'register' && (
            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-sm">Confirm password</label>
              <input
                type="password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
          )}

          {/* Extra options (login only) */}
          {type === 'login' && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-300"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all"
          >
            {type === 'login' ? 'Sign in' : 'Create account'}
          </button>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-400">or continue with</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => alert('Google sign‑in coming soon')}
              className="flex items-center justify-center gap-2 border border-slate-300 rounded-xl py-2.5 hover:bg-slate-50 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Apple sign‑in coming soon')}
              className="flex items-center justify-center gap-2 border border-slate-300 rounded-xl py-2.5 hover:bg-slate-50 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              </svg>
              <span className="text-sm font-medium">Apple</span>
            </button>
          </div>

          {/* Toggle between login / register */}
          <p className="text-center text-sm text-slate-500 pt-2">
            {type === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => window.location.reload()} // In real app, you'd switch mode via parent state
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              {type === 'login' ? 'Register now' : 'Sign in'}
            </button>
          </p>
        </form>

        {/* Trust badge */}
        <div className="text-center mt-6 text-xs text-slate-400">
          🔒 Secure checkout • 256‑bit SSL • Trusted by 50,000+ laptop buyers
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
