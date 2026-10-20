import { fetchData } from '@/lib/api';
import type { RentalRequest, CreateRentalPayload, RentalStatus } from './types';

export const rentalService = {
  async list(): Promise<RentalRequest[]> {
    return fetchData<RentalRequest[]>('/rentals');
  },

  async create(payload: CreateRentalPayload): Promise<RentalRequest> {
    return fetchData<RentalRequest>('/rentals', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateStatus(
    id: string,
    status: Extract<RentalStatus, 'APPROVED' | 'REJECTED'>
  ): Promise<RentalRequest> {
    return fetchData<RentalRequest>(`/rentals/landlord/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};