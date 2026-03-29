import React from 'react';

const Skeleton = ({ className = '', ...props }) => (
  <div
    className={`relative overflow-hidden bg-gray-200 rounded ${className}`}
    {...props}
  >
    {/* Shimmer Effect */}
    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
  </div>
);

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg border p-4 flex flex-col gap-3">

    {/* Image */}
    <Skeleton className="w-full h-40 rounded-lg" />

    {/* Title */}
    <Skeleton className="h-5 w-3/4" />

    {/* Price */}
    <Skeleton className="h-4 w-1/2" />

    {/* Button */}
    <Skeleton className="h-10 w-full rounded-lg" />

  </div>
);

export const ListSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

/* 🔥 Extra Skeleton Types */
export const TextSkeleton = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className="h-4 w-full" />
    ))}
  </div>
);

export const AvatarSkeleton = () => (
  <Skeleton className="w-10 h-10 rounded-full" />
);

export default Skeleton;