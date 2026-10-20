import { fetchData } from '@/lib/api';
import type {
  PropertyListItem,
  PropertyDetail,
  LandlordProperty,
  PropertyFilters,
  CreatePropertyPayload,
  UpdateCountResponse,
} from './types';

const buildQuery = (filters: PropertyFilters = {}): string => {
  const q = new URLSearchParams();
  if (filters.city) q.append('city', filters.city);
  if (filters.categoryId) q.append('categoryId', filters.categoryId);
  if (filters.type) q.append('type', filters.type);
  if (filters.minPrice !== undefined && filters.minPrice !== '')
    q.append('minPrice', String(filters.minPrice));
  if (filters.maxPrice !== undefined && filters.maxPrice !== '')
    q.append('maxPrice', String(filters.maxPrice));
  if (filters.page) q.append('page', String(filters.page));
  if (filters.limit) q.append('limit', String(filters.limit));
  const s = q.toString();
  return s ? `?${s}` : '';
};

export const propertyService = {
  async list(filters: PropertyFilters = {}): Promise<PropertyListItem[]> {
    return fetchData<PropertyListItem[]>(`/properties${buildQuery(filters)}`);
  },

  // Returns null if property not found (backend returns 200 + data: null)
  async getById(id: string): Promise<PropertyDetail | null> {
    return fetchData<PropertyDetail | null>(`/properties/${id}`);
  },

  // Landlord's own properties
  async listMine(): Promise<LandlordProperty[]> {
    return fetchData<LandlordProperty[]>('/properties/landlord');
  },

  async create(payload: CreatePropertyPayload): Promise<PropertyDetail> {
    return fetchData<PropertyDetail>('/properties/landlord', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(
    id: string,
    payload: Partial<CreatePropertyPayload>
  ): Promise<UpdateCountResponse> {
    return fetchData<UpdateCountResponse>(`/properties/landlord/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async remove(id: string): Promise<null> {
    return fetchData<null>(`/properties/landlord/${id}`, { method: 'DELETE' });
  },
};