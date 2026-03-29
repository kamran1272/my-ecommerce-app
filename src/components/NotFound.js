import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      
      {/* Icon */}
      <div className="text-6xl mb-4 text-blue-600">
        <i className="bi bi-laptop"></i>
      </div>

      {/* 404 */}
      <h1 className="text-7xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
        404
      </h1>

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-slate-500 max-w-md mb-8">
        Oops! The page you’re looking for doesn’t exist or may have been moved.
      </p>

      {/* Buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          to="/"
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Go Home
        </Link>

        <Link
          to="/products"
          className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:border-blue-400 hover:text-blue-600 transition"
        >
          Browse Laptops
        </Link>
      </div>

      {/* Optional hint */}
      <p className="text-xs text-slate-400 mt-6">
        Error code: 404 • Kamran Laptop Hub
      </p>
    </div>
  );
};

export default NotFound;