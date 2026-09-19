export type UserRole = 'TENANT' | 'LANDLORD' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  status?: 'ACTIVE' | 'BLOCKED';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  categoryId: string;
  category?: Category;
  isAvailable?: boolean;
}

export type RentalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED';

export interface RentalRequest {
  id: string;
  propertyId: string;
  property: Property;
  tenantId: string;
  tenant?: User;
  moveInDate: string;
  duration: number;
  notes?: string;
  status: RentalStatus;
  totalAmount?: number;
  createdAt?: string;
}

export interface Review {
  id: string;
  propertyId: string;
  rating: number;
  comment: string;
  createdAt?: string;
}