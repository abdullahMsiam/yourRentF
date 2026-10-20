import { fetchData } from '@/lib/api';
import type { Category } from './types';

export interface CreateCategoryPayload {
  name: string;
  slug: string;
}

export const categoryService = {
  async list(): Promise<Category[]> {
    return fetchData<Category[]>('/categories');
  },

  // ADMIN only
  async create(payload: CreateCategoryPayload): Promise<Category> {
    return fetchData<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
