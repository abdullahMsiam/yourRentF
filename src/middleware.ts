/* import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id?: string;
  role?: string;
  exp?: number;
}

const ROLE_HOME: Record<string, string> = {
  TENANT: '/dashboard/tenant',
  LANDLORD: '/dashboard/landlord',
  ADMIN: '/dashboard/admin',
};

// Routes accessible by ANY authenticated dashboard user
const SHARED_DASHBOARD_ROUTES = ['profile', 'settings'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // 1. Missing token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Decode JWT
  let decoded: JwtPayload;
  try {
    decoded = jwtDecode<JwtPayload>(token);
  } catch {
    const res = NextResponse.redirect(new URL('/login', request.url));
    res.cookies.delete('accessToken');
    res.cookies.delete('userRole');
    return res;
  }

  // 3. Expiry check
  const now = Math.floor(Date.now() / 1000);
  if (decoded.exp && decoded.exp < now) {
    const res = NextResponse.redirect(new URL('/login', request.url));
    res.cookies.delete('accessToken');
    res.cookies.delete('userRole');
    return res;
  }

  const role = decoded.role;
  const home = role ? ROLE_HOME[role] : undefined;

  if (!home) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Landing on /dashboard → role home
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    return NextResponse.redirect(new URL(home, request.url));
  }

  // 5. Split path segments
  const segments = pathname.split('/'); // ['', 'dashboard', '<sub>', ...]
  const sub = segments[2];

  // 6. Shared routes — any authenticated role can access
  if (SHARED_DASHBOARD_ROUTES.includes(sub)) {
    return NextResponse.next();
  }

  // 7. Role guard for role-specific dashboards
  const allowedSub =
    (role === 'TENANT' && sub === 'tenant') ||
    (role === 'LANDLORD' && sub === 'landlord') ||
    (role === 'ADMIN' && sub === 'admin');

  if (!allowedSub) {
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
}; */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id?: string;
  role?: string;
  exp?: number;
}

const ROLE_HOME: Record<string, string> = {
  TENANT: '/dashboard/tenant',
  LANDLORD: '/dashboard/landlord',
  ADMIN: '/dashboard/admin',
};

// Routes accessible by ANY authenticated dashboard user
const SHARED_DASHBOARD_ROUTES = ['profile', 'settings'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // 1. Missing token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Decode JWT
  let decoded: JwtPayload;
  try {
    decoded = jwtDecode<JwtPayload>(token);
  } catch {
    const res = NextResponse.redirect(new URL('/login', request.url));
    res.cookies.delete('accessToken');
    res.cookies.delete('userRole');
    return res;
  }

  // 3. Expiry check
  const now = Math.floor(Date.now() / 1000);
  if (decoded.exp && decoded.exp < now) {
    const res = NextResponse.redirect(new URL('/login', request.url));
    res.cookies.delete('accessToken');
    res.cookies.delete('userRole');
    return res;
  }

  const role = decoded.role;
  const home = role ? ROLE_HOME[role] : undefined;

  if (!home) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Landing on /dashboard → role home
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    return NextResponse.redirect(new URL(home, request.url));
  }

  // 5. Split path segments
  const segments = pathname.split('/'); // ['', 'dashboard', '<sub>', ...]
  const sub = segments[2];

  // 6. Shared routes — any authenticated role can access
  if (SHARED_DASHBOARD_ROUTES.includes(sub)) {
    return NextResponse.next();
  }

  // 7. Role guard for role-specific dashboards
  const allowedSub =
    (role === 'TENANT' && sub === 'tenant') ||
    (role === 'LANDLORD' && sub === 'landlord') ||
    (role === 'ADMIN' && sub === 'admin');

  if (!allowedSub) {
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};