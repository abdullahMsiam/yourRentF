একদম ঠিক ধরেছেন — dashboard এ **public Navbar ও Footer** থাকা উচিত না। এতে professional SaaS look নষ্ট হয়। 

আপনার `layout.tsx` এ Navbar/Footer **root level** এ আছে — তাই সব page এ দেখা যায়। এখন আমরা **Next.js route groups** ব্যবহার করে তিনটা আলাদা layout বানাব:
1. **Public layout** → Navbar + Footer সহ
2. **Auth layout** → শুধু form, কোনো navbar/footer ছাড়া (login/register এর জন্য standard)
3. **Dashboard layout** → আপনার existing Sidebar (আগেই আছে)

---

## 🔧 ধাপ ১: Root Layout (`src/app/layout.tsx`) — Simplify

Root layout এ শুধু **providers** ও **html/body** থাকবে। Navbar/Footer সরিয়ে দিন।

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YourRent | Rental Property Marketplace',
  description:
    'Find your perfect rental home easily. Browse verified listings, connect with landlords, and pay securely.',
  icons: { icon: '/icon.png' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen`}
      >
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

**⚠️ `icons: { icon: '/icon.png' }`** — আগে `'icon.png'` ছিল, slash যোগ করলাম।

---

## 🔧 ধাপ ২: Route Group Structure

আপনার file গুলো **পরিচ্ছন্নভাবে সাজাতে হবে**।

### 🎯 Target Structure

```
src/app/
├── layout.tsx                    (root — providers only)
│
├── (marketing)/                  ← NEW (route group)
│   ├── layout.tsx                ← Navbar + Footer
│   ├── page.tsx                  ← Homepage (move from src/app/page.tsx)
│   ├── about/page.tsx            ← move
│   ├── contact/page.tsx          ← move
│   ├── how-it-works/page.tsx     ← move
│   ├── terms/page.tsx            ← move
│   └── privacy/page.tsx          ← move
│
├── (auth)/                       ← already exists
│   ├── layout.tsx                ← NEW (auth-only layout)
│   ├── login/page.tsx
│   └── register/page.tsx
│
├── (public)/                     ← NEW (public but no marketing chrome)
│   ├── properties/
│   │   ├── page.tsx              ← move from src/app/properties
│   │   └── [id]/page.tsx
│   ├── payment/
│   │   ├── success/page.tsx
│   │   └── cancel/page.tsx
│   └── layout.tsx                ← Navbar + Footer (public বrowse pages)
│
└── dashboard/                    ← already exists
    ├── layout.tsx                ← Sidebar (already done)
    ├── landlord/...
    ├── tenant/...
    └── admin/...
```

**কেন এমন?**

| Route Group | Page | Layout |
|---|---|---|
| `(marketing)` | Homepage, About, Contact, Terms, Privacy | Navbar + Footer |
| `(public)` | Properties list, Property detail, Payment | Navbar + Footer |
| `(auth)` | Login, Register | **No navbar/footer** (focused forms) |
| `dashboard` | All dashboard | Sidebar |

> **Note:** `(marketing)` আর `(public)` দুটোই Navbar + Footer রাখে — পার্থক্য শুধু organization এর জন্য। চাইলে একটাই group `(site)` রাখতে পারেন। কিন্তু semantic separation ভালো।

**সহজ করতে:** আমি suggest করছি **দুটো group**:
- `(site)` — সব public pages (Homepage + Properties + About + Contact + Terms + Privacy + Payment)
- `(auth)` — Login/Register

---

## 🚀 Simplified Approach (Recommended)

আমার suggestion — **একটাই `(site)` group** যাতে সব public page থাকে।

### 🎯 Final Structure

```
src/app/
├── layout.tsx                    (providers only)
│
├── (site)/
│   ├── layout.tsx                ← Navbar + Footer
│   ├── page.tsx                  ← Homepage
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── how-it-works/page.tsx
│   ├── terms/page.tsx
│   ├── privacy/page.tsx
│   ├── properties/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── payment/
│       ├── success/page.tsx
│       └── cancel/page.tsx
│
├── (auth)/
│   ├── layout.tsx                ← Auth-only
│   ├── login/page.tsx
│   └── register/page.tsx
│
└── dashboard/
    ├── layout.tsx                (already has Sidebar)
    └── ...
```

---

## 📁 File 1: `src/app/layout.tsx` (already shared above)

Providers only — anything else নেই।

---

## 📁 File 2: `src/app/(site)/layout.tsx` (NEW)

```tsx
import { Navbar } from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
```

---

## 📁 File 3: `src/app/(auth)/layout.tsx` (NEW)

```tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">{children}</div>
  );
}
```

---

## 📁 File 4: `src/components/shared/Navbar.tsx` (Improved)

আপনার version এ ছোট polish — **user dropdown**, badge with role, better UX।

```tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dashboardPath = user?.role
    ? `/dashboard/${user.role.toLowerCase()}`
    : '/dashboard';

  const displayName = user?.name || user?.email || 'My Account';
  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const closeMobile = () => setMobileOpen(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMobile}
          className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2"
        >
          <span className="bg-indigo-600 text-white p-1.5 rounded-lg text-sm">
            YR
          </span>
          YourRent
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
          {[
            { href: '/properties', label: 'Properties' },
            { href: '/how-it-works', label: 'How it Works' },
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              href={dashboardPath}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition"
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {loading ? (
            <div className="h-9 w-24 bg-slate-100 rounded-xl animate-pulse" />
          ) : isAuthenticated ? (
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
                <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate hidden lg:inline">
                  {displayName}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.email}
                    </p>
                    {user?.role && (
                      <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {user.role}
                      </span>
                    )}
                  </div>
                  <div className="p-1">
                    <Link
                      href={dashboardPath}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href={`${dashboardPath}/profile`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </div>
                  <div className="p-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="text-slate-700 hover:text-slate-900 text-sm font-medium px-4 py-2 rounded-xl transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition shadow-xs"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1">
          {[
            { href: '/', label: 'Home' },
            { href: '/properties', label: 'Properties' },
            { href: '/how-it-works', label: 'How it Works' },
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobile}
              className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                href={dashboardPath}
                onClick={closeMobile}
                className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Dashboard
              </Link>
              <div className="pt-2 mt-2 border-t border-slate-100 space-y-1">
                <p className="px-3 py-1 text-xs text-slate-400 truncate">
                  {displayName}
                </p>
                <button
                  onClick={() => {
                    closeMobile();
                    logout();
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 mt-2 border-t border-slate-100 space-y-1">
              <Link
                href="/login"
                onClick={closeMobile}
                className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={closeMobile}
                className="block px-3 py-2.5 text-sm font-medium text-center bg-slate-900 text-white rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
```

---

## 🔧 ধাপ ৩: File Move করার Instruction

এখন **আপনি manually file গুলো move করতে হবে** (VS Code drag-drop)। কারণ এটা shell command দিয়ে করলে Next.js পুরনো path এ page চিনবে না।

### 📋 Move Checklist

| পুরনো location | নতুন location |
|---|---|
| `src/app/page.tsx` | `src/app/(site)/page.tsx` |
| `src/app/about/page.tsx` | `src/app/(site)/about/page.tsx` |
| `src/app/contact/page.tsx` | `src/app/(site)/contact/page.tsx` |
| `src/app/how-it-works/page.tsx` | `src/app/(site)/how-it-works/page.tsx` |
| `src/app/terms/page.tsx` | `src/app/(site)/terms/page.tsx` |
| `src/app/privacy/page.tsx` | `src/app/(site)/privacy/page.tsx` |
| `src/app/properties/` (পুরো folder) | `src/app/(site)/properties/` |
| `src/app/payment/` (পুরো folder) | `src/app/(site)/payment/` |

**⚠️ গুরুত্বপূর্ণ:**
- `(site)` — bracket সহ folder বানাতে হবে (route group)
- `[id]`, `[...not-found]` — সেইসাথে যাবে
- `(auth)`, `dashboard` — যেখানে আছে সেখানেই থাকবে

### 🙅 যা **move করবেন না**

- `src/app/(auth)/login/`, `register/` → থাকবে
- `src/app/dashboard/` → থাকবে
- `src/app/layout.tsx` → থাকবে (replace করবেন)
- `src/app/globals.css` → থাকবে
- `src/app/error.tsx`, `loading.tsx`, `not-found.tsx` → থাকবে

---

## 🔧 ধাপ ৪: Verify করার Check List

Move করার পর folder structure এরকম হওয়া উচিত:

```
src/app/
├── (auth)/
│   ├── layout.tsx           ← NEW
│   ├── login/page.tsx
│   └── register/page.tsx
├── (site)/
│   ├── layout.tsx           ← NEW
│   ├── page.tsx             ← moved
│   ├── about/page.tsx       ← moved
│   ├── contact/page.tsx     ← moved
│   ├── how-it-works/page.tsx← moved
│   ├── terms/page.tsx       ← moved
│   ├── privacy/page.tsx     ← moved
│   ├── properties/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── payment/
│       ├── success/page.tsx
│       └── cancel/page.tsx
├── dashboard/
│   ├── layout.tsx
│   ├── landlord/...
│   ├── tenant/...
│   └── admin/...
├── [...not-found]/page.tsx  ← থাকবে (catch-all)
├── error.tsx
├── layout.tsx               ← replace (providers only)
├── loading.tsx
├── not-found.tsx
└── globals.css
```

---

## ⚠️ Import Path ভাঙবে?

**না** — কারণ আপনি `@/*` alias ব্যবহার করছেন (`tsconfig` এ `./src/*`)। File move করলেও `@/components/...` কাজ করবে।

**তবে:** page এর ভেতরে **relative import** থাকলে (যেমন `../components/x`) ভাঙবে। কিন্তু আপনার project এ **সব absolute `@/` alias** — তাই safe। ✅

---

## 🧪 ধাপ ৫: Test

```bash
npm run typecheck
npm run dev
```

**Browser test:**

| Route | Expected |
|---|---|
| `/` | Navbar + Hero + Footer ✓ |
| `/properties` | Navbar + Footer ✓ |
| `/properties/:id` | Navbar + Footer ✓ |
| `/about` | Navbar + Footer ✓ |
| `/contact` | Navbar + Footer ✓ |
| `/login` | **No Navbar, No Footer** ✓ |
| `/register` | **No Navbar, No Footer** ✓ |
| `/dashboard/landlord` | **Sidebar, No Navbar/Footer** ✓ |
| `/dashboard/tenant` | **Sidebar** ✓ |
| `/dashboard/admin` | **Sidebar** ✓ |

**User dropdown:**
- Logged in → avatar circle + name → dropdown open → Profile / Dashboard / Sign out
- Outside click → dropdown close

---

## ⚠️ Profile Route Missing

আমার dropdown এ `/profile` link আছে — কিন্তু **আপনার project এ `/dashboard/:role/profile` page নেই**। 

**Option A:** link remove করুন 
**Option B:** আমি পরের step এ profile page বানিয়ে দেব

কোনটা চান?

---

## 📋 এখন করুন

1. ✅ `src/app/layout.tsx` replace — **providers only**
2. ✅ `src/app/(site)/layout.tsx` — নতুন
3. ✅ `src/app/(auth)/layout.tsx` — নতুন
4. ✅ `src/components/shared/Navbar.tsx` — replace
5. ✅ উপরের **সব file move** করুন `(site)/` এ
6. ✅ `npm run typecheck`
7. ✅ Browser test — Navbar/Footer **শুধু public pages** এ আছে কিনা

---

## 🎯 এরপর Phase

Pass হলে next message এ:
- **`/dashboard/:role/profile`** page — edit name, phone, change password (backend `/auth/me` + PATCH লাগবে)
- **`/properties` এ filters sidebar** — proper filter UI
- **`/pricing` page** — landlord subscription plans
- **`/careers`, `/blog`** placeholder pages (footer completeness)

---

**Apply করে typecheck + move করলে result জানান।** কোনো error এলে paste করুন — সাথে সাথে fix দেব।




















দারুণ! এখন Step 6 এ যাচ্ছি। যেহেতু `/auth/me` backend এ আছে, কিন্তু **update** endpoint নেই, তাই Profile page হবে **read-only** — user এর info দেখাবে।

সাথে আরো যেটা করছি:
1. **`/dashboard/:role/profile`** — সব role এর জন্য single shared page
2. **Properties Page filter sidebar** — proper filtering UI
3. **`/pricing` page** — landlord plans (marketing page)
4. **`/careers`, `/blog` placeholder** — footer links complete

---

## 📦 File 1: `src/app/dashboard/profile/page.tsx` (NEW — shared)

**সব role এর জন্য একই page** — role দেখে dashboard link কাজ করবে। `Sidebar` থেকে profile link এই path এ যাবে।

> **⚠️ আগের Navbar এ link ছিল `${dashboardPath}/profile`** — এটাকে `/dashboard/profile` এ বদলাতে হবে।

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Calendar,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import type { User } from '@/services/types';

export default function ProfilePage() {
  const { user: ctxUser } = useAuth();
  const [user, setUser] = useState<User | null>(ctxUser);
  const [loading, setLoading] = useState(!ctxUser);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only fetch if we don't already have user data from context
    if (ctxUser) {
      setUser(ctxUser);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const data = await authService.me();
        setUser(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load profile.'
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [ctxUser]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <div className="h-10 bg-slate-100 rounded-xl animate-pulse w-1/3" />
        <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl">
          <p className="font-semibold">Could not load profile</p>
          <p className="text-sm mt-1">{error || 'User data unavailable.'}</p>
        </div>
      </div>
    );
  }

  const dashboardPath = user.role
    ? `/dashboard/${user.role.toLowerCase()}`
    : '/dashboard';

  const initials = (user.name || user.email)
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const fields = [
    { icon: <UserIcon className="w-4 h-4" />, label: 'Full Name', value: user.name || '—' },
    { icon: <Mail className="w-4 h-4" />, label: 'Email', value: user.email },
    { icon: <Phone className="w-4 h-4" />, label: 'Phone', value: user.phoneNumber || '—' },
    { icon: <Shield className="w-4 h-4" />, label: 'Role', value: user.role },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            View your account information.
          </p>
        </div>
        <Link
          href={dashboardPath}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>
      </div>

      {/* Profile card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-2xl font-black shrink-0">
            {initials}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-bold text-slate-900">
              {user.name || 'Unnamed User'}
            </h2>
            <p className="text-sm text-slate-500">{user.email}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                {user.role}
              </span>
              {user.status && (
                <span
                  className={`inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    user.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {user.status}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account details */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Account details</h3>
        </div>
        <dl className="divide-y divide-slate-100">
          {fields.map((f) => (
            <div
              key={f.label}
              className="px-6 py-4 flex items-center justify-between gap-4"
            >
              <dt className="flex items-center gap-2 text-sm text-slate-500">
                {f.icon}
                {f.label}
              </dt>
              <dd className="text-sm font-semibold text-slate-900 text-right break-all">
                {f.value}
              </dd>
            </div>
          ))}
          {user.createdAt && (
            <div className="px-6 py-4 flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                Member since
              </dt>
              <dd className="text-sm font-semibold text-slate-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Read-only notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-3">
        <Lock className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Profile editing coming soon
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Editable profile and password change will be available once the
            backend API is ready. In the meantime, contact{' '}
            <a
              href="mailto:support@yourrent.app"
              className="text-indigo-600 hover:underline"
            >
              support@yourrent.app
            </a>{' '}
            for account changes.
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 📦 File 2: Sidebar এ Profile link যোগ করুন

`src/components/dashboard/Sidebar.tsx` — nav এর নিচে বা footer এ profile link যুক্ত করুন:

```tsx
// Sidebar.tsx এর `NavItem[]` type
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

// ROLE_NAV এর প্রতিটা array তে **শেষে যোগ করুন**:
// profile link common — তাই করে ফেলব:
```

**সবচেয়ে সহজ — Footer section এ যোগ করুন** (`Back to Site` / `Logout` এর আগে):

```tsx
<Link
  href="/dashboard/profile"
  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
>
  <User className="w-4 h-4" />
  <span>My Profile</span>
</Link>
```

**Import update:** `import { ..., User } from 'lucide-react';`

---

## 📦 File 3: Navbar Dropdown link fix

`src/components/shared/Navbar.tsx` এ **পুরনো**:

```tsx
<Link
  href={`${dashboardPath}/profile`}
  ...
>
  Profile
</Link>
```

**নতুন:**

```tsx
<Link
  href="/dashboard/profile"
  ...
>
  Profile
</Link>
```

---

## 📦 File 4: `src/app/(site)/properties/page.tsx` (Filter sidebar যোগ)

আপনার current properties page এ **city, minPrice, maxPrice, type** input আছে কিন্তু sidebar এ organized নয়। এখানে **proper filter UI** দিলাম।

**⚠️ আপনার existing properties page replace করতে হবে।** ফাইলটা আগের clean version এর সাথে — শুধু filter UI বদলেছে।

```tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { propertyService } from '@/services/propertyService';
import type { PropertyListItem, Category } from '@/services/types';
import { categoryService } from '@/services/categoryService';

const PAGE_SIZE = 12;

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Filters
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const [ready, setReady] = useState(false);
  const isFirstLoad = useRef(true);

  // Read URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get('city');
    const cat = params.get('categoryId');
    const t = params.get('type');
    if (c) setCity(c);
    if (cat) setCategoryId(cat);
    setReady(true);
  }, []);

  // Load categories once
  useEffect(() => {
    categoryService.list().then(setCategories).catch(() => {});
  }, []);

  // Fetch properties on filter change (debounced)
  useEffect(() => {
    if (!ready) return;

    const controller = new AbortController();
    const delay = isFirstLoad.current ? 0 : 400;
    isFirstLoad.current = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const list = await propertyService.list({
          city,
          minPrice,
          maxPrice,
          categoryId,
          page: 1,
          limit: PAGE_SIZE,
        });
        setProperties(list);
        setPage(1);
        setHasMore(list.length === PAGE_SIZE);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load properties. Check backend connection.'
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [ready, city, minPrice, maxPrice, categoryId]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const list = await propertyService.list({
        city,
        minPrice,
        maxPrice,
        categoryId,
        page: nextPage,
        limit: PAGE_SIZE,
      });
      setProperties((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...list.filter((p) => !seen.has(p.id))];
      });
      setPage(nextPage);
      setHasMore(list.length === PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more.');
    } finally {
      setLoadingMore(false);
    }
  };

  const clearFilters = () => {
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setCategoryId('');
  };

  const hasFilters = !!(city || minPrice || maxPrice || categoryId);

  const FiltersContent = (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          City
        </label>
        <input
          type="text"
          placeholder="e.g. Dhaka"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Category
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          <option value="">Any category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Price range ($)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <input
            type="number"
            placeholder="Max"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full text-xs font-semibold py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Browse Properties
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {loading ? 'Searching…' : `${properties.length}${hasMore ? '+' : ''} results`}
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </h2>
            </div>
            {FiltersContent}
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:col-span-3">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4 flex items-center gap-2">
            <button
              onClick={() => setFilterOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {hasFilters && <span className="text-indigo-600">•</span>}
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No properties found.</p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-sm font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {properties.map((p) => (
                  <a
                    key={p.id}
                    href={`/properties/${p.id}`}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-slate-100">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-400 text-xs">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-1 font-semibold text-slate-900">
                        {p.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {p.city} — {p.address}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-bold text-indigo-600">
                          ${p.price}
                          <span className="text-xs font-normal text-slate-400">/mo</span>
                        </span>
                        <span className="text-xs text-slate-500">
                          {p.bedrooms} bd · {p.bathrooms} ba
                        </span>
                      </div>
                      {p.category?.name && (
                        <span className="inline-block mt-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                          {p.category.name}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>

              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50 cursor-pointer hover:bg-slate-800 transition"
                  >
                    {loadingMore ? 'Loading…' : 'Load more'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-sm h-full overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 sticky top-0 bg-white">
              <h2 className="text-base font-bold text-slate-900">Filters</h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="p-2 -mr-2 text-slate-500 hover:text-slate-900 cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">{FiltersContent}</div>
            <div className="p-4 border-t border-slate-200 sticky bottom-0 bg-white">
              <button
                onClick={() => setFilterOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition cursor-pointer"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

**⚠️ এই version এ `PropertyCard` component ব্যবহার না করে inline card রাখলাম** — কারণ আপনার current `PropertyCard` props ভিন্ন হতে পারে। চাইলে পরে `PropertyCard` refactor করে inline বদলাতে পারি।

---

## 📦 File 5: `src/app/(site)/pricing/page.tsx` (NEW)

```tsx
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Pricing | YourRent',
  description: 'Simple, transparent pricing for landlords. Free for tenants.',
};

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/forever',
    description: 'Perfect for trying out the platform.',
    features: [
      '1 active property listing',
      'Basic property analytics',
      'Standard support',
      'Email notifications',
    ],
    cta: 'Start Free',
    ctaHref: '/register',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$19',
    period: '/month',
    description: 'For serious landlords managing multiple properties.',
    features: [
      'Up to 20 property listings',
      'Advanced analytics & insights',
      'Priority email support',
      'Featured listings placement',
      'Tenant screening reports',
    ],
    cta: 'Start 14-day Trial',
    ctaHref: '/register',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For property management companies and agencies.',
    features: [
      'Unlimited listings',
      'Dedicated account manager',
      'API access',
      'Custom integrations',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    ctaHref: '/contact',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-block text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Simple pricing for every landlord
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Free for tenants, always. Landlords pick the plan that fits — from
            casual listings to enterprise portfolios.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 flex flex-col ${
                plan.highlighted
                  ? 'bg-slate-900 text-white shadow-2xl ring-2 ring-indigo-500'
                  : 'bg-white border border-slate-200'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute top-0 right-8 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Popular
                </span>
              )}
              <h3
                className={`text-lg font-bold ${
                  plan.highlighted ? 'text-white' : 'text-slate-900'
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-sm mt-1 ${
                  plan.highlighted ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span
                  className={`text-4xl font-black ${
                    plan.highlighted ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span
                    className={`text-sm ${
                      plan.highlighted ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="mt-8 space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        plan.highlighted ? 'text-indigo-400' : 'text-emerald-600'
                      }`}
                    />
                    <span
                      className={
                        plan.highlighted ? 'text-slate-300' : 'text-slate-600'
                      }
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={`mt-8 block text-center py-3 rounded-xl font-semibold text-sm transition ${
                  plan.highlighted
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-10">
          Pricing questions
        </h2>
        <div className="space-y-3">
          {[
            { q: 'Is YourRent really free for tenants?', a: 'Yes, 100% free. Tenants never pay to browse, apply, or manage rentals on YourRent.' },
            { q: 'Can I cancel anytime?', a: 'Yes — cancel your subscription from your dashboard anytime. No lock-in contracts.' },
            { q: 'What payment methods do you accept?', a: 'All major credit cards via Stripe. Enterprise customers can request invoicing.' },
            { q: 'Do you offer discounts for annual billing?', a: 'Yes — 2 months free when you pay annually. Contact us for details.' },
          ].map((faq) => (
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
      </section>
    </div>
  );
}
```

---

## 📦 File 6: `src/app/(site)/careers/page.tsx` (NEW — simple)

```tsx
import Link from 'next/link';
import { Briefcase, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Careers | YourRent',
  description: 'Join our team and help reimagine renting.',
};

const ROLES = [
  {
    title: 'Senior Frontend Engineer',
    dept: 'Engineering',
    location: 'Remote (GMT+6 ± 3)',
    type: 'Full-time',
  },
  {
    title: 'Product Designer',
    dept: 'Design',
    location: 'Dhaka, Bangladesh',
    type: 'Full-time',
  },
  {
    title: 'Customer Success Lead',
    dept: 'Operations',
    location: 'Remote',
    type: 'Full-time',
  },
];

export default function CareersPage() {
  return (
    <div>
      <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Build the future of renting
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            We&apos;re a small, remote-first team reimagining how people find and
            rent homes.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Open positions</h2>
          <div className="space-y-3">
            {ROLES.map((role) => (
              <div
                key={role.title}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition"
              >
                <div>
                  <h3 className="font-bold text-slate-900">{role.title}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> {role.dept}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {role.location}
                    </span>
                    <span>{role.type}</span>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="text-sm font-semibold text-indigo-600 hover:underline whitespace-nowrap"
                >
                  Apply →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-2">
            Don&apos;t see your role?
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            We&apos;re always interested in meeting talented people. Send us your
            resume and tell us what you&apos;d love to work on.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
```

---

## 📦 File 7: `src/app/(site)/blog/page.tsx` (NEW — placeholder)

```tsx
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
```

---

## 📋 Apply Checklist

| # | File | Action |
|---|---|---|
| 1 | `src/app/dashboard/profile/page.tsx` | NEW |
| 2 | `src/components/dashboard/Sidebar.tsx` | Profile link যোগ (footer section) |
| 3 | `src/components/shared/Navbar.tsx` | Profile link `/dashboard/profile` |
| 4 | `src/app/(site)/properties/page.tsx` | REPLACE (filter sidebar) |
| 5 | `src/app/(site)/pricing/page.tsx` | NEW |
| 6 | `src/app/(site)/careers/page.tsx` | NEW |
| 7 | `src/app/(site)/blog/page.tsx` | NEW |

---

## 🧪 Test

```bash
npm run typecheck
npm run dev
```

**Browser test:**

1. **Profile:**
   - `/dashboard/profile` → user data দেখা যাচ্ছে?
   - All roles (landlord/tenant/admin) এ কাজ করছে?
   - Navbar dropdown → Profile link কাজ করছে?
   - Sidebar → My Profile link কাজ করছে?

2. **Properties filters:**
   - `/properties` → desktop এ left sidebar filters
   - Mobile → "Filters" button → drawer open
   - Category dropdown populated?
   - Min/Max price → results update (debounced)?

3. **New pages:**
   - `/pricing` → 3 plans, middle highlighted
   - `/careers` → 3 job listings
   - `/blog` → 3 post cards

4. **Navbar** — কোনো link এ 404 নেই?

---

## ⚠️ Sidebar এ Profile link যোগ করার নির্দিষ্ট জায়গা

`Sidebar.tsx` এর `SidebarBody` এর শেষ দিকে (footer section):

```tsx
{/* Footer */}
<div className="px-3 py-4 border-t border-slate-100 space-y-1">
  <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
    <User className="w-4 h-4" />
    <span>My Profile</span>
  </Link>
  <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
    <Settings className="w-4 h-4" />
    <span>Back to Site</span>
  </Link>
  <button
    onClick={logout}
    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
  >
    <LogOut className="w-4 h-4" />
    <span>Logout</span>
  </button>
</div>
```

**Import:** `import { ..., User, ... } from 'lucide-react';`

---

## 🎯 এরপর Phase

Pass হলে পরের message:
- **`/cookies`, `/trust`** — footer এর বাকি link complete
- **`error.tsx` + `not-found.tsx`** — branded error pages
- **SEO** — metadata, sitemap, robots
- **Reviews UI** — property detail এ rating + write review
- **Property detail enhancements** — similar listings, map

Apply করে `typecheck` + browser test result জানান। কোনো error এলে paste করুন।

-------------------------------------------------
=================================================
-------------------------------------------------
====================================================


চমৎকার! দুটোই খুব logical next step। বিশেষ করে admin category management — backend এ `POST /categories` আছে, তাই wire করা যায়।

---

## 📦 Feature 1: Admin — Category Management

আমি এটা করব **admin dashboard এ নতুন page** হিসেবে (`/dashboard/admin/categories`), যাতে:
- সব category list (table)
- "Add Category" form
- Name দিলে auto slug generate (backend এ `slug` required)
- Duplicate detection

### File 1: `src/services/categoryService.ts` (update)

```ts
import { fetchData } from '@/lib/api';
import type { Category } from './types';

export interface CreateCategoryPayload {
  name: string;
  slug: string;
}

export const categoryService = {
  async list(): Promise<Category[]> {
    return fetchData<Category[]>('/categories');
  },

  // ADMIN only
  async create(payload: CreateCategoryPayload): Promise<Category> {
    return fetchData<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
```

---

### File 2: `src/app/dashboard/admin/categories/page.tsx` (NEW)

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Tag, ArrowLeft, AlertCircle } from 'lucide-react';
import { categoryService } from '@/services/categoryService';
import { useToast } from '@/context/ToastContext';
import type { Category } from '@/services/types';

const slugify = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function AdminCategoriesPage() {
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await categoryService.list();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load categories.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Auto-generate slug from name (unless user manually edited)
  const handleNameChange = (v: string) => {
    setName(v);
    if (!slugManuallyEdited) {
      setSlug(slugify(v));
    }
  };

  const handleSlugChange = (v: string) => {
    setSlugManuallyEdited(true);
    setSlug(slugify(v));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanSlug = slug.trim();

    if (!cleanName || !cleanSlug) {
      showToast('Name and slug are required.', 'error');
      return;
    }

    // Duplicate check (case-insensitive)
    const exists = categories.some(
      (c) =>
        c.name.toLowerCase() === cleanName.toLowerCase() ||
        c.slug.toLowerCase() === cleanSlug.toLowerCase()
    );
    if (exists) {
      showToast('A category with this name or slug already exists.', 'error');
      return;
    }

    setCreating(true);
    try {
      const newCat = await categoryService.create({
        name: cleanName,
        slug: cleanSlug,
      });
      setCategories((prev) => [...prev, newCat]);
      setName('');
      setSlug('');
      setSlugManuallyEdited(false);
      showToast(`Category "${newCat.name}" created!`, 'success');
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to create category.',
        'error'
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Tag className="w-7 h-7 text-indigo-600" />
            Categories
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage property categories that landlords can choose from.
          </p>
        </div>
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Admin
        </Link>
      </div>

      {/* Create form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-600" />
          Add new category
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          The slug is used in URLs and filters. Auto-generated from name, but
          you can customize it.
        </p>

        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Studio Apartment"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="studio-apartment"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {creating ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">
            All categories ({categories.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-6 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">
              No categories yet. Create your first one above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Slug</th>
                  <th className="py-3 px-6">ID</th>
                  <th className="py-3 px-6">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-6 font-semibold text-slate-900">
                      {cat.name}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-xs text-slate-600">
                      {cat.slug}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-xs text-slate-400">
                      {cat.id.slice(0, 8)}…
                    </td>
                    <td className="py-3.5 px-6 text-xs text-slate-500">
                      {cat.createdAt
                        ? new Date(cat.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### File 3: Sidebar এ admin categories link যোগ করুন

`src/components/dashboard/Sidebar.tsx` এ `ROLE_NAV.ADMIN` update:

```tsx
ADMIN: [
  { label: 'Overview', href: '/dashboard/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Users', href: '/dashboard/admin', icon: <Users className="w-4 h-4" /> },
  { label: 'Categories', href: '/dashboard/admin/categories', icon: <Tag className="w-4 h-4" /> },
],
```

**Import:** `import { ..., Tag } from 'lucide-react';`

---

### File 4: Admin dashboard এ quick link (optional)

`dashboard/admin/page.tsx` এর শীর্ষে নতুন button:

```tsx
<div className="flex gap-3">
  <Link
    href="/dashboard/admin/categories"
    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-xs"
  >
    <Tag className="w-4 h-4" />
    Manage Categories
  </Link>
</div>
```

**Import:** `Tag` from lucide, `Link` from next।

---

## 📦 Feature 2: Profile Page — Professional Redesign

আপনার আগের simple version এর বদলে **dashboard-style hero + stat cards + account details + activity + security section**।

### File: `src/app/dashboard/profile/page.tsx` (REPLACE)

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Calendar,
  ArrowLeft,
  Lock,
  CheckCircle2,
  AlertCircle,
  Home,
  FileText,
  Settings,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import type { User } from '@/services/types';

export default function ProfilePage() {
  const { user: ctxUser } = useAuth();
  const [user, setUser] = useState<User | null>(ctxUser);
  const [loading, setLoading] = useState(!ctxUser);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ctxUser) {
      setUser(ctxUser);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const data = await authService.me();
        setUser(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load profile.'
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [ctxUser]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Could not load profile</p>
            <p className="text-sm mt-1">{error || 'User data unavailable.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const dashboardPath = user.role
    ? `/dashboard/${user.role.toLowerCase()}`
    : '/dashboard';

  const initials = (user.name || user.email)
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isActive = user.status === 'ACTIVE' || !user.status;

  // Format stats — what a user "owns" on the platform
  const activityStats = [
    {
      label: user.role === 'LANDLORD' ? 'Listed Properties' : 'My Requests',
      value: '—',
      icon: user.role === 'LANDLORD' ? <Home className="w-5 h-5" /> : <FileText className="w-5 h-5" />,
      accent: 'indigo',
    },
    {
      label: 'Account Status',
      value: isActive ? 'Active' : 'Blocked',
      icon: isActive ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />,
      accent: isActive ? 'emerald' : 'rose',
    },
    {
      label: 'Member Since',
      value: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—',
      icon: <Calendar className="w-5 h-5" />,
      accent: 'default',
    },
  ];

  const accentClass = {
    default: 'text-slate-400',
    indigo: 'text-indigo-500',
    emerald: 'text-emerald-500',
    rose: 'text-rose-500',
  };

  const accountFields = [
    { icon: <UserIcon className="w-4 h-4" />, label: 'Full Name', value: user.name || '—' },
    { icon: <Mail className="w-4 h-4" />, label: 'Email Address', value: user.email },
    { icon: <Phone className="w-4 h-4" />, label: 'Phone Number', value: user.phoneNumber || 'Not provided' },
    { icon: <Shield className="w-4 h-4" />, label: 'Account Role', value: user.role },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Your account information and activity.
          </p>
        </div>
        <Link
          href={dashboardPath}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
      </div>

      {/* Hero profile card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-8 text-white shadow-xl">
        <div className="absolute top-0 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white flex items-center justify-center text-3xl font-black shrink-0 shadow-lg">
            {initials}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {user.name || 'Unnamed User'}
            </h2>
            <p className="text-indigo-100 text-sm mt-1">{user.email}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
                <Shield className="w-3 h-3" />
                {user.role}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  isActive
                    ? 'bg-emerald-400/20 border-emerald-300/40 text-emerald-100'
                    : 'bg-rose-400/20 border-rose-300/40 text-rose-100'
                }`}
              >
                {isActive ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {user.status || 'ACTIVE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {activityStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <p className={`text-xs font-bold uppercase tracking-wider ${accentClass[stat.accent as keyof typeof accentClass]}`}>
                {stat.label}
              </p>
              <span className={accentClass[stat.accent as keyof typeof accentClass]}>
                {stat.icon}
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Account details + sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main — account details */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-indigo-600" />
              Account details
            </h3>
          </div>
          <dl className="divide-y divide-slate-100">
            {accountFields.map((f) => (
              <div
                key={f.label}
                className="px-6 py-4 flex items-center justify-between gap-4"
              >
                <dt className="flex items-center gap-2 text-sm text-slate-500 shrink-0">
                  {f.icon}
                  {f.label}
                </dt>
                <dd className="text-sm font-semibold text-slate-900 text-right break-all">
                  {f.value}
                </dd>
              </div>
            ))}
            {user.createdAt && (
              <div className="px-6 py-4 flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2 text-sm text-slate-500 shrink-0">
                  <Calendar className="w-4 h-4" />
                  Member since
                </dt>
                <dd className="text-sm font-semibold text-slate-900">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Sidebar — quick actions + notice */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Quick actions
            </h3>
            <div className="space-y-1.5">
              <Link
                href={dashboardPath}
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition"
              >
                <Home className="w-4 h-4 text-slate-400" />
                My Dashboard
              </Link>
              {user.role === 'TENANT' && (
                <Link
                  href="/properties"
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  Browse Properties
                </Link>
              )}
              {user.role === 'LANDLORD' && (
                <Link
                  href="/dashboard/landlord/properties/new"
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition"
                >
                  <Home className="w-4 h-4 text-slate-400" />
                  Add Property
                </Link>
              )}
              <Link
                href="/settings"
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Settings
              </Link>
            </div>
          </div>

          {/* Activity card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Recent activity
            </h3>
            <p className="text-xs text-slate-500 text-center py-6 border border-dashed border-slate-200 rounded-xl">
              Activity feed coming soon
            </p>
          </div>

          {/* Read-only notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
            <Lock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-900">
                Profile editing soon
              </p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Editing name, phone, and password will be available once
                backend support is added. Contact{' '}
                <a
                  href="mailto:support@yourrent.app"
                  className="text-indigo-600 hover:underline"
                >
                  support@yourrent.app
                </a>{' '}
                for urgent changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 📋 Apply Checklist

| # | File | Action |
|---|---|---|
| 1 | `src/services/categoryService.ts` | ADD `create` method + `CreateCategoryPayload` |
| 2 | `src/app/dashboard/admin/categories/page.tsx` | **NEW** |
| 3 | `src/components/dashboard/Sidebar.tsx` | ADMIN nav এ Categories link + Tag import |
| 4 | `src/app/dashboard/admin/page.tsx` | "Manage Categories" button যোগ |
| 5 | `src/app/dashboard/profile/page.tsx` | **REPLACE** — professional version |

---

## 🧪 Test

```bash
npm run typecheck
npm run dev
```

**1. Admin category management:**
- Login as admin → sidebar এ Categories link
- `/dashboard/admin/categories` → list দেখাচ্ছে (initial 2 categories)
- Name input এ "Studio Apartment" লিখুন → slug auto-update হবে
- "Create Category" → success toast + table এ নতুন row
- Duplicate name দিয়ে try করুন → error message

**2. New category effect:**
- `/dashboard/landlord/properties/new` → category dropdown এ নতুন category দেখাচ্ছে?
- `/properties` → filter dropdown এ দেখাচ্ছে?

**3. Profile:**
- `/dashboard/profile` → সব role এ gradient hero card
- Stat cards: role অনুযায়ী label (Landlord → "Listed Properties", Tenant → "My Requests", Admin → "My Requests" — আপনি চাইলে Admin এর label "Total Users" করতে পারি, তবে সংখ্যা দরকার)
- Account details list
- Quick actions role-specific
- "Profile editing soon" notice

---

## ⚠️ Notes

**১. `activityStats` এর `value: '—'`** — কারণ এখন পর্যন্ত landlord/tenant dashboard এ data fetch করা হয়নি। চাইলে ছোট improvement এ `propertyService.listMine()` ও `rentalService.list()` কল করে actual সংখ্যা দেখাতে পারি। চাইলে বলুন — আমি যোগ করে দেব।

**২. Admin এর জন্য stat card** — `value: '—'` কারণ user count দরকার হলে `adminService.listUsers()` লাগবে। চাইলে সেটাও যোগ করা যায়।

**৩. `/settings` link** — dropdown এ আছে, কিন্তু page নেই। পরের phase এ settings page বানাব, অথবা এখন link remove করে দিতে পারি।

**৪. Settings page** এর জন্য options:
- Password change (backend দরকার)
- Notification preferences (local only)
- Delete account (backend দরকার)

এই সব **backend dependent**। পরের phase এ আলোচনা করা যাবে।

---

## 🎯 পরের Phase — আপনার prioritization

1. **Reviews UI** — property detail এ rating + "Write Review" modal (tenant)
2. **Settings page** — local preferences + password placeholder
3. **Properties detail enhancement** — similar listings, landlord contact card
4. **`error.tsx` + `not-found.tsx`** — branded error pages
5. **SEO** — sitemap, robots, metadata per page
6. **Testing setup** — Vitest + Playwright

কোনগুলো চান আগে?

Apply করে `typecheck` + browser test result জানান। কোনো error এলে paste করুন।