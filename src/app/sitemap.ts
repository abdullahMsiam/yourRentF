import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://your-rent.vercel.app/'; 

  // Static public pages
  const routes = [
    '',
    '/properties',
    '/how-it-works',
    '/about',
    '/contact',
    '/pricing',
    '/careers',
    '/blog',
    '/terms',
    '/privacy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [...routes];
}
