'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.role) {
      router.replace('/login');
      return;
    }
    const role = user.role.toLowerCase();
    router.replace(`/dashboard/${role}`);
  }, [user, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-muted-foreground">Redirecting…</p>
    </div>
  );
}