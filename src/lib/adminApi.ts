import { fetchApi } from './api';

export interface UserItem {
  id: string;
  name?: string;
  email: string;
  role: 'TENANT' | 'LANDLORD' | 'ADMIN';
  status: 'ACTIVE' | 'BLOCKED'; // Matches Prisma schema
  createdAt?: string;
}

/**
 * Fetch all users with safe data normalization
 */
export async function getAllUsers(): Promise<UserItem[]> {
  const response = await fetchApi<any>('/admin/users');

  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  if (response && Array.isArray(response.users)) return response.users;

  return [];
}


export async function updateUserStatus(userId: string, status: 'ACTIVE' | 'BLOCKED') {
  return await fetchApi(`/admin/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}