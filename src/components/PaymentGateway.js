import React, { useState } from 'react';

const PaymentGateway = ({ total, onSuccess }) => {
  const [method, setMethod] = useState('cod');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handlePayment = (e) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setMessage('✅ Payment successful! Order placed.');
      if (onSuccess) onSuccess();
    }, 1500);
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-md rounded-2xl border border-slate-100 bg-white p-5 shadow-xl sm:p-8">
      
      {/* Title */}
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">
        Checkout
      </h2>

      <form onSubmit={handlePayment} className="space-y-5">

        {/* Payment Methods */}
        <div>
          <label className="block text-slate-700 font-semibold mb-3">
            Select Payment Method
          </label>

          <div className="space-y-2">
            
            {/* COD */}
            <label className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer ${method === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={method === 'cod'}
                onChange={(e) => setMethod(e.target.value)}
              />
              <span>💵 Cash on Delivery</span>
            </label>

            {/* Card */}
            <label className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer ${method === 'stripe' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
              <input
                type="radio"
                name="payment"
                value="stripe"
                checked={method === 'stripe'}
                onChange={(e) => setMethod(e.target.value)}
              />
              <span>💳 Credit / Debit Card</span>
            </label>

            {/* PayPal */}
            <label className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer ${method === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={method === 'paypal'}
                onChange={(e) => setMethod(e.target.value)}
              />
              <span>🌐 PayPal</span>
            </label>

          </div>
        </div>

        {/* Card Fields (only if card selected) */}
        {method === 'stripe' && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Card Number"
              className="w-full border rounded-lg px-3 py-2"
              required
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full border rounded-lg px-3 py-2 sm:w-1/2"
                required
              />
              <input
                type="text"
                placeholder="CVV"
                className="w-full border rounded-lg px-3 py-2 sm:w-1/2"
                required
              />
            </div>
          </div>
        )}

        {/* Total */}
        <div className="text-lg font-bold text-slate-800 flex justify-between border-t pt-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* Message */}
        {message && (
          <div className="text-green-600 text-center text-sm">
            {message}
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={processing}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition"
        >
          {processing
            ? 'Processing...'
            : method === 'cod'
            ? 'Place Order'
            : 'Pay Now'}
        </button>

      </form>
    </div>
  );
};

export default PaymentGateway;
