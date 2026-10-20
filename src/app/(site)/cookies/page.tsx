import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy | YourRent',
  description: 'Learn how YourRent uses cookies and tracking technologies.',
};

export default function CookiePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold text-slate-900">Cookie Policy</h1>
        <p className="text-sm text-slate-500 mt-2">Last updated: January 2026</p>
      </div>

      <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-2">1. What are cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help us remember your preferences, keep you logged in, and understand how you use YourRent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-2">2. Essential Cookies</h2>
          <p className="mb-2">These cookies are necessary for the platform to function:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>accessToken:</strong> Keeps you logged into your account securely.</li>
            <li><strong>userRole:</strong> Ensures you only see the dashboard for your account type (Tenant, Landlord, or Admin).</li>
            <li><strong>userData:</strong> Caches basic profile information to improve load times.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-2">3. Analytics Cookies</h2>
          <p>
            We use analytics to understand which pages are most visited and how users navigate the site. This data is anonymized and used only to improve YourRent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-2">4. Managing Cookies</h2>
          <p>
            You can control cookies through your browser settings. However, blocking essential cookies will prevent you from logging in to your YourRent account.
          </p>
        </section>
      </div>
    </div>
  );
}
