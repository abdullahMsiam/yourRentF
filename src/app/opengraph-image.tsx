import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'YourRent - Rental Property Marketplace';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a', // slate-900
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <span style={{ backgroundColor: '#4f46e5', color: 'white', padding: '12px 18px', borderRadius: '12px', fontSize: '48px', fontWeight: 'bold' }}>
            YR
          </span>
          <span style={{ fontSize: '64px', fontWeight: 'bold' }}>YourRent</span>
        </div>
        <p style={{ fontSize: '36px', color: '#94a3b8' }}>Find your perfect rental home easily.</p>
      </div>
    ),
    { ...size }
  );
}
