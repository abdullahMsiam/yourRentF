import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YourRent | Rental Property Marketplace',
  description:
    'Find your perfect rental home easily. Browse verified listings, connect with landlords, and pay securely.',
  icons: { icon: '/icon.png' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors`}
      >
        <ThemeProvider
         attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
        </ThemeProvider>
        
      </body>
    </html>
  );
}
