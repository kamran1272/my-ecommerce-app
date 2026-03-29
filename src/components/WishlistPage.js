import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useToast } from '../hooks/useToast';
import { useWishlist } from '../hooks/useWishlist';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();

  const handleRemove = async (product) => {
    await removeFromWishlist(product.id);
    showToast('Removed from wishlist.', 'info');
  };

  return (
    <section className="container mx-auto px-4 py-8 md:px-8 md:py-12">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Saved products</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">My wishlist</h1>
          <p className="mt-2 text-sm text-slate-500">Keep track of products you want to compare or buy later.</p>
        </div>

        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
          {wishlist.length} saved item{wishlist.length === 1 ? '' : 's'}
        </div>
      </div>

      {wishlist.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((product) => (
            <div key={product.id} className="group relative">
              <ProductCard product={product} />

              <button
                onClick={() => handleRemove(product)}
                className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1.5 text-sm shadow backdrop-blur transition hover:bg-red-500 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
                aria-label={`Remove ${product.name} from wishlist`}
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const EmptyState = () => (
  <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
    <i className="bi bi-heart mb-4 block text-5xl text-slate-300"></i>
    <h2 className="mb-2 text-2xl font-semibold text-slate-700">Your wishlist is empty</h2>
    <p className="mb-6 text-slate-500">Save products you love and come back to them anytime.</p>

    <Link
      to="/products"
      className="inline-block rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
    >
      Browse products
    </Link>
  </div>
);

export default WishlistPage;
