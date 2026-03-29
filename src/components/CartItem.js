import React, { useState, useCallback } from 'react';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const { id, name, price, quantity, image, brand } = item;
  const [isRemoving, setIsRemoving] = useState(false);

  const handleIncrement = useCallback(() => {
    onQuantityChange(item, quantity + 1);
  }, [item, quantity, onQuantityChange]);

  const handleDecrement = useCallback(() => {
    if (quantity > 1) {
      onQuantityChange(item, quantity - 1);
    }
  }, [item, quantity, onQuantityChange]);

  const handleInputChange = useCallback((e) => {
    const newQty = parseInt(e.target.value, 10);
    if (!isNaN(newQty) && newQty >= 1) {
      onQuantityChange(item, newQty);
    }
  }, [item, onQuantityChange]);

  const handleRemove = useCallback(() => {
    if (window.confirm(`Remove "${name}" from your cart?`)) {
      setIsRemoving(true);
      onRemove(item);
    }
  }, [item, name, onRemove]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  if (isRemoving) return null; // optional fade‑out effect could be added

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row items-center gap-4 border border-slate-100 hover:shadow-lg transition-all duration-200">
      {/* Product image / placeholder */}
      <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 flex-shrink-0">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl font-bold text-blue-600" role="img" aria-label="laptop">💻</span>
        )}
      </div>

      {/* Product details */}
      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-bold text-slate-800 text-lg">{name}</h3>
        {brand && <p className="text-xs text-slate-500 mt-0.5">{brand}</p>}
        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-1 text-sm">
          <span className="text-slate-600">Price: {formatCurrency(price)}</span>
          <span className="font-semibold text-slate-800">
            Total: {formatCurrency(price * quantity)}
          </span>
        </div>
      </div>

      {/* Quantity controls and remove button */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
          <button
            onClick={handleDecrement}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700 font-medium"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
          >
            −
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleInputChange}
            className="w-12 text-center border-0 focus:outline-none focus:ring-0 text-slate-800 font-medium"
            aria-label="Item quantity"
          />
          <button
            onClick={handleIncrement}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700 font-medium"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
          aria-label="Remove item"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;