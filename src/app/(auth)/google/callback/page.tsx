'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

import { useAppDispatch } from '../../../../core/store/hooks';
import { toAuthSession, useGoogleAuthCallbackMutation } from '../../../../features/auth/data/api/authApi';
import { getPostSignInPath } from '../../../../features/auth/domain/entities/AuthUser';
import { AuthShell } from '../../../../features/auth/presentation/components/AuthShell';
import { consumeStoredGoogleState } from '../../../../features/auth/presentation/hooks/useGoogleSignIn';
import { sessionEstablished } from '../../../../features/auth/presentation/state/authSlice';
import { Button, Spinner } from '../../../../shared/components';

function GoogleCallbackContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [googleAuthCallback] = useGoogleAuthCallbackMutation();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    // Deferred to a microtask so state updates below happen outside the effect body itself.
    Promise.resolve().then(async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const googleError = searchParams.get('error');
      const expectedState = consumeStoredGoogleState();

      if (googleError) {
        setError('Google sign-in was cancelled.');
        return;
      }
      if (!code || !state || !expectedState || state !== expectedState) {
        setError('This sign-in link is invalid or has expired. Please try again.');
        return;
      }

      try {
        const response = await googleAuthCallback({ code, state }).unwrap();
        dispatch(sessionEstablished(toAuthSession(response)));
        router.push(getPostSignInPath(response.user));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'We could not complete Google sign-in. Please try again.');
      }
    });
  }, [dispatch, googleAuthCallback, router, searchParams]);

  return (
    <AuthShell>
      {error ? (
        <>
          <h2 className="font-display text-3xl font-semibold text-ink">Sign-in failed</h2>
          <p className="mt-2 text-sm text-ink-muted">{error}</p>
          <Link href="/sign-in" className="mt-8 block">
            <Button fullWidth size="lg">
              Back to sign in
            </Button>
          </Link>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <Spinner />
          <p className="text-sm text-ink-muted">Completing sign-in with Google…</p>
        </div>
      )}
    </AuthShell>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense>
      <GoogleCallbackContent />
    </Suspense>
  );
}
