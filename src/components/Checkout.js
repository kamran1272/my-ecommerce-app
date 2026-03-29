import React, { useEffect, useMemo, useState } from 'react';
import PaymentGateway from './PaymentGateway';
import { sendOrderConfirmation } from '../utils/emailService';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { createOrder } from '../services/orderService';

// Mock brand logos (you can replace with actual image URLs)
const brandLogos = {
  Apple: '🍎',
  Dell: '🖥️',
  Lenovo: '💼',
  ASUS: '🎮',
  HP: '🖨️',
  MSI: '⚡',
  Razer: '🐍',
  Acer: '📱',
  default: '💻',
};

const Checkout = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const { cartItems, cartTotal, clearItems } = useCart();
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [readyForPayment, setReadyForPayment] = useState(false);
  const [addProtection, setAddProtection] = useState(false);
  const [protectionCost, setProtectionCost] = useState(0);

  // Pre-fill email/name from localStorage (user profile)
  useEffect(() => {
    if (user?.email && !shippingInfo.email) {
      setShippingInfo((prev) => ({
        ...prev,
        email: user.email,
        fullName: prev.fullName || user.name || '',
      }));
    }
  }, [shippingInfo.email, user]);

  // Calculate protection cost (e.g., 10% of subtotal, capped at $99)
  useEffect(() => {
    const subtotal = cartTotal;
    const calculated = subtotal * 0.1;
    setProtectionCost(Math.min(calculated, 99));
  }, [cartTotal]);

  const totals = useMemo(() => {
    const subtotal = cartTotal;
    const shipping = subtotal > 0 ? 4.99 : 0;
    const tax = subtotal * 0.08;
    const protection = addProtection ? protectionCost : 0;
    const total = subtotal + shipping + tax + protection;
    return { subtotal, shipping, tax, total, protection };
  }, [addProtection, cartTotal, protectionCost]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const shippingErrors = {};
    if (!shippingInfo.fullName.trim()) shippingErrors.fullName = 'Full Name is required';
    if (!shippingInfo.address.trim()) shippingErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) shippingErrors.city = 'City is required';
    if (!shippingInfo.zipCode.trim()) shippingErrors.zipCode = 'Zip Code is required';
    if (!shippingInfo.email.trim()) shippingErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) shippingErrors.email = 'Enter a valid email';
    if (!shippingInfo.phone.trim()) shippingErrors.phone = 'Phone is required';
    setErrors(shippingErrors);
    return Object.keys(shippingErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      showToast && showToast('Your cart is empty.', 'error');
      return;
    }
    const valid = validate();
    if (valid) {
      setOrderPlaced(false);
      setReadyForPayment(true);
      showToast && showToast('Shipping details saved. Proceed to payment.', 'info');
    } else {
      setReadyForPayment(false);
    }
  };

  const order = useMemo(
    () => ({
      id: orderId || Math.floor(Math.random() * 1_000_000),
      total: totals.total,
      email: shippingInfo.email,
      status: 'Confirmed',
      items: cartItems,
      shipping: { ...shippingInfo },
      protectionPlan: addProtection ? `1‑Year Accidental Damage ($${protectionCost.toFixed(2)})` : 'None',
    }),
    [orderId, totals.total, shippingInfo, cartItems, addProtection, protectionCost]
  );

  const handleOrderSuccess = () => {
    const finalOrder = {
      ...order,
      userId: user?.email || 'guest',
    };

    setOrderPlaced(true);
    setReadyForPayment(false);
    setOrderId(finalOrder.id);
    createOrder(finalOrder);
    clearItems();
    if (shippingInfo.email) {
      sendOrderConfirmation(shippingInfo.email, finalOrder);
      showToast && showToast('Order placed! Confirmation email sent.', 'success');
    } else {
      showToast && showToast('Order placed successfully.', 'success');
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  // Helper to get brand from product name
  const getBrand = (productName) => {
    const known = Object.keys(brandLogos).find(brand => productName.includes(brand));
    return known || 'default';
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
          {/* Main Checkout Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
            {/* Trust & Security Header */}
            <div className="flex flex-wrap justify-center gap-6 mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="text-xl">🔒</span> SSL Secure
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="text-xl">✅</span> 30‑Day Returns
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="text-xl">💎</span> Authorized Laptop Reseller
              </div>
            </div>

            <h2 className="text-center text-2xl font-black text-slate-900 mb-2 md:text-3xl">Secure Checkout</h2>
            <p className="text-center text-slate-500 mb-8">Complete your laptop purchase with confidence</p>

            {orderPlaced ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-emerald-600 mb-2">Order Confirmed!</h3>
                <p className="text-slate-600">Thank you for shopping at Kamran Laptop Hub.</p>
                <p className="text-sm text-slate-500 mt-4">Order #{order.id} – We'll send updates to {shippingInfo.email}</p>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full inline-flex items-center justify-center text-sm">1</span>
                      Shipping Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
                        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
                        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 234 567 8900' },
                        { name: 'address', label: 'Street Address', type: 'text', placeholder: '123 Laptop Lane' },
                        { name: 'city', label: 'City', type: 'text', placeholder: 'San Francisco' },
                        { name: 'zipCode', label: 'ZIP Code', type: 'text', placeholder: '94105' },
                      ].map(({ name, label, type, placeholder }) => (
                        <div key={name} className={name === 'address' ? 'sm:col-span-2' : ''}>
                          <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
                            {label} *
                          </label>
                          <input
                            type={type}
                            id={name}
                            name={name}
                            placeholder={placeholder}
                            className={`w-full px-4 py-2.5 rounded-xl border ${
                              errors[name] ? 'border-red-500 bg-red-50' : 'border-slate-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-300 transition`}
                            value={shippingInfo[name]}
                            onChange={handleShippingChange}
                          />
                          {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Laptop Protection Plan (add-on) */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <label className="flex flex-col gap-3 cursor-pointer sm:flex-row sm:items-start">
                      <input
                        type="checkbox"
                        checked={addProtection}
                        onChange={(e) => setAddProtection(e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-300"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-slate-800">Add Laptop Protection Plan</span>
                        <p className="text-sm text-slate-500">
                          1‑year accidental damage coverage (drops, spills, electrical surges). <br />
                          <span className="text-xs">Covers repair or replacement – dedicated support.</span>
                        </p>
                      </div>
                      <span className="font-bold text-emerald-600">{formatCurrency(protectionCost)}</span>
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition"
                    >
                      Continue to Payment
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                      onClick={() => window.history.back()}
                    >
                      Back to Cart
                    </button>
                  </div>
                </form>

                {readyForPayment && (
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full inline-flex items-center justify-center text-sm">2</span>
                      Secure Payment
                    </h3>
                    <PaymentGateway total={totals.total} onSuccess={handleOrderSuccess} />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100 h-fit lg:sticky lg:top-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Your Laptop Order</h3>
            {cartItems.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Cart is empty.</p>
            ) : (
              <>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {cartItems.map((item) => {
                    const brand = getBrand(item.name);
                    return (
                      <div key={item.id} className="flex gap-3 pb-3 border-b border-slate-100">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">
                          {brandLogos[brand]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                            <span className="font-medium text-slate-800">{item.name}</span>
                            <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                          <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                          {/* Laptop specs if available */}
                          {item.specs && (
                            <p className="text-xs text-slate-400 mt-1">{item.specs.cpu} · {item.specs.ram} · {item.specs.storage}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span>{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Shipping</span>
                    <span>{totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax (8%)</span>
                    <span>{formatCurrency(totals.tax)}</span>
                  </div>
                  {addProtection && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Protection Plan</span>
                      <span>{formatCurrency(totals.protection)}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 pt-2 flex justify-between text-lg font-bold text-slate-900">
                    <span>Total</span>
                    <span>{formatCurrency(totals.total)}</span>
                  </div>
                </div>

                {/* Laptop Expertise Badge */}
                <div className="mt-5 bg-blue-50 rounded-xl p-3 text-xs text-center text-blue-800">
                  ⚡ Laptop expert support included • 2‑year warranty on all new laptops
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
