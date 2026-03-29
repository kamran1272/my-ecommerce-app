import React from 'react';

const ReturnsPolicy = () => (
  <div className="container mx-auto py-12 px-4 max-w-4xl">

    {/* Header */}
    <div className="text-center mb-10">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
        Return & Refund Policy
      </h1>
      <p className="text-gray-600">
        Easy returns. Hassle-free refunds. Shop with confidence.
      </p>
    </div>

    {/* Info Banner */}
    <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl mb-8 text-sm">
      📦 You can return most items within <strong>30 days</strong> of delivery.
    </div>

    {/* Sections */}
    <div className="space-y-6">

      {/* Returns */}
      <div className="bg-white shadow-md rounded-xl p-6 border">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          🔄 Returns
        </h2>
        <ul className="list-disc ml-6 text-gray-600 space-y-1">
          <li>Return items within 30 days of delivery.</li>
          <li>Items must be unused and in original packaging.</li>
          <li>Proof of purchase is required.</li>
        </ul>
      </div>

      {/* Refunds */}
      <div className="bg-white shadow-md rounded-xl p-6 border">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          💰 Refunds
        </h2>
        <ul className="list-disc ml-6 text-gray-600 space-y-1">
          <li>Refunds are processed after inspection.</li>
          <li>Approved refunds take 5–7 business days.</li>
          <li>Shipping costs are non-refundable unless our fault.</li>
        </ul>
      </div>

      {/* Exchanges */}
      <div className="bg-white shadow-md rounded-xl p-6 border">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          🔁 Exchanges
        </h2>
        <p className="text-gray-600">
          We replace defective or damaged items. Contact support to arrange an exchange.
        </p>
      </div>

      {/* Contact */}
      <div className="bg-slate-50 border rounded-xl p-6 text-center">
        <h2 className="text-lg font-semibold mb-2">Need Help?</h2>
        <p className="text-gray-600 mb-4">
          Start your return or ask a question — we’re here for you.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="mailto:support@example.com"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Contact Support
          </a>

          <a
            href="/orders"
            className="bg-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300"
          >
            View Orders
          </a>
        </div>
      </div>

    </div>
  </div>
);

export default ReturnsPolicy;