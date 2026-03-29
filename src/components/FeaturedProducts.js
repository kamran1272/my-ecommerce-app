import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getProducts } from '../services/productService';

const FeaturedProducts = () => {
  const products = useMemo(() => getProducts(), []);

  const featured = useMemo(() => {
    const sortByPriority = (left, right) => {
      const leftRank = left.featuredRank ?? Number.MAX_SAFE_INTEGER;
      const rightRank = right.featuredRank ?? Number.MAX_SAFE_INTEGER;

      if (leftRank !== rightRank) return leftRank - rightRank;
      if ((right.rating || 0) !== (left.rating || 0)) return (right.rating || 0) - (left.rating || 0);
      return (right.stock || 0) - (left.stock || 0);
    };

    const inStock = products.filter((product) => product.stock > 0);
    const featuredFirst = inStock.filter((product) => product.isFeatured).sort(sortByPriority);
    const supporting = inStock
      .filter((product) => !product.isFeatured)
      .sort((left, right) => (right.rating || 0) - (left.rating || 0));

    return [...featuredFirst, ...supporting].slice(0, 8);
  }, [products]);

  return (
    <section className="mx-auto my-16 w-full max-w-7xl px-4 md:px-6">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Premium Selection</p>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Featured Laptops
          </h2>
          <p className="mt-1 text-sm text-slate-500">Curated from top brands and admin-managed inventory.</p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-2.5 font-semibold text-slate-800 transition hover:bg-slate-200"
        >
          View all laptops
          <span aria-hidden="true" className="text-lg">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-6 border-t border-slate-200 pt-6 text-xs text-slate-400">
        <span>Free shipping over $499</span>
        <span>30-day returns</span>
        <span>2-year warranty included</span>
        <span>24/7 laptop experts</span>
      </div>
    </section>
  );
};

export default FeaturedProducts;
