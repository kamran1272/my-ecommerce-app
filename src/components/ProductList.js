import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import { ListSkeleton } from './Skeleton';
import { useToast } from '../hooks/useToast';
import { useCart } from '../hooks/useCart';
import { getProducts } from '../services/productService';
import { APP_EVENTS, subscribeToWindowEvent } from '../services/storageService';

const DEFAULT_PRICE_RANGE = [0, 5000];

const ProductList = () => {
  const location = useLocation();
  const { showToast } = useToast();
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(DEFAULT_PRICE_RANGE);
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('q') || '');
  }, [location.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(getProducts());
      setLoading(false);
    }, 400);

    const syncProducts = () => setProducts(getProducts());
    const offProducts = subscribeToWindowEvent(APP_EVENTS.productsChanged, syncProducts);
    const offStorage = subscribeToWindowEvent('storage', syncProducts);

    return () => {
      clearTimeout(timer);
      offProducts();
      offStorage();
    };
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(products.map((product) => product.category).filter(Boolean))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    });

    if (sortBy === 'featured') {
      return [...result].sort((left, right) => {
        const leftFeatured = left.isFeatured ? 0 : 1;
        const rightFeatured = right.isFeatured ? 0 : 1;
        if (leftFeatured !== rightFeatured) return leftFeatured - rightFeatured;

        const leftRank = left.featuredRank ?? Number.MAX_SAFE_INTEGER;
        const rightRank = right.featuredRank ?? Number.MAX_SAFE_INTEGER;
        if (leftRank !== rightRank) return leftRank - rightRank;

        return (right.rating || 0) - (left.rating || 0);
      });
    }

    if (sortBy === 'low') return [...result].sort((left, right) => left.price - right.price);
    if (sortBy === 'high') return [...result].sort((left, right) => right.price - left.price);
    if (sortBy === 'rating') return [...result].sort((left, right) => (right.rating || 0) - (left.rating || 0));
    return result;
  }, [priceRange, products, searchTerm, selectedCategory, sortBy]);

  const handleAddToCart = (product) => {
    if (product.stock === 0) {
      showToast('Product out of stock.', 'error');
      return;
    }

    addItem(product);
    showToast(`${product.name} added to cart.`, 'success');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceRange(DEFAULT_PRICE_RANGE);
    setSortBy('featured');
  };

  return (
    <section className="container mx-auto px-4 py-8 md:py-10">
      <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
              Browse catalog
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Premium laptops and accessories</h1>
            <p className="mt-2 text-sm text-slate-500">
              Filter the inventory by category, price, and customer rating.
            </p>
          </div>

          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
            {loading ? 'Loading catalog...' : `${filteredProducts.length} items available`}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <input
            type="text"
            placeholder="Search by product name"
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>

          <select
            value={`${priceRange[0]}-${priceRange[1]}`}
            onChange={(event) => {
              const [min, max] = event.target.value.split('-').map(Number);
              setPriceRange([min, max]);
            }}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="0-5000">All prices</option>
            <option value="0-1000">Under $1,000</option>
            <option value="1000-2000">$1,000 - $2,000</option>
            <option value="2000-5000">$2,000+</option>
          </select>

          <select
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="rating">Top rated</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>

          <button
            onClick={resetFilters}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Reset filters
          </button>
        </div>
      </div>

      {loading ? (
        <ListSkeleton />
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
          <i className="bi bi-search mb-4 block text-5xl text-slate-300"></i>
          <p className="text-lg font-semibold text-slate-700">No products match these filters</p>
          <p className="mt-2 text-sm text-slate-500">Try a broader search or reset the current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;
