import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

// High‑quality laptop‑focused banners (Unsplash + relevant alt text)
const banners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=500&fit=crop',
    alt: 'Gaming laptop with RGB keyboard',
    text: 'Next‑Gen Gaming Laptops',
    subtext: 'RTX 40‑series | 240Hz displays | 13th Gen Intel',
    link: '/products?category=gaming',
    bg: 'from-purple-700 via-indigo-800 to-blue-900',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=500&fit=crop',
    alt: 'Ultrabook on wooden desk',
    text: 'Ultrabooks for Creators',
    subtext: 'Lightweight • OLED touch • 15h battery life',
    link: '/products?category=ultrabook',
    bg: 'from-amber-500 via-rose-600 to-red-700',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1593642702909-dec73df255d7?w=1200&h=500&fit=crop',
    alt: 'Mobile workstation setup',
    text: 'Workstation Power',
    subtext: 'Threadripper • 64GB RAM • ISV certified',
    link: '/products?category=workstation',
    bg: 'from-emerald-600 via-teal-700 to-cyan-800',
  },
];

const BannerCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goTo = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((index + banners.length) % banners.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto‑play logic
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [isPaused, next]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prev, next]);

  // Touch/swipe support
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0) next();
      else prev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const active = useMemo(() => banners[current], [current]);

  return (
    <div
      className="w-full max-w-7xl mx-auto mb-12 px-0 sm:px-4"
      role="region"
      aria-label="Promotional carousel for laptops"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        {/* Slide container with fade transition */}
        <div
          className={`relative transition-opacity duration-500 ease-out ${
            isTransitioning ? 'opacity-80' : 'opacity-100'
          }`}
        >
          <div
            className={`relative flex flex-col md:flex-row items-center justify-between bg-gradient-to-r ${active.bg} min-h-[360px] md:min-h-[420px]`}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/30 mix-blend-multiply pointer-events-none" />

            {/* Image side */}
            <div className="relative z-10 h-52 w-full overflow-hidden md:h-full md:w-2/5">
              <img
                src={active.image}
                alt={active.alt}
                className="w-full h-full object-cover md:rounded-l-3xl transition-transform duration-700 hover:scale-105"
                loading="eager"
              />
            </div>

            {/* Text side */}
            <div className="relative z-10 flex-1 p-6 text-center text-white md:p-12 md:text-left">
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-sm rounded-full mb-4">
                🔥 Limited Offer
              </span>
              <h2 className="mb-3 text-2xl font-black leading-tight drop-shadow-lg sm:text-3xl md:text-5xl">
                {active.text}
              </h2>
              <p className="mb-6 max-w-md mx-auto text-sm text-white/90 sm:text-base md:mx-0 md:text-lg">
                {active.subtext}
              </p>
              <Link
                to={active.link}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 group"
              >
                Shop Now
                <span className="text-xl group-hover:translate-x-1 transition">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          aria-label="Previous banner"
          className="absolute left-2 top-1/2 z-20 h-9 w-9 -translate-y-1/2 rounded-full bg-black/40 text-white transition hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white sm:left-3 sm:h-10 sm:w-10"
        >
          ‹
        </button>
        <button
          onClick={next}
          aria-label="Next banner"
          className="absolute right-2 top-1/2 z-20 h-9 w-9 -translate-y-1/2 rounded-full bg-black/40 text-white transition hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white sm:right-3 sm:h-10 sm:w-10"
        >
          ›
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, idx) => (
            <button
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === idx ? 'w-8 bg-white' : 'w-2 bg-white/60 hover:bg-white/80'
              }`}
              onClick={() => goTo(idx)}
              aria-label={`Go to banner ${idx + 1}`}
              aria-current={current === idx ? 'true' : undefined}
            />
          ))}
        </div>
      </div>

      {/* Optional: small brand strip */}
      <div className="mt-6 flex flex-wrap justify-center gap-3 text-center text-xs text-slate-400 sm:gap-6">
        <span>✓ Free Shipping over $499</span>
        <span>✓ 30‑Day Returns</span>
        <span>✓ 24/7 Laptop Experts</span>
      </div>
    </div>
  );
};

export default BannerCarousel;
