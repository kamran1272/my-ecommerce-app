import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Reviews from './Reviews';
import { useToast } from '../hooks/useToast';
import { useCart } from '../hooks/useCart';
import { getProductById, getProducts } from '../services/productService';

const ProductDetails = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const products = getProducts();
  const product = getProductById(id) || products[0];

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const handleAddToCart = () => {
    if (product.stock === 0) return;

    for (let i = 0; i < qty; i += 1) {
      addItem(product);
    }

    showToast?.(`${product.name} added to cart!`, 'success');
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-10">
      <div className="grid gap-6 rounded-2xl bg-white p-4 shadow-lg md:grid-cols-2 md:gap-10 md:p-6">
        <div className="flex items-center justify-center rounded-xl bg-slate-50 p-4 md:p-6">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[220px] w-full object-contain transition hover:scale-105 sm:max-h-[300px]"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{product.name}</h1>

          <div className="text-yellow-400">
            {'*'.repeat(Math.round(product.rating || 4))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xl font-bold text-blue-600">${product.price}</span>
            {product.oldPrice && (
              <>
                <span className="text-gray-400 line-through">${product.oldPrice}</span>
                <span className="rounded bg-red-100 px-2 py-1 text-sm text-red-600">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600">{product.description}</p>

          <div className={product.stock === 0 ? 'text-red-600' : 'text-green-600'}>
            {product.stock === 0 ? 'Out of Stock' : `${product.stock} items available`}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium">Qty:</span>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-20 rounded border px-2 py-1"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 rounded-lg py-3 font-semibold text-white ${
                product.stock === 0 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Add to Cart
            </button>

            <button
              disabled={product.stock === 0}
              className="flex-1 rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Reviews productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetails;
