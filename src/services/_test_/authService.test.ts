import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../authService';
import { fetchData } from '@/lib/api';

// fetchData কে মক (mock) করা হচ্ছে
vi.mock('@/lib/api', () => ({
  fetchData: vi.fn(),
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call fetchData with correct login payload', async () => {
    const mockResponse = { accessToken: 'fake-token', user: { id: '1', email: 'test@test.com', name: 'Test', role: 'TENANT' } };
    (fetchData as any).mockResolvedValue(mockResponse);

    const result = await authService.login('test@test.com', 'password123');

    expect(fetchData).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: 'password123' }),
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call fetchData correctly for /me endpoint', async () => {
    (fetchData as any).mockResolvedValue({ id: '1', name: 'Test' });
    await authService.me();
    expect(fetchData).toHaveBeenCalledWith('/auth/me');
  });
});
