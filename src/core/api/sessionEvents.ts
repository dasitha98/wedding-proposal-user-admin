import { createAction } from '@reduxjs/toolkit';

import type { AuthTokens } from '../../features/auth/domain/entities/AuthTokens';

/** Fired by baseQueryWithReauth after a successful silent token refresh. */
export const tokensRefreshed = createAction<AuthTokens>('session/tokensRefreshed');

/** Fired by baseQueryWithReauth when a refresh attempt fails (or there's no refresh token). */
export const sessionExpired = createAction('session/sessionExpired');
