'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { getPostSignInPath } from '../../features/auth/domain/entities/AuthUser';
import { useAuth } from '../../features/auth/presentation/hooks/useAuth';
import { FullPageSpinner } from '../../shared/components/Spinner';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { isSignedIn, isChecking, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) router.replace(getPostSignInPath(user));
  }, [isSignedIn, user, router]);

  if (isChecking || isSignedIn) return <FullPageSpinner />;

  return <>{children}</>;
}
