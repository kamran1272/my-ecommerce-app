import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';

const SearchBar = ({ products = [], compact = false }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const catalog = useMemo(
    () => (products.length ? products : getProducts()),
    [products]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return [];

    return catalog
      .filter((product) => product.name.toLowerCase().includes(debouncedQuery.toLowerCase()))
      .slice(0, 6);
  }, [catalog, debouncedQuery]);

  useEffect(() => {
    setHighlightedIndex(filtered.length ? 0 : -1);
  }, [filtered]);

  const handleSelect = (product) => {
    setSearchQuery('');
    setShowSuggestions(false);
    navigate(`/products/${product.id}`);
  };

  const handleSearch = () => {
    if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
      handleSelect(filtered[highlightedIndex]);
      return;
    }

    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }

    setShowSuggestions(false);
  };

  const wrapperClassName = compact
    ? 'group relative z-20 ml-auto w-11 overflow-visible transition-all duration-300 hover:w-72 focus-within:w-72'
    : 'relative w-full';

  const inputClassName = compact
    ? 'h-11 w-full rounded-full border border-slate-200 bg-white pl-11 pr-20 text-sm text-slate-900 shadow-lg transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
    : 'h-11 w-full rounded-full border border-slate-300 bg-white px-4 pr-20 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200';

  return (
    <div className={wrapperClassName}>
      <div className={compact ? 'relative overflow-hidden rounded-full' : 'relative'}>
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            window.setTimeout(() => setShowSuggestions(false), 120);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setHighlightedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
            } else if (event.key === 'ArrowUp') {
              event.preventDefault();
              setHighlightedIndex((prev) => Math.max(prev - 1, 0));
            } else if (event.key === 'Enter') {
              event.preventDefault();
              handleSearch();
            } else if (event.key === 'Escape') {
              setShowSuggestions(false);
            }
          }}
          placeholder="Search products"
          className={inputClassName}
          aria-label="Search products"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setShowSuggestions(false);
            }}
            className={`absolute right-14 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 ${
              compact ? 'hidden group-hover:block group-focus-within:block' : ''
            }`}
            aria-label="Clear search"
          >
            x
          </button>
        )}

        <button
          type="button"
          onClick={handleSearch}
          className={`absolute top-1/2 h-10 -translate-y-1/2 rounded-full bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99] ${
            compact ? 'left-0.5 w-10 px-0' : 'right-2 px-4'
          }`}
          aria-label="Submit search"
        >
          <i className="bi bi-search text-lg" aria-hidden="true"></i>
        </button>
      </div>

      {showSuggestions && searchQuery.trim() && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-xl">
          {filtered.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">No results found</p>
          ) : (
            filtered.map((product, index) => (
              <button
                key={product.id}
                type="button"
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => handleSelect(product)}
                className={`flex w-full items-center gap-3 p-3 text-left transition ${
                  highlightedIndex === index ? 'bg-blue-50' : 'bg-white'
                }`}
              >
                <img
                  src={product.image || `${process.env.PUBLIC_URL}/logo.png`}
                  alt={product.name}
                  className="h-10 w-10 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-500">${product.price}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
