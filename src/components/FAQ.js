import React, { useState } from 'react';

// FAQ data with laptop‑focused questions & researched answers
const faqCategories = {
  purchasing: '🛒 Purchasing & Products',
  technical: '🔧 Technical & Specs',
  shipping: '🚚 Shipping & Delivery',
  returns: '🔄 Returns & Warranty',
  account: '👤 Account & Security',
};

const faqData = [
  // Purchasing
  {
    id: 1,
    category: 'purchasing',
    question: 'Which laptop brand is best for me? (Apple, Dell, Lenovo, ASUS, etc.)',
    answer: "It depends on your needs:\n• **Apple MacBook** – Best for creative professionals (video/photo editing), seamless ecosystem, and premium build.\n• **Dell XPS** – Excellent Windows ultrabooks with stunning displays, ideal for business and general use.\n• **Lenovo ThinkPad** – Legendary keyboards and durability, perfect for programmers and office work.\n• **ASUS ROG / TUF** – Top choice for gaming and high-performance tasks with aggressive cooling.\n• **HP Spectre / Envy** – Stylish 2-in-1s with great audio, good for students and home use.\n• **MSI / Razer** – Premium gaming laptops with high refresh rates and RGB.\nWe carry all major brands – use our chat to get a personalized recommendation.",
  },
  {
    id: 2,
    category: 'purchasing',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and financing options through Affirm (subject to credit approval). All transactions are SSL‑encrypted.',
  },
  {
    id: 3,
    category: 'purchasing',
    question: 'Do you offer student or military discounts?',
    answer: 'Yes! Students can verify via Student Beans for 5‑10% off. Military and first responders receive 7% off on select models. Contact support to apply the discount.',
  },
  // Technical
  {
    id: 4,
    category: 'technical',
    question: 'Intel Core vs AMD Ryzen – which processor should I choose?',
    answer: "**Intel Core (13th/14th Gen)** – Slightly better single‑core performance and Thunderbolt 4 support. Great for gaming and general productivity.\n**AMD Ryzen (7000 series)** – More cores for multitasking, better integrated graphics (Radeon), and often better battery life. Excellent for content creation and coding.\nFor most users, both are excellent. We recommend Intel for Thunderbolt peripherals, AMD for raw multi‑core value.",
  },
  {
    id: 5,
    category: 'technical',
    question: 'How much RAM and SSD storage do I need?',
    answer: "**RAM:**\n• 8GB – Basic web browsing, Office, light multitasking.\n• 16GB – Sweet spot for gaming, programming, photo editing.\n• 32GB+ – Video editing, virtual machines, heavy data work.\n\n**Storage:**\n• 256GB SSD – Light use, cloud storage.\n• 512GB SSD – Recommended for most users.\n• 1TB+ – Gamers, video editors, large file workers.\nAll our laptops have upgradeable RAM/storage (check model).",
  },
  {
    id: 6,
    category: 'technical',
    question: 'Do I need a dedicated GPU (NVIDIA RTX / AMD Radeon)?',
    answer: "Integrated graphics (Intel Iris Xe, AMD Radeon 700M) are fine for office, 4K video playback, and light gaming (eSports).\nDedicated GPU (RTX 4050 to 4090) is needed for AAA gaming, 3D rendering, AI/ML tasks, and video editing. We offer laptops with RTX 30/40 series and Radeon RX 7000M.",
  },
  {
    id: 7,
    category: 'technical',
    question: 'What is the difference between an Ultrabook, Gaming, and Workstation laptop?',
    answer: "**Ultrabook** – Thin, light, long battery life (e.g., Dell XPS, MacBook Air). Best for portability and everyday tasks.\n**Gaming Laptop** – Powerful GPU, high refresh display, aggressive cooling (ASUS ROG, MSI). Heavy, shorter battery.\n**Mobile Workstation** – ISV‑certified, pro GPU (NVIDIA RTX A‑series), high RAM. For CAD, scientific simulations, video production.",
  },
  // Shipping
  {
    id: 8,
    category: 'shipping',
    question: 'How long does shipping take?',
    answer: 'Free standard shipping (3–7 business days). Expedited (2–3 days) costs $9.99, and overnight (1–2 days) is $19.99. Orders before 2pm EST ship same day. Tracking provided via email.',
  },
  {
    id: 9,
    category: 'shipping',
    question: 'Do you ship internationally?',
    answer: 'Currently we ship to the US, Canada, UK, Australia, and most of Europe. International duties and taxes are the customer’s responsibility. Estimated delivery 7–14 days.',
  },
  // Returns & Warranty
  {
    id: 10,
    category: 'returns',
    question: 'What is your return policy for laptops?',
    answer: 'You have **30 days** from delivery to initiate a return. Laptops must be in original condition with all accessories. Return shipping is free within the US. Refunds are processed within 5–7 business days. Opened software, clearance items, and custom builds are final sale.',
  },
  {
    id: 11,
    category: 'returns',
    question: 'Does the laptop come with a warranty?',
    answer: 'Yes. All new laptops include the manufacturer’s **1‑year limited warranty** (parts & labor). You can extend to 3 years for $99 (accidental damage coverage available). Refurbished units have a 90‑day warranty with optional extension.',
  },
  // Account
  {
    id: 12,
    category: 'account',
    question: 'How do I track my order?',
    answer: 'Log into your account → My Orders → click “Track”. You’ll also receive email/SMS updates. If you checked out as guest, use the tracking link in your confirmation email.',
  },
  {
    id: 13,
    category: 'account',
    question: 'Is my personal and payment information safe?',
    answer: 'Absolutely. We use 256‑bit SSL encryption, PCI‑compliant payment processing, and never store full credit card details. Our site is scanned daily for vulnerabilities. See our Privacy Policy for details.',
  },
];

const FAQ = () => {
  const [activeId, setActiveId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const toggleAccordion = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg mb-4">
            <span className="text-3xl">❓</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Laptop FAQ
          </h1>
          <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
            Everything you need to know about choosing, buying, and owning a laptop – from specs to support.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-8 flex flex-col sm:flex-row gap-4 border border-slate-100">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Search questions or keywords (e.g., RAM, warranty, gaming)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-200"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {Object.entries(faqCategories).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No matching questions. Try a different search or <a href="/contact" className="text-blue-600">contact support</a>.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="transition-all">
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition"
                    aria-expanded={activeId === faq.id}
                  >
                    <span className="font-semibold text-slate-800 pr-8">
                      {faq.question}
                    </span>
                    <span className="text-blue-600 text-xl flex-shrink-0">
                      {activeId === faq.id ? '−' : '+'}
                    </span>
                  </button>
                  {activeId === faq.id && (
                    <div className="px-6 pb-5 text-slate-600 leading-relaxed whitespace-pre-line border-t border-slate-100 bg-slate-50/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Still have questions? CTA */}
        <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 text-center border border-blue-100">
          <p className="text-slate-700 mb-3">
            🤔 Still have questions? Our laptop experts are ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Contact Support
            </a>
            <a
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-slate-300 bg-white text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition"
            >
              Browse Laptops
            </a>
          </div>
          <p className="text-xs text-slate-400 mt-3">Live chat available 24/7 for registered users.</p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;