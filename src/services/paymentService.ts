import { fetchData } from '@/lib/api';
import type { CreatePaymentResponse, PaymentRecord } from './types';

export const paymentService = {
  // ⚠️ Backend expects `rentalRequestId` (not rentalId)
  async create(rentalRequestId: string): Promise<CreatePaymentResponse> {
    return fetchData<CreatePaymentResponse>('/payments/create', {
      method: 'POST',
      body: JSON.stringify({ rentalRequestId }),
    });
  },

  // POST preferred (session ID not leaked in URL/history)
  async confirm(sessionId: string): Promise<PaymentRecord> {
    return fetchData<PaymentRecord>('/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  },
};