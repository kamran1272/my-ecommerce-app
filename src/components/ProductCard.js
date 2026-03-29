import React from 'react';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { useWishlist } from '../hooks/useWishlist';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);

const badgeStyles = {
  New: 'bg-blue-600 text-white',
  'Best Seller': 'bg-amber-400 text-slate-950',
  'Creator Pick': 'bg-violet-600 text-white',
  'Student Favorite': 'bg-emerald-600 text-white',
  'Pro Power': 'bg-slate-900 text-white',
};

const ProductCard = ({ product, onAddToCart }) => {
  const {
    id,
    name,
    brand,
    category,
    price,
    oldPrice,
    rating = 4,
    description,
    image,
    stock,
    badge,
  } = product;

  const { addItem, isInCart } = useCart();
  const { showToast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(id);
  const alreadyInCart = isInCart(id);
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;

  const handleAddToCart = () => {
    if (stock === 0) {
      showToast('This product is out of stock.', 'error');
      return;
    }

    addItem(product);
    showToast(`${name} added to cart.`, 'success');
    onAddToCart?.(product);
  };

  const handleWishlist = async () => {
    if (inWishlist) {
      await removeFromWishlist(id);
      showToast(`${name} removed from wishlist.`, 'info');
      return;
    }

    await addToWishlist(product);
    showToast(`${name} added to wishlist.`, 'success');
  };

  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-[1.25rem] bg-slate-50">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <span className="text-4xl font-bold text-blue-600">{name?.[0]}</span>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {badge && (
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeStyles[badge] || 'bg-slate-900 text-white'}`}>
              {badge}
            </span>
          )}
          {discount && (
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-semibold text-white">
              -{discount}%
            </span>
          )}
        </div>

        {stock === 0 ? (
          <span className="absolute right-3 top-3 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-700">
            Out of Stock
          </span>
        ) : alreadyInCart ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            In Cart
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span>{brand}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300"></span>
          <span>{category}</span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-bold text-slate-900">{name}</h3>

          <div className="text-right">
            <div className="text-base font-black text-blue-600">{formatCurrency(price)}</div>
            {oldPrice && <div className="text-xs text-slate-400 line-through">{formatCurrency(oldPrice)}</div>}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="text-amber-500">
            {[...Array(5)].map((_, index) => (
              <i
                key={`star-${id}-${index}`}
                className={`bi ${index < Math.round(rating) ? 'bi-star-fill' : 'bi-star'} mr-0.5`}
                aria-hidden="true"
              ></i>
            ))}
          </div>
          <span>{rating.toFixed ? rating.toFixed(1) : rating}</span>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-slate-500">{description}</p>

        <span className={`text-xs font-semibold ${stock === 0 ? 'text-red-500' : 'text-emerald-600'}`}>
          {stock === 0 ? 'Currently unavailable' : `${stock} units available`}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition ${
            stock === 0 ? 'cursor-not-allowed bg-slate-300' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {stock === 0 ? 'Out of Stock' : alreadyInCart ? 'Add More' : 'Add to Cart'}
        </button>

        <button
          onClick={handleWishlist}
          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
            inWishlist
              ? 'border-pink-300 bg-pink-100 text-pink-600'
              : 'border-slate-300 bg-white text-slate-500 hover:bg-slate-100'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <i className={`bi ${inWishlist ? 'bi-heart-fill' : 'bi-heart'}`} aria-hidden="true"></i>
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
