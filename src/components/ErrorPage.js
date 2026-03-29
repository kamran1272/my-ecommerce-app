import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = ({ error, statusCode = 500 }) => {
  // Friendly messages based on status code (if available)
  const getMessage = () => {
    if (statusCode === 404) return "The page you're looking for doesn't exist.";
    if (statusCode === 403) return "You don't have permission to access this page.";
    if (statusCode === 401) return "Please log in to continue.";
    if (statusCode >= 500) return "Our servers are experiencing issues. Please try again later.";
    return "An unexpected error occurred.";
  };

  const handleReportIssue = () => {
    // Simulate opening support chat or email
    window.location.href = 'mailto:support@kamranlaptops.com?subject=Error%20Report&body=' + encodeURIComponent(error?.toString() || '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
        {/* Laptop-themed icon */}
        <div className="text-7xl mb-4">💻⚠️</div>
        
        {/* Status code (if provided) */}
        {statusCode && (
          <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold mb-4">
            Error {statusCode}
          </span>
        )}
        
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
          Oops! Something went wrong.
        </h1>
        
        <p className="text-slate-600 mb-4">{getMessage()}</p>
        
        {/* Detailed error (only in development, safe fallback) */}
        {error && process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left bg-slate-50 p-3 rounded-xl text-xs text-slate-500 border border-slate-200">
            <summary className="cursor-pointer font-medium">Technical details</summary>
            <pre className="mt-2 whitespace-pre-wrap break-words">{error.toString()}</pre>
          </details>
        )}
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            to="/"
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2.5 rounded-xl font-semibold shadow hover:shadow-md transition"
          >
            Go to Homepage
          </Link>
          <Link
            to="/products"
            className="flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition"
          >
            Browse Laptops
          </Link>
        </div>
        
        <button
          onClick={handleReportIssue}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 transition"
        >
          📧 Report this issue
        </button>
        
        {/* Trust badge */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
          Our laptop experts are available 24/7 if you need immediate help.
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;