'use client';

import { useState } from 'react';
import { ChevronDown, Star } from 'lucide-react';

const faqs = [
  {
    q: 'How do I pay rent through YourRent?',
    a: 'Once your rental application is approved by the landlord, you can pay rent directly via credit/debit cards using our secure Stripe checkout.',
  },
  {
    q: 'Are properties listed on YourRent verified?',
    a: 'Yes, all property submissions undergo automated and manual review before being listed publicly.',
  },
  {
    q: 'Can landlords manage multiple properties?',
    a: 'Landlords get access to a dedicated dashboard to list, update, and manage rental requests for all their properties.',
  },
];

export default function TestimonialsAndFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Testimonials */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900">What Our Users Say</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 italic">
                "Finding an apartment in Dhaka used to take weeks. With YourRent, I applied and completed my payment in under two days!"
              </p>
              <div className="text-xs">
                <p className="font-bold text-slate-900">Tanvir Ahmed</p>
                <p className="text-slate-400">Tenant in Dhaka</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 italic">
                "As a property owner, managing applications and receiving rent online has made tenant management effortless."
              </p>
              <div className="text-xs">
                <p className="font-bold text-slate-900">Rahim Khan</p>
                <p className="text-slate-400">Landlord in Sylhet</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 text-sm hover:bg-slate-50 transition"
                >
                  {faq.q}
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      openIndex === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}