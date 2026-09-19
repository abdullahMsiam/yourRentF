
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <p>© 2026 YourRent Platform Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-900 transition">Privacy Policy</a>
          <a href="#" className="hover:text-slate-900 transition">Terms of Service</a>
          <a href="#" className="hover:text-slate-900 transition">Support</a>
        </div>
      </div>
    </footer>
  );
}
