import Link from 'next/link';
import { Search, Home } from 'lucide-react';

export default function SiteNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-7xl font-black text-indigo-600">404</h1>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Page not found</h2>
          <p className="text-slate-500 mt-2">The page you are looking for doesn`t exist.</p>
        </div>
        <div className="flex justify-center gap-3 pt-4">
          <Link href="/properties" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-500 transition">
            <Search className="w-4 h-4" /> Browse Properties
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition">
            <Home className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
