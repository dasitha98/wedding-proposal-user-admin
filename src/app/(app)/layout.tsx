'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { AuthGateProvider } from '../../features/auth/presentation/context/AuthGateContext';
import { useAuth } from '../../features/auth/presentation/hooks/useAuth';
import { useGetMyProfileQuery } from '../../features/profile/data/api/profileApi';
import { isProfileCreated } from '../../features/profile/domain/entities/Profile';
import { ProfileGateProvider } from '../../features/profile/presentation/context/ProfileGateContext';
import { AppShell } from '../../shared/components/AppShell';
import { FullPageSpinner } from '../../shared/components/Spinner';

// Guests, and signed-in members without a completed profile, can browse Discover (the
// landing page) and open individual profiles; every other section under here still
// requires that access, which prompts instead (sign-in, or completing the profile).
const GUEST_ACCESSIBLE_PATHS = ['/', '/profiles'];
// Signed-in members without a completed profile can additionally reach the profile editor
// itself — that's where the "Create profile" prompt sends them.
const PROFILE_INCOMPLETE_ACCESSIBLE_PATHS = [...GUEST_ACCESSIBLE_PATHS, '/profile/edit'];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { isSignedIn, isChecking } = useAuth();
  const { data: profile } = useGetMyProfileQuery(undefined, { skip: !isSignedIn });
  const hasProfile = !isSignedIn || !profile || isProfileCreated(profile);
  const router = useRouter();
  const pathname = usePathname();
  const isGuestAccessible = GUEST_ACCESSIBLE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  const isProfileIncompleteAccessible = PROFILE_INCOMPLETE_ACCESSIBLE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  useEffect(() => {
    if (isChecking || isGuestAccessible) return;
    if (!isSignedIn) router.replace('/sign-in');
    else if (!hasProfile && !isProfileIncompleteAccessible) router.replace('/');
  }, [isChecking, isSignedIn, hasProfile, isGuestAccessible, isProfileIncompleteAccessible, router]);

  if (
    isChecking ||
    (!isSignedIn && !isGuestAccessible) ||
    (isSignedIn && !hasProfile && !isGuestAccessible && !isProfileIncompleteAccessible)
  )
    return <FullPageSpinner />;

  return (
    <AuthGateProvider>
      <ProfileGateProvider>
        <AppShell>{children}</AppShell>
      </ProfileGateProvider>
    </AuthGateProvider>
  );
}
