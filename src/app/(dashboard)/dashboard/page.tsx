'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes/paths';

export default function DashboardIndexPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(ROUTES.login);
      return;
    }
    if (user.role === 'admin' || user.role === 'ops') {
      router.replace('/dashboard/admin');
    } else if (user.role === 'astrologer') {
      router.replace('/dashboard/astrologer');
    } else {
      router.replace(ROUTES.home);
    }
  }, [user, isLoading, router]);

  return (
    <div className="dashboard-loading" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Redirecting…
    </div>
  );
}
