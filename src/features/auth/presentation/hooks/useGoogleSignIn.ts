import { useState } from 'react';

import { useGoogleAuthStartMutation } from '../../data/api/authApi';

const STATE_STORAGE_KEY = 'google_oauth_state';

/** Where Google redirects back to once the user has authenticated. Must match one of the
 * backend's `Google:AllowedRedirectUris` entries exactly. */
function getGoogleRedirectUri(): string {
  return `${window.location.origin}/google/callback`;
}

export function useGoogleSignIn() {
  const [start, { isLoading }] = useGoogleAuthStartMutation();
  const [error, setError] = useState<string | null>(null);

  const startGoogleSignIn = async () => {
    setError(null);
    try {
      const { authorizationUrl, state } = await start({ redirectUri: getGoogleRedirectUri() }).unwrap();
      sessionStorage.setItem(STATE_STORAGE_KEY, state);
      window.location.href = authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not start Google sign-in. Please try again.');
    }
  };

  return { startGoogleSignIn, isLoading, error };
}

export function consumeStoredGoogleState(): string | null {
  const state = sessionStorage.getItem(STATE_STORAGE_KEY);
  sessionStorage.removeItem(STATE_STORAGE_KEY);
  return state;
}
