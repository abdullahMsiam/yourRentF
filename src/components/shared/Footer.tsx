import Link from 'next/link';
import {
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from 'lucide-brands';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { label: 'Browse Properties', href: '/properties' },
    { label: 'How it Works', href: '/how-it-works' },
    { label: 'For Landlords', href: '/register' },
    { label: 'Pricing', href: '/pricing' },
  ];
  const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
  ];
  const legalLinks = [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Trust & Safety', href: '/trust' },
  ];

  const socialLinks = [
    { icon: <FacebookIcon className="w-4 h-4" />, href: '#', label: 'Facebook' },
    { icon: <TwitterIcon className="w-4 h-4" />, href: '#', label: 'Twitter' },
    { icon: <InstagramIcon className="w-4 h-4" />, href: '#', label: 'Instagram' },
    { icon: <LinkedinIcon className="w-4 h-4" />, href: '#', label: 'LinkedIn' },
    { icon: <GithubIcon className="w-4 h-4" />, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className="bg-slate-950 dark:bg-slate-950 text-slate-300 mt-auto border-t border-slate-800">
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Get rental updates in your inbox</h3>
            <p className="text-sm text-slate-400">Join 10,000+ subscribers. Fresh listings, market insights, and tips — no spam.</p>
            <form className="flex gap-2 max-w-md">
              <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600" />
              <button type="submit" className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-600 dark:text-white uppercase tracking-wider">Email</p>
              <a href="mailto:hello@yourrent.app" className="text-sm text-white hover:text-indigo-400 transition flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> hello@yourrent.app</a>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-600 dark:text-white uppercase tracking-wider">Phone</p>
              <a href="tel:+8801700000000" className="text-sm text-white hover:text-indigo-400 transition flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> +880 1700 000 000</a>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-600 dark:text-white uppercase tracking-wider">Office</p>
              <p className="text-sm text-white flex items-start gap-1.5"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Gulshan 2, Dhaka</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1 space-y-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-1.5 rounded-lg text-sm font-bold">YR</span>
            <span className="text-xl font-extrabold text-white">YourRent</span>
          </Link>
          <p className="text-sm text-slate-400 max-w-xs">Modern rental platform connecting tenants and landlords with verified listings and secure payments.</p>
          <div className="flex gap-2 pt-2">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white">Product</h4>
          <ul className="space-y-2">
            {productLinks.map((link) => (
              <li key={link.href}><Link href={link.href} className="text-sm text-slate-400 hover:text-white transition">{link.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white">Company</h4>
          <ul className="space-y-2">
            {companyLinks.map((link) => (
              <li key={link.href}><Link href={link.href} className="text-sm text-slate-400 hover:text-white transition">{link.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white">Legal</h4>
          <ul className="space-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}><Link href={link.href} className="text-sm text-slate-400 hover:text-white transition">{link.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-white">
          <p>© {currentYear} YourRent Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>🇧🇩 Made in Bangladesh</span>
            <span className="hidden sm:inline">·</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

