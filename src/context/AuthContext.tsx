'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { getDecodedToken } from '@/lib/auth';
import type { User, UserRole } from '@/services/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;      // kept for backward compat
  isLoading: boolean;    // alias
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const COOKIE_OPTS = { path: '/', expires: 7 } as const;

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
      let nextUser: User | null = null;

      if (savedUser) {
        try {
          nextUser = JSON.parse(savedUser) as User;
        } catch {
          nextUser = null;
        }
      }

      if (!nextUser) {
        const decoded = getDecodedToken(savedToken);
        if (decoded) {
          nextUser = {
            id: decoded.id,
            email: decoded.email,
            name: '',
            role: decoded.role as UserRole,
          };
        }
      }

      setUser(nextUser);
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

    Cookies.set('accessToken', cleanToken, COOKIE_OPTS);
    Cookies.set('userRole', newUser.role, COOKIE_OPTS);
    Cookies.set('userData', JSON.stringify(newUser), COOKIE_OPTS);

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
        isLoading: loading,
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