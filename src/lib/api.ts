import Cookies from 'js-cookie';
import { isTokenValid } from './auth';

const DEFAULT_API_URL = 'https://your-rent-bk-gamma.vercel.app/api';

const getBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // If env is missing or relative, use production fallback
  if (!envUrl || !envUrl.startsWith('http')) {
    return DEFAULT_API_URL;
  }
  
  return envUrl.replace(/\/+$/, '');
};

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl();

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const url = `${baseUrl}${cleanEndpoint}`;

  const token = Cookies.get('accessToken');

  if (token && !isTokenValid(token)) {
    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('userRole', { path: '/' });
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
    throw new Error('Session expired. Please log in again.');
  }

  // Only send Content-Type when there is a body. A JSON Content-Type on plain GETs
  // forces an extra CORS preflight (OPTIONS) round trip on every request.
  const headers: Record<string, string> = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401 || res.status === 403) {
    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('userRole', { path: '/' });
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'An error occurred while fetching data');
  }

  return res.json();
}