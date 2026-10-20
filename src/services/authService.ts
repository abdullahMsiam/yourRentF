import { fetchData } from '@/lib/api';
import type {
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  User,
} from './types';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return fetchData<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /** Returns the created user — no accessToken (user must log in afterward) */
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    return fetchData<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async me(): Promise<User> {
    return fetchData<User>('/auth/me');
  },
};