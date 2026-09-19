'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { getDecodedToken } from '@/lib/auth';

interface User {
  id?: string;
  email?: string;
  role?: 'TENANT' | 'LANDLORD' | 'ADMIN';
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const syncAuth = () => {
    const savedToken = Cookies.get('accessToken');
    const savedUser = Cookies.get('userData');

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // If userData cookie isn't present, extract payload directly from JWT
          const decoded = getDecodedToken(savedToken);
          if (decoded) {
            setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
          }
        }
      } else {
        const decoded = getDecodedToken(savedToken);
        if (decoded) {
          setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
        }
      }
    } else {
      setToken(null);
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    syncAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    const cleanToken = newToken.replace(/^Bearer\s+/i, '');

    Cookies.set('accessToken', cleanToken, { path: '/', expires: 7 });
    Cookies.set('userRole', newUser.role || '', { path: '/', expires: 7 });
    Cookies.set('userData', JSON.stringify(newUser), { path: '/', expires: 7 });

    setToken(cleanToken);
    setUser(newUser);
  };

  const logout = () => {
    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('userRole', { path: '/' });
    Cookies.remove('userData', { path: '/' });

    setToken(null);
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}