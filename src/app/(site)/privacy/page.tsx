import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | YourRent',
  description:
    'Learn how YourRent collects, uses, and protects your personal information.',
};

const SECTIONS = [
  { id: 'overview', title: '1. Overview' },
  { id: 'collect', title: '2. Information We Collect' },
  { id: 'use', title: '3. How We Use Your Data' },
  { id: 'sharing', title: '4. Sharing & Disclosure' },
  { id: 'cookies', title: '5. Cookies & Tracking' },
  { id: 'security', title: '6. Data Security' },
  { id: 'retention', title: '7. Data Retention' },
  { id: 'rights', title: '8. Your Rights' },
  { id: 'children', title: '9. Children&apos;s Privacy' },
  { id: 'changes', title: '10. Changes to This Policy' },
  { id: 'contact', title: '11. Contact Us' },
];

export default function PrivacyPage() {
  return (
    <div>
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
            Legal
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400 mt-3">
            Last updated: January 15, 2026 · Effective: January 15, 2026
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-4 gap-10">
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

        <article className="lg:col-span-3 space-y-10 text-slate-700 text-sm leading-relaxed">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-amber-900 text-xs font-semibold">
              ⚠️ This is a template document for demonstration. For a real
              production launch, please consult a licensed attorney and comply
              with applicable privacy regulations (GDPR, CCPA, etc.).
            </p>
          </div>

          <section id="overview">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">1. Overview</h2>
            <p>
              YourRent Platform Inc. (&quot;we&quot;, &quot;us&quot;) operates the
              YourRent application. This policy explains what data we collect,
              how we use it, and your rights regarding that data.
            </p>
          </section>

          <section id="collect">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              2. Information We Collect
            </h2>
            <p className="mb-3">We collect the following categories of data:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Account data:</strong> name, email, password (hashed),
                phone number, role
              </li>
              <li>
                <strong>Listing data:</strong> property descriptions, photos,
                addresses, pricing
              </li>
              <li>
                <strong>Transaction data:</strong> rental requests, payment
                records, Stripe session IDs
              </li>
              <li>
                <strong>Technical data:</strong> IP address, browser type, device
                info, page visits
              </li>
              <li>
                <strong>Communication data:</strong> messages sent via our contact
                form
              </li>
            </ul>
          </section>

          <section id="use">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              3. How We Use Your Data
            </h2>
            <p className="mb-3">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide and operate the rental marketplace</li>
              <li>Process payments and prevent fraud</li>
              <li>Communicate about your account, listings, or rentals</li>
              <li>Improve the Service through analytics</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-3">
              We never sell your personal information to third parties.
            </p>
          </section>

          <section id="sharing">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              4. Sharing &amp; Disclosure
            </h2>
            <p className="mb-3">We share data only with:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Other users:</strong> landlords and tenants can see
                information relevant to rentals (e.g., name, contact)
              </li>
              <li>
                <strong>Service providers:</strong> Stripe (payments), Vercel
                (hosting), PostgreSQL (via Supabase/Neon)
              </li>
              <li>
                <strong>Law enforcement:</strong> only when legally required
              </li>
              <li>
                <strong>Business transfers:</strong> in the case of a merger,
                acquisition, or asset sale
              </li>
            </ul>
          </section>

          <section id="cookies">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              5. Cookies &amp; Tracking
            </h2>
            <p>
              We use essential cookies for authentication (accessToken,
              userRole, userData), and analytics cookies to understand usage
              patterns. You can disable non-essential cookies in your browser
              settings, but essential cookies are required for login.
            </p>
          </section>

          <section id="security">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              6. Data Security
            </h2>
            <p>
              We use industry-standard measures including HTTPS encryption,
              bcrypt password hashing, JWT-based authentication, and Stripe for
              secure payment processing. However, no system is 100% secure — we
              cannot guarantee absolute security.
            </p>
          </section>

          <section id="retention">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              7. Data Retention
            </h2>
            <p>
              Account data is retained while your account is active. Transaction
              records are kept for 7 years for tax and legal compliance. You can
              request deletion of your account at any time.
            </p>
          </section>

          <section id="rights">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              8. Your Rights
            </h2>
            <p className="mb-3">Depending on your jurisdiction, you may have:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Right to access your personal data</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to delete your data (&quot;right to be forgotten&quot;)</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email{' '}
              <a
                href="mailto:privacy@yourrent.app"
                className="text-indigo-600 hover:underline font-medium"
              >
                privacy@yourrent.app
              </a>
              .
            </p>
          </section>

          <section id="children">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              9. Children&apos;s Privacy
            </h2>
            <p>
              YourRent is not intended for users under 18. We do not knowingly
              collect data from children. If we discover such data, we will
              delete it promptly.
            </p>
          </section>

          <section id="changes">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this policy periodically. Material changes will be
              announced via email or in-app notification at least 14 days in
              advance.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              11. Contact Us
            </h2>
            <p>
              Questions about this policy? Email{' '}
              <a
                href="mailto:privacy@yourrent.app"
                className="text-indigo-600 hover:underline font-medium"
              >
                privacy@yourrent.app
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
