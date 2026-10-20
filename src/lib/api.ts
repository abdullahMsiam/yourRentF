// src/lib/api.ts
import Cookies from 'js-cookie';
import { isTokenValid } from './auth';

const DEFAULT_API_URL = 'https://your-rent-bk-gamma.vercel.app/api';

// Backend response envelope (memorized)
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
  errorDetails?: unknown;
}

// Typed error — preserves statusCode, errorDetails, message
export class ApiError extends Error {
  statusCode: number;
  errorDetails: unknown;
  constructor(message: string, statusCode: number, errorDetails?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
  }
}

const getBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl || !envUrl.startsWith('http')) return DEFAULT_API_URL;
  return envUrl.replace(/\/+$/, '');
};

const clearSessionAndRedirect = () => {
  Cookies.remove('accessToken', { path: '/' });
  Cookies.remove('userRole', { path: '/' });
  if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
};

// Low-level: returns the raw envelope. Preserves existing callers.
export async function fetchApi<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const token = Cookies.get('accessToken');

  if (token && !isTokenValid(token)) {
    clearSessionAndRedirect();
    throw new ApiError('Session expired. Please log in again.', 401);
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (err) {
    // Preserve AbortError so callers can detect cancel
    if ((err as Error)?.name === 'AbortError') throw err;
    throw new ApiError('Network error. Please check your connection.', 0);
  }

  // 401/403 → clear + throw (do NOT silently fall through)
  if (res.status === 401 || res.status === 403) {
    clearSessionAndRedirect();
    throw new ApiError('Session expired. Please log in again.', res.status);
  }

  // No content
  if (res.status === 204) {
    return undefined as T;
  }

  // Try parse JSON once
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const message =
      (body && typeof body.message === 'string' && body.message) ||
      `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, body?.errorDetails ?? null);
  }

  return body as T;
}

// High-level: unwraps `data` from the envelope. Use for NEW callers.
export async function fetchData<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const envelope = await fetchApi<ApiEnvelope<T>>(endpoint, options);
  // If backend returns a bare array/object (legacy), pass through
  if (envelope && typeof envelope === 'object' && 'success' in envelope) {
    if (!envelope.success) {
      throw new ApiError(envelope.message || 'Request failed', 200, envelope.errorDetails);
    }
    return envelope.data as T;
  }
  return envelope as unknown as T;
}