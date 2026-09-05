import { createApi } from '@reduxjs/toolkit/query/react';

import { assertApiSuccess, baseQueryWithReauth, transformApiError, unwrapApiResponse, type ApiResponse } from '../../../../core/api/apiClient';
import type { AuthSession } from '../../domain/entities/AuthTokens';
import type { AuthUser } from '../../domain/entities/AuthUser';

export interface BackendAuthResponse {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  user: AuthUser;
}

export function toAuthSession(response: BackendAuthResponse): AuthSession {
  return {
    user: response.user,
    tokens: { accessToken: response.accessToken, refreshToken: response.refreshToken },
  };
}

export interface BackendRegisterResponse {
  email: string;
  otpExpiresInSeconds: number;
  resendAvailableInSeconds: number;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation<
      BackendRegisterResponse,
      { firstName: string; lastName: string; email: string; password: string }
    >({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      transformResponse: unwrapApiResponse<BackendRegisterResponse>,
      transformErrorResponse: transformApiError,
    }),

    verifyRegistrationOtp: builder.mutation<BackendAuthResponse, { email: string; code: string }>({
      query: (body) => ({ url: '/auth/register/verify', method: 'POST', body }),
      transformResponse: unwrapApiResponse<BackendAuthResponse>,
      transformErrorResponse: transformApiError,
    }),

    resendRegistrationOtp: builder.mutation<BackendRegisterResponse, { email: string }>({
      query: (body) => ({ url: '/auth/register/resend', method: 'POST', body }),
      transformResponse: unwrapApiResponse<BackendRegisterResponse>,
      transformErrorResponse: transformApiError,
    }),

    login: builder.mutation<BackendAuthResponse, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      transformResponse: unwrapApiResponse<BackendAuthResponse>,
      transformErrorResponse: transformApiError,
    }),

    revoke: builder.mutation<void, { refreshToken: string }>({
      query: (body) => ({ url: '/auth/revoke', method: 'POST', body }),
      transformResponse: (response: ApiResponse<undefined>) => assertApiSuccess(response, 'Failed to sign out.'),
      transformErrorResponse: transformApiError,
    }),

    requestPasswordResetOtp: builder.mutation<
      { otpExpiresInSeconds: number; resendAvailableInSeconds: number },
      { email: string }
    >({
      query: (body) => ({ url: '/auth/password-reset/request', method: 'POST', body }),
      transformResponse: unwrapApiResponse<{ otpExpiresInSeconds: number; resendAvailableInSeconds: number }>,
      transformErrorResponse: transformApiError,
    }),

    verifyPasswordResetOtp: builder.mutation<{ resetToken: string }, { email: string; code: string }>({
      query: (body) => ({ url: '/auth/password-reset/verify', method: 'POST', body }),
      transformResponse: unwrapApiResponse<{ resetToken: string }>,
      transformErrorResponse: transformApiError,
    }),

    resetPassword: builder.mutation<void, { resetToken: string; newPassword: string }>({
      query: (body) => ({ url: '/auth/password-reset/confirm', method: 'POST', body }),
      transformResponse: (response: ApiResponse<undefined>) => assertApiSuccess(response, 'Failed to reset password.'),
      transformErrorResponse: transformApiError,
    }),

    changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      query: (body) => ({ url: '/auth/change-password', method: 'POST', body }),
      transformResponse: (response: ApiResponse<undefined>) => assertApiSuccess(response, 'Failed to change password.'),
      transformErrorResponse: transformApiError,
    }),

    updateAccount: builder.mutation<AuthUser, { firstName: string; lastName: string; email: string }>({
      query: (body) => ({ url: '/auth/account', method: 'PUT', body }),
      transformResponse: unwrapApiResponse<AuthUser>,
      transformErrorResponse: transformApiError,
    }),

    googleAuthStart: builder.mutation<{ authorizationUrl: string; state: string }, { redirectUri: string }>({
      query: (body) => ({ url: '/auth/google/start', method: 'POST', body }),
      transformResponse: unwrapApiResponse<{ authorizationUrl: string; state: string }>,
      transformErrorResponse: transformApiError,
    }),

    googleAuthCallback: builder.mutation<BackendAuthResponse, { code: string; state: string }>({
      query: (body) => ({ url: '/auth/google/callback', method: 'POST', body }),
      transformResponse: unwrapApiResponse<BackendAuthResponse>,
      transformErrorResponse: transformApiError,
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyRegistrationOtpMutation,
  useResendRegistrationOtpMutation,
  useLoginMutation,
  useRevokeMutation,
  useRequestPasswordResetOtpMutation,
  useVerifyPasswordResetOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateAccountMutation,
  useGoogleAuthStartMutation,
  useGoogleAuthCallbackMutation,
} = authApi;
