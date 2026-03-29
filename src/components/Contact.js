import React, { useState } from 'react';

// Laptop support categories for dropdown
const supportTopics = [
  'Technical Support (Hardware/Software)',
  'Order & Shipping Inquiry',
  'Returns & Warranty',
  'Product Recommendation',
  'Bulk / Business Purchase',
  'Partnership Opportunity',
  'Other',
];

const ContactForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    orderNumber: '',
    topic: supportTopics[0],
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Name, email, and message are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
    // Simulate sending message (replace with actual API call)
    setTimeout(() => setSubmitted(false), 5000);
    // Reset form (optional)
    setForm({
      name: '',
      email: '',
      orderNumber: '',
      topic: supportTopics[0],
      message: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-label="Laptop support form">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="orderNumber" className="block text-sm font-semibold text-slate-700 mb-1">
            Order Number (optional)
          </label>
          <input
            type="text"
            id="orderNumber"
            name="orderNumber"
            value={form.orderNumber}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition"
            placeholder="e.g., #KHL-12345"
          />
        </div>
        <div>
          <label htmlFor="topic" className="block text-sm font-semibold text-slate-700 mb-1">
            Support Topic
          </label>
          <select
            id="topic"
            name="topic"
            value={form.topic}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition bg-white"
          >
            {supportTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows="5"
          value={form.message}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition"
          placeholder="Describe your issue or question in detail..."
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm text-center">
          {error}
        </div>
      )}
      {submitted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-700 text-sm text-center">
          ✅ Thank you! A laptop support specialist will respond within 24 hours.
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition"
      >
        Send Support Request
      </button>
    </form>
  );
};

const Contact = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-wider text-blue-600 font-semibold">Get in touch</p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-2">
            Laptop Support Center
          </h1>
          <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
            Need help choosing a laptop, tracking an order, or technical assistance? Our experts are ready.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">✉️</span>
              <h2 className="text-2xl font-bold text-slate-800">Send us a message</h2>
            </div>
            <ContactForm />
          </div>

          {/* Contact Info & Support Channels */}
          <div className="space-y-6">
            {/* Direct Contact */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📞</span>
                <h2 className="text-xl font-bold text-slate-800">Laptop Expert Hotline</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 text-lg">📱</span>
                  <div>
                    <p className="font-semibold text-slate-800">Sales & Product Advice</p>
                    <p className="text-lg font-bold text-blue-600">+1 (800) 555-LAPTOP</p>
                    <p className="text-xs text-slate-500">Mon–Fri, 9am–8pm EST</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 text-lg">🔧</span>
                  <div>
                    <p className="font-semibold text-slate-800">Technical Support</p>
                    <p className="text-lg font-bold text-blue-600">+1 (800) 555-TECH</p>
                    <p className="text-xs text-slate-500">24/7 for registered devices</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 text-lg">✉️</span>
                  <div>
                    <p className="font-semibold text-slate-800">Email Support</p>
                    <p className="text-slate-700">support@kamranlaptops.com</p>
                    <p className="text-xs text-slate-500">Response within 12 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours & Live Chat */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">⏰</span>
                <h3 className="text-lg font-bold text-slate-800">Live Chat Hours</h3>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <span className="text-slate-600">Monday–Friday:</span>
                <span className="font-medium">8am – 10pm EST</span>
                <span className="text-slate-600">Saturday:</span>
                <span className="font-medium">10am – 8pm EST</span>
                <span className="text-slate-600">Sunday:</span>
                <span className="font-medium">Closed (email only)</span>
              </div>
              <button className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition">
                Start Live Chat
              </button>
            </div>

            {/* Office Location & Map */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">📍</span>
                <h3 className="text-lg font-bold text-slate-800">Visit Our Showroom</h3>
              </div>
              <p className="text-slate-600 text-sm">
                123 Laptop Boulevard, Suite 400<br />
                San Francisco, CA 94105<br />
                United States
              </p>
              <div className="mt-3 h-40 rounded-xl overflow-hidden">
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0193553395267!2d-122.419415484681!3d37.774929779759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Social & Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 pt-2 text-center">
              <span className="text-sm text-slate-400">🔒 Secure Contact</span>
              <span className="text-sm text-slate-400">✅ 30‑Day Support</span>
              <span className="text-sm text-slate-400">💎 Authorized Reseller</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
