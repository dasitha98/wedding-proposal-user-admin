'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import { AuthPromptModal } from '../components/AuthPromptModal';
import { useAuth } from '../hooks/useAuth';

interface AuthGateContextValue {
  isGuest: boolean;
  requireAuth: (action: () => void) => void;
}

const AuthGateContext = createContext<AuthGateContextValue | null>(null);

/**
 * Lets guests browse Discover freely, but gates anything that needs an account
 * (opening a profile, filters, other nav sections) behind the sign-in prompt.
 */
export function AuthGateProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const isGuest = !isSignedIn;
  const [isPromptOpen, setPromptOpen] = useState(false);

  const requireAuth = useCallback(
    (action: () => void) => {
      if (isGuest) {
        setPromptOpen(true);
        return;
      }
      action();
    },
    [isGuest]
  );

  return (
    <AuthGateContext.Provider value={{ isGuest, requireAuth }}>
      {children}
      <AuthPromptModal
        open={isPromptOpen}
        onClose={() => setPromptOpen(false)}
        onSignIn={() => {
          setPromptOpen(false);
          router.push('/sign-in');
        }}
        onSignUp={() => {
          setPromptOpen(false);
          router.push('/sign-up');
        }}
      />
    </AuthGateContext.Provider>
  );
}

export function useAuthGate() {
  const ctx = useContext(AuthGateContext);
  if (!ctx) throw new Error('useAuthGate must be used within an AuthGateProvider');
  return ctx;
}
