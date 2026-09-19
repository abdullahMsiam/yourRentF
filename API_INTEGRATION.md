# YourRent Frontend API Integration Specification

## 1. Authentication

- `POST /api/auth/register` -> `src/app/(auth)/register/page.tsx`
- `POST /api/auth/login` -> `src/app/(auth)/login/page.tsx`
- `GET /api/auth/me` -> `src/lib/auth.ts` / Middleware session checks

## 2. Properties

- `GET /api/properties` -> `src/app/(public)/properties/page.tsx`
- `GET /api/properties/:id` -> `src/app/(public)/properties/[id]/page.tsx`
- `POST /api/properties/landlord` -> `src/app/dashboard/landlord/properties/new/page.tsx`
- `PUT /api/properties/landlord/:id` -> `src/app/dashboard/landlord/properties/[id]/edit/page.tsx`
- `DELETE /api/properties/landlord/:id` -> Landlord Property Table Action

## 3. Rental Requests

- `POST /api/rentals` -> Property Details Modal (`/properties/[id]`)
- `GET /api/rentals` -> Tenant & Landlord Dashboards (`/dashboard/tenant`, `/dashboard/landlord`)
- `PATCH /api/rentals/landlord/:id` -> Landlord Approval Action

## 4. Payments

- `POST /api/payments/create` -> Triggered by "Pay Now" CTA on Tenant Dashboard
- `POST /api/payments/confirm` -> Triggered automatically on `/payment/success`

## 5. User Management & Admin Moderation

- `GET /api/admin/users` -> Admin Moderation Table (`/dashboard/admin`)
- `PATCH /api/admin/users/:id` -> Ban/Unban Toggle Action

- ther are some missing
