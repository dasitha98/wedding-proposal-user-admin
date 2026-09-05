'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import { useAuth } from '../../../auth/presentation/hooks/useAuth';
import { useGetMyProfileQuery } from '../../data/api/profileApi';
import { isProfileCreated } from '../../domain/entities/Profile';
import { CreateProfilePromptModal } from '../components/CreateProfilePromptModal';

interface ProfileGateContextValue {
  hasProfile: boolean;
  requireProfile: (action: () => void) => void;
}

const ProfileGateContext = createContext<ProfileGateContextValue | null>(null);

/**
 * Signed-in members without a completed profile can scroll and page through Discover but
 * nothing else — every other interaction is gated behind a prompt to finish their own
 * profile first. Guests are unaffected here; AuthGateContext handles them separately.
 */
export function ProfileGateProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { data: profile } = useGetMyProfileQuery(undefined, { skip: !isSignedIn });
  // While signed in and still loading, don't block yet — avoids a flash of the prompt before data arrives.
  const hasProfile = !isSignedIn || !profile || isProfileCreated(profile);
  const [isPromptOpen, setPromptOpen] = useState(false);

  const requireProfile = useCallback(
    (action: () => void) => {
      if (!hasProfile) {
        setPromptOpen(true);
        return;
      }
      action();
    },
    [hasProfile]
  );

  return (
    <ProfileGateContext.Provider value={{ hasProfile, requireProfile }}>
      {children}
      <CreateProfilePromptModal
        open={isPromptOpen}
        onClose={() => setPromptOpen(false)}
        onCreateProfile={() => {
          setPromptOpen(false);
          router.push('/profile/edit');
        }}
      />
    </ProfileGateContext.Provider>
  );
}

export function useProfileGate() {
  const ctx = useContext(ProfileGateContext);
  if (!ctx) throw new Error('useProfileGate must be used within a ProfileGateProvider');
  return ctx;
}
