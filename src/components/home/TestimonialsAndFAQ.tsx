'use client';

import { useState } from 'react';
import { ChevronDown, Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Tanvir Ahmed',
    role: 'Tenant in Dhaka',
    image: 'https://i.pravatar.cc/150?img=11',
    text: 'Finding an apartment in Dhaka used to take weeks. With YourRent, I applied and completed my payment in under two days!',
  },
  {
    name: 'Rahim Khan',
    role: 'Landlord in Sylhet',
    image: 'https://i.pravatar.cc/150?img=33',
    text: 'As a property owner, managing applications and receiving rent online has made tenant management effortless.',
  },
  {
    name: 'Sadia Islam',
    role: 'Tenant in Chattogram',
    image: 'https://i.pravatar.cc/150?img=47',
    text: 'The verified listings gave me peace of mind. I knew exactly what I was paying for before I even visited.',
  },
  {
    name: 'Arif Hossain',
    role: 'Tenant in Dhaka',
    image: 'https://i.pravatar.cc/150?img=12',
    text: 'The digital lease signing and instant receipts are game changers. I never had to visit an office.',
  },
  {
    name: 'Nusrat Jahan',
    role: 'Landlord in Rajshahi',
    image: 'https://i.pravatar.cc/150?img=5',
    text: 'I listed my property and got 3 verified applications within 24 hours. The screening process is fantastic.',
  },
  {
    name: 'Kamal Uddin',
    role: 'Tenant in Khulna',
    image: 'https://i.pravatar.cc/150?img=59',
    text: 'Transparent pricing, zero hidden fees. The Stripe integration made my first rent payment incredibly smooth.',
  },
  {
    name: 'Farhana Akter',
    role: 'Landlord in Dhaka',
    image: 'https://i.pravatar.cc/150?img=44',
    text: 'Managing multiple properties used to be a headache. Now everything is in one dashboard. Absolutely love it.',
  },
  {
    name: 'Rashed Karim',
    role: 'Tenant in Barishal',
    image: 'https://i.pravatar.cc/150?img=68',
    text: 'I moved to a new city and found a verified place to live within 3 days. YourRent saved me from fake listings.',
  },
  {
    name: 'Mehedi Hasan',
    role: 'Landlord in Chattogram',
    image: 'https://i.pravatar.cc/150?img=15',
    text: 'The support team is incredibly responsive. They helped me set up my first listing step-by-step.',
  },
];

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
  {
    q: 'What happens if I need to cancel a request?',
    a: 'You can withdraw a pending request from your tenant dashboard at any time before the landlord approves it.',
  },
  {
    q: 'Is there a fee for tenants?',
    a: 'No, YourRent is 100% free for tenants. We charge a small service fee to landlords only when a successful rental transaction occurs.',
  },
  {
    q: 'How long does approval take?',
    a: 'Most landlords respond within 24-48 hours. You will receive a notification as soon as they make a decision.',
  },
];

export default function TestimonialsAndFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-slate-100/60 dark:bg-slate-950 transition-colors relative overflow-hidden">
      
      {/* Special Background for Testimonials (Grid Pattern + Glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] max-w-7xl pointer-events-none">
        {/* Dot Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40 mask-image:linear-gradient(to_bottom,white,transparent)" />
        {/* Indigo Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28 relative z-10">
        
        {/* Testimonials Grid Section */}
        <div>
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">Loved by tenants & landlords</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Real stories from our growing community of 10,000+ users.</p>
          </div>

          {/* Masonry-style Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {testimonials.map((t, i) => (
              <div 
                key={i} 
                className="break-inside-avoid bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 relative group"
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-indigo-100 dark:text-indigo-900/30 group-hover:text-indigo-200 dark:group-hover:text-indigo-800/50 transition-colors" />
                
                <div className="flex text-amber-400 gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed relative z-10 mb-6">
                  "{t.text}"
                </p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <img 
                    src={t.image} 
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                  />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Everything you need to know about the product and billing.</p>
          </div>
          
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all duration-200 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-900">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 dark:text-white hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                >
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
                </button>
                <div className={`px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-all ${openIndex === idx ? 'block' : 'hidden'}`}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
