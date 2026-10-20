import { fetchData } from '@/lib/api';
import type { User, UserStatus } from './types';

export const adminService = {
  async listUsers(): Promise<User[]> {
    return fetchData<User[]>('/admin/users');
  },

  // ⚠️ Backend returns full user (incl. password hash) — we only trust safe fields
  async setStatus(userId: string, status: UserStatus): Promise<User> {
    return fetchData<User>(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
