import React from 'react';

const ShippingInfo = () => (
  <div className="container mx-auto py-12 px-4 max-w-4xl">

    {/* Header */}
    <div className="text-center mb-10">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
        Shipping Information
      </h1>
      <p className="text-gray-600">
        Fast, reliable delivery — wherever you are.
      </p>
    </div>

    {/* Highlight Banner */}
    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-8 text-sm">
      🚚 Enjoy <strong>FREE shipping</strong> on orders over $50!
    </div>

    <div className="space-y-6">

      {/* Delivery Times */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          ⏱ Delivery Times
        </h2>

        <div className="space-y-2 text-gray-600">
          <p><strong>Standard:</strong> 3–7 business days</p>
          <p><strong>Express:</strong> 1–3 business days</p>
          <p><strong>International:</strong> 7–21 business days</p>
        </div>
      </div>

      {/* Processing */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          📦 Order Processing
        </h2>

        <ul className="list-disc ml-6 text-gray-600 space-y-1">
          <li>Orders processed within 1–2 business days</li>
          <li>Weekend orders ship next business day</li>
        </ul>
      </div>

      {/* Costs */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          💰 Shipping Costs
        </h2>

        <ul className="list-disc ml-6 text-gray-600 space-y-1">
          <li>Free shipping on orders over $50 (domestic)</li>
          <li>Calculated at checkout based on location</li>
        </ul>
      </div>

      {/* Tracking */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          🔍 Track Your Order
        </h2>

        <p className="text-gray-600 mb-4">
          Once shipped, you’ll receive tracking details via email.
        </p>

        <a
          href="/orders"
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          View Orders
        </a>
      </div>

      {/* Contact */}
      <div className="bg-slate-50 border rounded-xl p-6 text-center">
        <h2 className="text-lg font-semibold mb-2">Need Help?</h2>
        <p className="text-gray-600 mb-4">
          Our support team is ready to assist you.
        </p>

        <a
          href="mailto:support@example.com"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Contact Support
        </a>
      </div>

    </div>
  </div>
);

export default ShippingInfo;