// ============= Shared backend envelope =============
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
  errorDetails?: unknown;
}


export type PublicRole = Extract<UserRole, 'TENANT' | 'LANDLORD'>;


// ============= User =============
export type UserRole = 'TENANT' | 'LANDLORD' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BLOCKED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  phoneNumber?: string;
  avatar?: string | null;
  createdAt?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: Pick<User, 'id' | 'name' | 'email' | 'role'>;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: PublicRole;
  phoneNumber?: string;
}

// Register response — user object without accessToken
export type RegisterResponse = User;

// ============= Category =============
export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
}

// ============= Property =============
export interface LandlordSummary {
  name: string;
  email: string;
  phoneNumber?: string;
}

export interface Review {
  id: string;
  tenantId?: string;
  propertyId?: string;
  rating: number;
  comment?: string;
  createdAt?: string;
}

// Base — present in both list & detail
export interface PropertyBase {
  id: string;
  title: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  isAvailable: boolean;
  images: string[];
  categoryId: string;
  landlordId: string;
}

// List item shape
export interface PropertyListItem extends PropertyBase {
  category: Category;
  landlord: LandlordSummary;
}

// Detail shape
export interface PropertyDetail extends PropertyBase {
  description: string;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
  category: Category;
  landlord: LandlordSummary;
  reviews: Review[];
}

// Landlord's own property (GET /properties/landlord)
export interface LandlordProperty extends PropertyBase {
  description: string;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export type Property = PropertyListItem;

export interface PropertyFilters {
  city?: string;
  categoryId?: string;
  type?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  page?: number;
  limit?: number;
}

export interface CreatePropertyPayload {
  title: string;
  description: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  categoryId: string;
  isAvailable?: boolean;
  amenities?: string[];
  images?: string[];
}

// PUT returns { count: number }
export interface UpdateCountResponse {
  count: number;
}

// ============= Rental =============
export type RentalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export interface RentalRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  status: RentalStatus;
  moveInDate: string;
  duration: number;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Included in GET /rentals:
  property?: PropertyDetail;
  tenant?: Pick<User, 'name' | 'email'>;
}

export interface CreateRentalPayload {
  propertyId: string;
  moveInDate: string;
  duration: number;
  notes?: string;
}

// ============= Payment =============
export interface PaymentRecord {
  id: string;
  tenantId: string;
  rentalRequestId: string;
  amount: number;
  transactionId: string;
  provider: 'STRIPE';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  paidAt?: string;
  createdAt: string;
}

export interface CreatePaymentResponse {
  paymentUrl: string;
}

// ============= Review =============
export interface CreateReviewPayload {
  propertyId: string;
  rating: number;
  comment?: string;
}