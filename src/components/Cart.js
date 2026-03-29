import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  loadCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from '../utils/cart';

// Mock recommended products (laptop accessories)
const recommendedProducts = [
  { id: 101, name: 'Logitech MX Master 3S', price: 99.99, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=100&h=100&fit=crop', category: 'Accessories' },
  { id: 102, name: 'Laptop Stand Aluminum', price: 29.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop', category: 'Accessories' },
  { id: 103, name: 'USB-C Hub 7-in-1', price: 49.99, image: 'https://images.unsplash.com/photo-1606220588913-b3aac2b58642?w=100&h=100&fit=crop', category: 'Accessories' },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(() => loadCart());
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [estimatedShipping, setEstimatedShipping] = useState(null);
  const navigate = useNavigate();

  // Sync cart across tabs
  useEffect(() => {
    const sync = () => setCartItems(loadCart());
    window.addEventListener('storage', sync);
    window.addEventListener('cart-changed', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('cart-changed', sync);
    };
  }, []);

  const handleQuantityChange = useCallback((itemId, newQuantity) => {
    const safeQty = Math.max(1, Number.isFinite(+newQuantity) ? +newQuantity : 1);
    const updated = updateQuantity(itemId, safeQty);
    setCartItems(updated);
  }, []);

  const handleRemoveItem = useCallback((itemId) => {
    const updated = removeFromCart(itemId);
    setCartItems(updated);
  }, []);

  const handleClear = useCallback(() => {
    if (window.confirm('Remove all items from your cart?')) {
      const updated = clearCart();
      setCartItems(updated);
    }
  }, []);

  // Apply promo code (mock)
  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'LAPTOP10') {
      setDiscount(0.1); // 10% off
      setPromoError('');
    } else if (promoCode.toUpperCase() === 'FREESHIP') {
      setDiscount(0);
      setEstimatedShipping(0);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  // Estimate shipping (mock)
  const estimateShipping = () => {
    if (shippingZip.length === 5 && /^\d+$/.test(shippingZip)) {
      setEstimatedShipping(5.99);
    } else {
      setEstimatedShipping(null);
    }
  };

  // Calculate totals
  const { subtotal, totalItems, shipping, total, discountAmount } = useMemo(() => {
    const sub = cartItems.reduce(
      (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );
    const count = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
    const discountAmt = sub * discount;
    const subAfterDiscount = sub - discountAmt;
    let ship = estimatedShipping !== null ? estimatedShipping : (subAfterDiscount > 0 ? 4.99 : 0);
    if (discount === 0 && promoCode.toUpperCase() === 'FREESHIP') ship = 0;
    if (subAfterDiscount === 0) ship = 0;
    return {
      subtotal: sub,
      totalItems: count,
      shipping: ship,
      discountAmount: discountAmt,
      total: subAfterDiscount + ship,
    };
  }, [cartItems, discount, estimatedShipping, promoCode]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-6">Looks like you haven't added any laptops or accessories yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Browse Laptops
              <span>→</span>
            </Link>
            <div className="mt-8 grid grid-cols-1 gap-3 text-sm text-slate-500 sm:grid-cols-3">
              <div>✓ Free shipping over $499</div>
              <div>✓ 30-day returns</div>
              <div>✓ Laptop expert support</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-wider text-blue-600 font-semibold">Secure checkout</p>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900">Your Cart</h1>
            <p className="text-slate-500">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate('/products')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition font-medium"
            >
              Continue Shopping
            </button>
            <button
              onClick={handleClear}
              className="px-5 py-2.5 rounded-xl border border-red-300 bg-white text-red-600 hover:bg-red-50 transition font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row items-center gap-4 border border-slate-100 hover:shadow-lg transition"
              >
                {/* Product image placeholder */}
                <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-blue-600">💻</span>
                  )}
                </div>

                {/* Product details */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-slate-800">{item.name}</h3>
                  {item.brand && <p className="text-xs text-slate-500">{item.brand}</p>}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-1 text-sm">
                    <span className="text-slate-600">Price: {formatCurrency(item.price)}</span>
                    <span className="font-semibold text-slate-800">
                      Total: {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>

                {/* Quantity and remove */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="px-3 py-2 bg-slate-50 hover:bg-slate-100 transition"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="px-3 py-2 bg-slate-50 hover:bg-slate-100 transition"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {/* Recommended section (only if cart not empty) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 mt-6">
              <h3 className="font-bold text-slate-800 mb-3">You might also like</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {recommendedProducts.map((rec) => (
                  <Link
                    key={rec.id}
                    to={`/product/${rec.id}`}
                    className="flex flex-col items-center p-2 border border-slate-200 rounded-xl hover:shadow transition"
                  >
                    <img src={rec.image} alt={rec.name} className="w-16 h-16 object-cover rounded-lg" />
                    <p className="text-xs font-medium text-center mt-1">{rec.name}</p>
                    <p className="text-xs text-blue-600">{formatCurrency(rec.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Order Summary</h2>

              {/* Promo code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Promo code</label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="LAPTOP10 or FREESHIP"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    onClick={applyPromo}
                    className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition text-sm"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
                {discount > 0 && <p className="text-emerald-600 text-xs mt-1">10% discount applied!</p>}
              </div>

              {/* Shipping estimator */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Estimate shipping</label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={shippingZip}
                    onChange={(e) => setShippingZip(e.target.value.slice(0,5))}
                    placeholder="ZIP code"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                  <button
                    onClick={estimateShipping}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition text-sm"
                  >
                    Update
                  </button>
                </div>
                {estimatedShipping !== null && (
                  <p className="text-slate-500 text-xs mt-1">Shipping: {formatCurrency(estimatedShipping)}</p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Checkout button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition"
              >
                Proceed to Checkout
              </button>

              {/* Trust badges */}
              <div className="mt-5 text-xs text-center text-slate-400">
                <div className="flex justify-center gap-4 flex-wrap">
                  <span>🔒 Secure SSL</span>
                  <span>🚚 Free returns</span>
                  <span>💳 All major cards</span>
                </div>
                <p className="mt-2">30‑day hassle‑free returns on laptops & accessories</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
