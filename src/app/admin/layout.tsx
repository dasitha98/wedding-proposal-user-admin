'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { AdminShell } from '../../features/admin/presentation/components/AdminShell';
import { useAuth } from '../../features/auth/presentation/hooks/useAuth';
import { FullPageSpinner } from '../../shared/components/Spinner';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isSignedIn, isChecking, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isChecking) return;
    if (!isSignedIn || !isAdmin) {
      router.replace('/');
    }
  }, [isChecking, isSignedIn, isAdmin, router]);

  if (isChecking || !isSignedIn || !isAdmin) return <FullPageSpinner />;

  return <AdminShell>{children}</AdminShell>;
}
