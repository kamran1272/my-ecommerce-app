import React from 'react';

const promotions = [
  {
    id: 1,
    title: 'Free Shipping',
    description: 'On all orders over $50',
    icon: '🚚',
    tone: 'from-sky-400/20 via-sky-200/40 to-sky-100',
    link: '/shop',
  },
  {
    id: 2,
    title: '24/7 Support',
    description: 'We are here to help you anytime',
    icon: '💬',
    tone: 'from-emerald-400/20 via-emerald-200/40 to-emerald-100',
    link: '/contact',
  },
  {
    id: 3,
    title: 'Secure Payment',
    description: '100% secure payment',
    icon: '🔒',
    tone: 'from-amber-400/20 via-amber-200/40 to-amber-100',
    link: '/checkout',
  },
];

const Promotions = () => {
  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 px-4">

      {promotions.map((promo) => (
        <a
          key={promo.id}
          href={promo.link}
          className={`group relative overflow-hidden rounded-2xl border border-white shadow-lg bg-gradient-to-br ${promo.tone} backdrop-blur-sm transition duration-300 hover:scale-[1.04] hover:shadow-2xl`}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-white/30"></div>

          <div className="relative flex items-center gap-4 p-6">

            {/* Icon Circle */}
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md text-2xl group-hover:scale-110 transition">
              {promo.icon}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {promo.title}
              </h3>
              <p className="text-slate-600 text-sm">
                {promo.description}
              </p>
            </div>

          </div>
        </a>
      ))}

    </div>
  );
};

export default Promotions;