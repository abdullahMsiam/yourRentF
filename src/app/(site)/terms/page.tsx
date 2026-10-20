import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | YourRent',
  description:
    'Read the terms and conditions governing the use of YourRent platform.',
};

const SECTIONS = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'eligibility', title: '2. Eligibility & Accounts' },
  { id: 'listings', title: '3. Listings & Content' },
  { id: 'payments', title: '4. Payments & Fees' },
  { id: 'conduct', title: '5. User Conduct' },
  { id: 'ip', title: '6. Intellectual Property' },
  { id: 'termination', title: '7. Termination' },
  { id: 'disclaimer', title: '8. Disclaimers' },
  { id: 'liability', title: '9. Limitation of Liability' },
  { id: 'changes', title: '10. Changes to Terms' },
  { id: 'contact', title: '11. Contact' },
];

export default function TermsPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
            Legal
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-400 mt-3">
            Last updated: January 15, 2026 · Effective: January 15, 2026
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-4 gap-10">
        {/* TOC */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              On this page
            </p>
            <nav className="space-y-1">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-sm text-slate-600 hover:text-indigo-600 transition py-1"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <article className="lg:col-span-3 space-y-10 text-slate-700 text-sm leading-relaxed">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-amber-900 text-xs font-semibold">
              ⚠️ This is a template document for demonstration. For a real
              production launch, please consult a licensed attorney in your
              jurisdiction.
            </p>
          </div>

          <section id="acceptance">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the YourRent platform (&quot;Service&quot;),
              you agree to be bound by these Terms of Service. If you do not
              agree to these terms, you must not use the Service. These terms
              apply to all visitors, registered users, landlords, and tenants.
            </p>
          </section>

          <section id="eligibility">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              2. Eligibility &amp; Accounts
            </h2>
            <p className="mb-3">
              To use YourRent, you must be at least 18 years old and legally
              capable of entering into contracts. When you register, you agree
              to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Take responsibility for all activities under your account</li>
            </ul>
          </section>

          <section id="listings">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              3. Listings &amp; Content
            </h2>
            <p className="mb-3">
              Landlords are solely responsible for the accuracy of their listings.
              By publishing a listing, you represent that:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>You own or have legal authority to rent the property</li>
              <li>All photos, descriptions, and pricing are accurate</li>
              <li>The listing does not violate any third-party rights</li>
              <li>The property complies with local housing regulations</li>
            </ul>
            <p className="mt-3">
              We reserve the right to remove any listing that violates our
              content policy or applicable law.
            </p>
          </section>

          <section id="payments">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              4. Payments &amp; Fees
            </h2>
            <p className="mb-3">
              Payments between tenants and landlords are processed via Stripe.
              YourRent does not directly handle or hold funds. By using the
              payment feature, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide valid payment information</li>
              <li>Pay all fees associated with the rental</li>
              <li>Accept Stripe&apos;s terms of service</li>
            </ul>
            <p className="mt-3">
              Refunds are handled on a case-by-case basis and are subject to
              Stripe&apos;s processing policies.
            </p>
          </section>

          <section id="conduct">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              5. User Conduct
            </h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Post false, misleading, or fraudulent information</li>
              <li>Harass, threaten, or discriminate against other users</li>
              <li>Attempt to gain unauthorized access to the platform</li>
              <li>Use automated tools to scrape or overwhelm the service</li>
              <li>Violate any applicable local, national, or international law</li>
            </ul>
          </section>

          <section id="ip">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              6. Intellectual Property
            </h2>
            <p>
              All content, branding, and software on YourRent is owned by YourRent
              Platform Inc. or its licensors. You may not copy, modify, distribute,
              or reverse engineer any part of the Service without prior written
              consent. Listings uploaded by users remain the property of the
              uploading user.
            </p>
          </section>

          <section id="termination">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              7. Termination
            </h2>
            <p>
              We may suspend or terminate your account at our discretion if you
              violate these terms, engage in harmful conduct, or for any other
              reason with reasonable notice. You may delete your account at any
              time from your dashboard settings.
            </p>
          </section>

          <section id="disclaimer">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              8. Disclaimers
            </h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind. We do not guarantee
              that listings are accurate, that tenants will pay, or that landlords
              will fulfill their obligations. We are a platform — not a party to
              rental agreements.
            </p>
          </section>

          <section id="liability">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              9. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, YourRent shall not be liable
              for any indirect, incidental, special, or consequential damages
              arising from your use of the Service. Our total liability shall not
              exceed the greater of (a) the amount you paid us in the last 12
              months or (b) USD $100.
            </p>
          </section>

          <section id="changes">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              10. Changes to Terms
            </h2>
            <p>
              We may update these terms from time to time. Material changes will
              be announced via email or in-app notifications at least 14 days
              before taking effect. Continued use of the Service after changes
              means you accept the updated terms.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">11. Contact</h2>
            <p>
              Questions about these terms? Reach us at{' '}
              <a
                href="mailto:legal@yourrent.app"
                className="text-indigo-600 hover:underline font-medium"
              >
                legal@yourrent.app
              </a>{' '}
              or visit our{' '}
              <Link href="/contact" className="text-indigo-600 hover:underline font-medium">
                contact page
              </Link>
              .
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
