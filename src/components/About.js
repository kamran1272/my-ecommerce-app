import React from 'react';

// Laptop-specific highlights based on deep research of top brands
const highlights = [
  { label: 'Premium Brands', detail: 'Apple • Dell • Lenovo • ASUS • MSI • Acer • HP • Razer' },
  { label: 'Cutting-edge Performance', detail: 'Intel Core Ultra • AMD Ryzen 8000 • Apple M3' },
  { label: 'Complete Peace of Mind', detail: '1-year warranty + lifetime tech advice' },
];

// Core values reflecting laptop e-commerce best practices and brand expertise
const values = [
  'Authorized partner for 15+ leading laptop manufacturers (Apple, Dell, Lenovo, ASUS, MSI)',
  'Rigorous testing: battery life, thermal performance, display accuracy & real-world benchmarks',
  'Price match guarantee against Best Buy, Amazon, Newegg & major retailers',
  'Sustainable trade-in program for old laptops — upgrade responsibly',
];

// Team roles specialized in laptop expertise and customer support
const team = [
  { name: 'Kamran Ali', role: 'Founder & Chief Laptop Specialist' },
  { name: 'Ayesha Khan', role: 'Head of Tech Support & Customer Experience' },
  { name: 'Bilal Ahmed', role: 'Logistics & Certified Refurbishment Lead' },
  { name: 'Sana Raza', role: 'Brand Partnerships & Procurement Lead (Apple, Dell, Lenovo, ASUS)' },
];

const About = () => {
  const handleExpertChat = () => {
    alert("📧 Our laptop specialists will contact you within 1 hour.\nYou can also reach us at experts@kamranlaptops.com");
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            About Kamran Laptop Hub
          </span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Built for laptop lovers.</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            We blend deep product research, competitive pricing, and knowledgeable support so you can shop confidently—from budget Chromebooks to premium mobile workstations. Whether it’s your first laptop or an upgrade to a high-performance machine.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <section className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-3">Our mission</h2>
            <p className="text-base leading-relaxed">
              Make finding the right laptop simple and stress-free. We partner with authorized distributors, test every model for performance benchmarks, and provide unbiased reviews so you can choose with confidence — whether you're a coder, designer, or gamer. From Apple MacBook Pro, Dell XPS, HP Spectre, Lenovo ThinkPad, ASUS ROG, to MSI and Razer gaming machines, we carry over 500+ meticulously vetted models.
            </p>
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              {highlights.map((item) => (
                <div key={item.label} className="bg-white/10 rounded-xl p-4 border border-white/15">
                  <p className="text-sm uppercase tracking-wide text-blue-100">{item.label}</p>
                  <p className="text-lg font-semibold">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4">What we believe</h2>
            <ul className="space-y-3 text-slate-700">
              {values.map((v) => (
                <li key={v} className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" aria-hidden="true"></span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.08em] text-slate-500 font-semibold">Team</p>
              <h2 className="text-2xl font-bold text-slate-900">People behind the promise</h2>
              <p className="text-slate-600 text-sm mt-1">Laptop specialists, certified technicians, and brand experts working together for you.</p>
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">K</div>
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">A</div>
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">B</div>
              <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold">S</div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {team.map((member) => (
              <div key={member.name} className="rounded-xl border border-slate-100 bg-slate-50 p-4 shadow-sm">
                <p className="font-semibold text-slate-900">{member.name}</p>
                <p className="text-sm text-slate-600">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 text-white rounded-2xl p-6 md:p-10 shadow-xl">
          <div className="md:flex md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.12em] text-slate-200 font-semibold">Our commitment</p>
              <h3 className="text-2xl md:text-3xl font-bold mt-2">We stand behind every laptop we sell.</h3>
              <p className="text-slate-200 mt-3 max-w-3xl">
                Questions about specs, compatibility, or need help choosing between an Ultrabook, gaming laptop, or mobile workstation? Our laptop experts are here to help. Your perfect machine is our mission — backed by honest guidance, warranty coverage, and hassle-free returns.
              </p>
            </div>
            <button
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 shadow transition hover:shadow-md md:mt-0 md:w-auto"
              onClick={handleExpertChat}
            >
              Chat with laptop expert
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
