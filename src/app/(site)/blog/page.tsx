import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Blog | YourRent',
  description: 'Rental market insights, product updates, and tips for landlords and tenants.',
};

const POSTS = [
  {
    title: 'How to Price Your Rental Property in 2026',
    excerpt:
      'A data-driven guide to setting the right rent — factoring in location, amenities, and market demand.',
    tag: 'Landlords',
    date: 'Jan 10, 2026',
    slug: 'pricing-rental-property-2026',
  },
  {
    title: '5 Questions Tenants Should Ask Before Signing',
    excerpt:
      'Protect yourself from hidden issues. These five questions reveal red flags before move-in.',
    tag: 'Tenants',
    date: 'Jan 5, 2026',
    slug: 'questions-ask-before-signing',
  },
  {
    title: 'Introducing Secure Stripe Payments',
    excerpt:
      'We now support instant, escrow-backed payments between tenants and landlords.',
    tag: 'Product',
    date: 'Dec 20, 2025',
    slug: 'introducing-stripe-payments',
  },
];

export default function BlogPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            YourRent Blog
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
            Rental market insights, product updates, and practical tips.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {POSTS.map((post) => (
            <article
              key={post.slug}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition flex flex-col"
            >
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 self-start">
                {post.tag}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-3 leading-snug">
                {post.title}
              </h2>
              <p className="text-sm text-slate-600 mt-2 flex-1">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {post.date}
                </span>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  Read soon <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            🚧 More articles coming soon. Subscribe to our newsletter in the
            footer for updates.
          </p>
        </div>
      </section>
    </div>
  );
}
