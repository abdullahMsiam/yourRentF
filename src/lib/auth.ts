import { jwtDecode } from 'jwt-decode';

export interface CustomJwtPayload {
  id: string;
  email: string;
  role: 'TENANT' | 'LANDLORD' | 'ADMIN';
  exp: number;
  iat?: number;
}

export function getDecodedToken(token: string | null): CustomJwtPayload | null {
  if (!token) return null;
  try {
    return jwtDecode<CustomJwtPayload>(token);
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
}


export function isTokenValid(token: string | null): boolean {
  const decoded = getDecodedToken(token);
  if (!decoded || !decoded.exp) return false;

  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  return decoded.exp > currentTimeInSeconds;
}

export function getUserRoleFromToken(token: string | null): string | null {
  const decoded = getDecodedToken(token);
  return decoded ? decoded.role : null;
}