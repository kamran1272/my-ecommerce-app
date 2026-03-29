import React from 'react';

const TermsOfService = () => (
  <div className="bg-slate-50 py-12 px-4">
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10">

      <h1 className="text-4xl font-extrabold mb-6 text-slate-800 text-center">
        Terms of Service
      </h1>

      <p className="text-slate-600 mb-6 text-center">
        Please read these terms carefully before using our platform.
      </p>

      {/* Section */}
      <Section title="Use of Website">
        <li>You must be at least 18 years old or have parental consent.</li>
        <li>You agree not to use the site for unlawful activities.</li>
      </Section>

      <Section title="Orders and Payments">
        <li>All orders are subject to acceptance and availability.</li>
        <li>We may refuse or cancel any order.</li>
        <li>Prices may change without notice.</li>
      </Section>

      <Section title="Intellectual Property">
        <p>
          All content on this website is protected by copyright laws and belongs
          to the company or its licensors.
        </p>
      </Section>

      <Section title="Limitation of Liability">
        <p>
          We are not responsible for damages resulting from the use of our
          website or products.
        </p>
      </Section>

      <Section title="Changes to Terms">
        <p>
          We may update these terms at any time. Continued use means you accept
          the updated terms.
        </p>
      </Section>

      <Section title="Contact Us">
        <p>
          Questions? Email us at{" "}
          <a
            href="mailto:support@example.com"
            className="text-blue-600 font-semibold hover:underline"
          >
            support@example.com
          </a>
        </p>
      </Section>

    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-slate-800 mb-3 border-l-4 border-blue-500 pl-3">
      {title}
    </h2>
    <ul className="list-disc ml-6 text-slate-600 space-y-2">
      {children}
    </ul>
  </div>
);

export default TermsOfService;