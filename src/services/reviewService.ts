import { fetchData } from '@/lib/api';
import type { Review } from './types';

export interface CreateReviewPayload {
  propertyId: string;
  rating: number;
  comment?: string;
}

export const reviewService = {
  async create(payload: CreateReviewPayload): Promise<Review> {
    return fetchData<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
