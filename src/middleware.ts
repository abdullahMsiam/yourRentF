import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id?: string;
  role?: string;
  exp?: number;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // Protect all Dashboard sub-routes
  if (pathname.startsWith('/dashboard')) {
    // 1. Missing Token Check
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // 2. Decode JWT Payload
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);

      // 3. Expiration Check
      if (decoded.exp && decoded.exp < currentTime) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('accessToken');
        response.cookies.delete('userRole');
        return response;
      }

      // 4. Role Guard Validation
      const userRole = decoded.role;

      if (pathname.startsWith('/dashboard/landlord') && userRole !== 'LANDLORD') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      if (pathname.startsWith('/dashboard/admin') && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      if (pathname.startsWith('/dashboard/tenant') && userRole !== 'TENANT') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

    } catch (error) {
      // Malformed or invalid JWT token structure
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('accessToken');
      response.cookies.delete('userRole');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};