import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto py-12 px-4 md:px-8 max-w-4xl">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-6 text-slate-700 leading-relaxed">

        <p>
          At <span className="font-semibold text-slate-900">Kamran Laptop Hub</span>, 
          we value your privacy and are committed to protecting your personal information. 
          This Privacy Policy explains how we collect, use, and safeguard your data when 
          you use our website.
        </p>

        {/* Information */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            1. Information We Collect
          </h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Personal details (name, email, address, phone number)</li>
            <li>Order and payment information</li>
            <li>Browsing activity and usage data</li>
            <li>Device and browser information</li>
          </ul>
        </section>

        {/* Usage */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>To process and deliver your orders</li>
            <li>To provide customer support</li>
            <li>To improve our website and services</li>
            <li>To send updates, offers, and promotions</li>
          </ul>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            3. Cookies & Tracking
          </h2>
          <p>
            We use cookies and similar technologies to enhance your browsing experience, 
            analyze site traffic, and personalize content.
          </p>
        </section>

        {/* Security */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            4. Data Security
          </h2>
          <p>
            We implement industry-standard security measures to protect your personal 
            data. However, no method of transmission over the Internet is completely secure.
          </p>
        </section>

        {/* Sharing */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            5. Sharing Your Information
          </h2>
          <p>
            We do not sell your personal data. We may share information with trusted 
            partners (such as payment providers and shipping services) only to fulfill orders.
          </p>
        </section>

        {/* Rights */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            6. Your Rights
          </h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Access, update, or delete your personal data</li>
            <li>Opt-out of marketing communications</li>
            <li>Request information about how your data is used</li>
          </ul>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            7. Contact Us
          </h2>
          <p>
            If you have any questions, contact us at:
          </p>
          <p className="mt-2 font-semibold text-blue-600">
            support@kamranlaptops.com
          </p>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicy;