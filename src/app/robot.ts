import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/login', '/register'], // ড্যাশবোর্ড বা লগইন পেজ ইনডেক্স হবে না
    },
    sitemap: 'https://your-rent.vercel.app//sitemap.xml',
  };
}
