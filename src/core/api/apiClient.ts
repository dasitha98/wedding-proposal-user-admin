import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import { tokenStorage } from '../storage/tokenStorage';
import { sessionExpired, tokensRefreshed } from './sessionEvents';
import type { RootState } from '../store/store';

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5056/api';
}

/** Origin only (no /api suffix) — uploaded media (profile photos) is served as static files. */
function getApiOrigin(): string {
  return getApiBaseUrl().replace(/\/api\/?$/, '');
}

export function resolveMediaUrl(uri: string): string {
  if (/^(https?:|data:|blob:)/i.test(uri)) return uri;
  return `${getApiOrigin()}${uri.startsWith('/') ? '' : '/'}${uri}`;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
}

/** Thrown by transformErrorResponse below so every failed call surfaces a real Error (existing
 * `catch (err) { err instanceof Error ? err.message : ... }` call sites keep working unchanged)
 * while still exposing the backend's errorCode for callers that need to branch on it (e.g.
 * EMAIL_NOT_VERIFIED redirecting to the OTP screen instead of just showing text). */
export class ApiRequestError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
  }
}

/** transformResponse for a successful (2xx) call — unwraps the backend's envelope. */
export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data === undefined) {
    throw new Error(response.error ?? 'Request failed.');
  }
  return response.data;
}

/** transformResponse for a void-returning endpoint — throws on failure, otherwise resolves. */
export function assertApiSuccess(response: ApiResponse<undefined>, fallbackMessage: string): void {
  if (!response.success) throw new Error(response.error ?? fallbackMessage);
}

/** transformErrorResponse for a failed (non-2xx) call — RTK Query only runs transformResponse
 * on success, so without this every failed call would reject with the raw FetchBaseQueryError
 * instead of the backend's actual message/errorCode. */
export function transformApiError(error: FetchBaseQueryError): ApiRequestError {
  const body = error.data as ApiResponse<unknown> | undefined;
  return new ApiRequestError(body?.error ?? 'Something went wrong. Please try again.', body?.errorCode);
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.tokens?.accessToken;
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

/**
 * Wraps every authenticated request with silent-refresh-on-401. `/auth/*` requests are
 * excluded from the retry (they're either public — login/register/refresh itself — or a
 * 401 there isn't recoverable by refreshing) to avoid a refresh loop.
 */
export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const url = typeof args === 'string' ? args : args.url;
  if (result.error?.status === 401 && !url.startsWith('/auth/')) {
    const refreshToken = (api.getState() as RootState).auth.tokens?.refreshToken;

    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        { url: '/auth/refresh', method: 'POST', body: { refreshToken } },
        api,
        extraOptions
      );
      const refreshBody = refreshResult.data as ApiResponse<{ accessToken: string; refreshToken: string }> | undefined;

      if (refreshBody?.success && refreshBody.data) {
        const tokens = { accessToken: refreshBody.data.accessToken, refreshToken: refreshBody.data.refreshToken };
        api.dispatch(tokensRefreshed(tokens));
        tokenStorage.saveTokens(tokens);
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(sessionExpired());
        tokenStorage.clear();
      }
    } else {
      api.dispatch(sessionExpired());
    }
  }

  return result;
};
