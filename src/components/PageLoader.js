import React from 'react';

const PageLoader = () => (
  <div className="flex min-h-[40vh] items-center justify-center px-4 py-16">
    <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-sm">
      <span className="h-3 w-3 animate-pulse rounded-full bg-blue-600"></span>
      <span className="text-sm font-medium text-slate-600">Loading page...</span>
    </div>
  </div>
);

export default PageLoader;
