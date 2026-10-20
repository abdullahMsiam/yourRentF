'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Clock,
  MessageSquare,
  Headphones,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const SUPPORT_CHANNELS = [
  {
    icon: <Headphones className="w-5 h-5" />,
    title: 'Customer Support',
    desc: 'Get help with your account, payments, or listings.',
    email: 'support@yourrent.app',
    response: '~2 hours',
  },
  {
    icon: <Briefcase className="w-5 h-5" />,
    title: 'Partnerships',
    desc: 'Explore collaboration or listing partnership opportunities.',
    email: 'partners@yourrent.app',
    response: '~1 business day',
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: 'General Inquiries',
    desc: 'Questions, feedback, or press — we read every message.',
    email: 'hello@yourrent.app',
    response: '~24 hours',
  },
];

const FAQS = [
  {
    q: 'How do I reset my password?',
    a: 'Go to the login page, click "Forgot password", and follow the email link. Passwords expire in 24 hours for security.',
  },
  {
    q: 'Why was my listing removed?',
    a: 'Listings are removed if they violate our content policy — fake listings, duplicate posts, or missing information. Reach out to support for details.',
  },
  {
    q: 'Can I get a refund for a completed payment?',
    a: 'Refunds are handled on a case-by-case basis. Contact support within 7 days of the payment with your transaction ID.',
  },
  {
    q: 'Do you offer enterprise plans?',
    a: 'Yes — for property management companies and agencies. Email partners@yourrent.app for a custom quote.',
  },
];

export default function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: wire to /api/contact
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    showToast('Message sent! We will reply within 24 hours.', 'success');
    setLoading(false);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" /> Average reply: 2 hours
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Let&apos;s talk
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Questions about listings, payments, or partnerships? Our team is here
            to help — fast.
          </p>
        </div>
      </section>

      {/* Support channels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SUPPORT_CHANNELS.map((c) => (
            <div
              key={c.title}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                {c.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{c.title}</h3>
              <p className="text-sm text-slate-600 mb-4">{c.desc}</p>
              <a
                href={`mailto:${c.email}`}
                className="text-sm font-semibold text-indigo-600 hover:underline block"
              >
                {c.email}
              </a>
              <p className="text-xs text-slate-400 mt-1">Reply in {c.response}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Contact information
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Reach out through any channel — or use the form to send a direct
                message.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Email
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    hello@yourrent.app
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Phone
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    +880 1700 000 000
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Office
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    Level 5, Gulshan 2
                    <br />
                    Dhaka 1212, Bangladesh
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
                <Clock className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Office hours
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    Sat – Thu · 10 AM – 6 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 text-white rounded-2xl p-5 space-y-2">
              <h3 className="font-bold">Need urgent help?</h3>
              <p className="text-sm text-indigo-100">
                For payment disputes or account security issues, call our hotline:
              </p>
              <p className="text-lg font-black">+880 1700 000 911</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Message received!
                </h2>
                <p className="text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out. Our team will respond within 24
                  hours at <strong>{formData.email || 'your email'}</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '', category: 'general' });
                  }}
                  className="inline-block bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  Send a message
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                  Fill out the form below — we&apos;ll route your message to the
                  right team.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      What is this about?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { value: 'general', label: 'General' },
                        { value: 'support', label: 'Support' },
                        { value: 'billing', label: 'Billing' },
                        { value: 'partner', label: 'Partnership' },
                      ].map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, category: c.value })
                          }
                          className={`px-3 py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                            formData.category === c.value
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={6}
                      minLength={20}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Please describe your issue or inquiry in detail..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Minimum 20 characters
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                    <p className="text-xs text-slate-400">
                      By submitting you agree to our{' '}
                      <Link href="/privacy" className="text-indigo-600 hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-semibold px-6 py-3 rounded-xl transition cursor-pointer whitespace-nowrap"
                    >
                      <Send className="w-4 h-4" />
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Answers to common questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group bg-white border border-slate-200 rounded-2xl p-5"
              >
                <summary className="cursor-pointer font-semibold text-slate-900 flex justify-between items-center gap-3">
                  {faq.q}
                  <span className="text-slate-400 group-open:rotate-180 transition shrink-0">
                    ▼
                  </span>
                </summary>
                <p className="mt-3 text-sm text-slate-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
