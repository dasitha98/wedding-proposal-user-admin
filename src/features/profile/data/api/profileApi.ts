import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth, transformApiError, unwrapApiResponse } from '../../../../core/api/apiClient';
import { resolveMediaUrl } from '../../../../core/api/apiClient';
import { toProfileSummary, type BackendProfileSummary, type ProfileSummary } from '../../../../shared/types/ProfileSummary';
import type { ConnectionRequest, ConnectionRequestStatus } from '../../../requests/domain/entities/ConnectionRequest';
import type { Profile, ProfilePhoto, UpdateProfileInput } from '../../domain/entities/Profile';

interface BackendProfile extends Omit<Profile, 'photos'> {
  photos: ProfilePhoto[];
}

interface ConnectionRequestResponse {
  requestId: string;
  otherParty: BackendProfileSummary;
  status: string;
  createdAt: string;
}

function toConnectionRequest(response: ConnectionRequestResponse): ConnectionRequest {
  return {
    id: response.requestId,
    profile: toProfileSummary(response.otherParty),
    status: response.status as ConnectionRequestStatus,
    createdAt: response.createdAt,
  };
}

function toProfile(response: BackendProfile): Profile {
  return {
    ...response,
    photos: response.photos.map((p) => ({ ...p, uri: resolveMediaUrl(p.uri) })),
  };
}

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['MyProfile', 'Profile', 'Favourites', 'SentRequests', 'ReceivedRequests'],
  endpoints: (builder) => ({
    getMyProfile: builder.query<Profile, void>({
      query: () => '/profiles/me',
      transformResponse: (response: { success: boolean; data?: BackendProfile; error?: string }) =>
        toProfile(unwrapApiResponse(response)),
      providesTags: ['MyProfile'],
    }),

    getProfile: builder.query<Profile, string>({
      query: (id) => `/profiles/${id}`,
      transformResponse: (response: { success: boolean; data?: BackendProfile; error?: string }) =>
        toProfile(unwrapApiResponse(response)),
      providesTags: (_result, _error, id) => [{ type: 'Profile', id }],
    }),

    updateMyProfile: builder.mutation<Profile, UpdateProfileInput>({
      query: (body) => ({ url: '/profiles/me', method: 'PUT', body }),
      transformResponse: (response: { success: boolean; data?: BackendProfile; error?: string }) =>
        toProfile(unwrapApiResponse(response)),
      invalidatesTags: ['MyProfile'],
    }),

    uploadPhoto: builder.mutation<{ uri: string }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return { url: '/profiles/me/photos', method: 'POST', body: formData };
      },
      transformResponse: (response: { success: boolean; data?: { uri: string }; error?: string }) => {
        const result = unwrapApiResponse(response);
        return { uri: resolveMediaUrl(result.uri) };
      },
      transformErrorResponse: transformApiError,
    }),

    sendRequest: builder.mutation<Profile, string>({
      query: (id) => ({ url: `/profiles/${id}/requests`, method: 'POST' }),
      transformResponse: (response: { success: boolean; data?: BackendProfile; error?: string }) =>
        toProfile(unwrapApiResponse(response)),
      invalidatesTags: (_result, _error, id) => [{ type: 'Profile', id }, 'SentRequests'],
    }),

    cancelRequest: builder.mutation<Profile, string>({
      query: (id) => ({ url: `/profiles/${id}/requests`, method: 'DELETE' }),
      transformResponse: (response: { success: boolean; data?: BackendProfile; error?: string }) =>
        toProfile(unwrapApiResponse(response)),
      invalidatesTags: (_result, _error, id) => [{ type: 'Profile', id }, 'SentRequests'],
    }),

    toggleFavourite: builder.mutation<Profile, string>({
      query: (id) => ({ url: `/profiles/${id}/favourite`, method: 'POST' }),
      transformResponse: (response: { success: boolean; data?: BackendProfile; error?: string }) =>
        toProfile(unwrapApiResponse(response)),
      invalidatesTags: (_result, _error, id) => [{ type: 'Profile', id }, 'Favourites'],
    }),

    getFavourites: builder.query<ProfileSummary[], void>({
      query: () => '/profiles/favourites',
      transformResponse: (response: { success: boolean; data?: BackendProfileSummary[]; error?: string }) =>
        unwrapApiResponse(response).map(toProfileSummary),
      providesTags: ['Favourites'],
    }),

    getSentRequests: builder.query<ConnectionRequest[], void>({
      query: () => '/profiles/requests/sent',
      transformResponse: (response: { success: boolean; data?: ConnectionRequestResponse[]; error?: string }) =>
        unwrapApiResponse(response).map(toConnectionRequest),
      providesTags: ['SentRequests'],
    }),

    getReceivedRequests: builder.query<ConnectionRequest[], void>({
      query: () => '/profiles/requests/received',
      transformResponse: (response: { success: boolean; data?: ConnectionRequestResponse[]; error?: string }) =>
        unwrapApiResponse(response).map(toConnectionRequest),
      providesTags: ['ReceivedRequests'],
    }),

    acceptRequest: builder.mutation<ConnectionRequest, string>({
      query: (requestId) => ({ url: `/profiles/requests/${requestId}/accept`, method: 'POST' }),
      transformResponse: (response: { success: boolean; data?: ConnectionRequestResponse; error?: string }) =>
        toConnectionRequest(unwrapApiResponse(response)),
      invalidatesTags: ['ReceivedRequests', 'SentRequests'],
    }),

    declineRequest: builder.mutation<ConnectionRequest, string>({
      query: (requestId) => ({ url: `/profiles/requests/${requestId}/decline`, method: 'POST' }),
      transformResponse: (response: { success: boolean; data?: ConnectionRequestResponse; error?: string }) =>
        toConnectionRequest(unwrapApiResponse(response)),
      invalidatesTags: ['ReceivedRequests', 'SentRequests'],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useGetProfileQuery,
  useUpdateMyProfileMutation,
  useUploadPhotoMutation,
  useSendRequestMutation,
  useCancelRequestMutation,
  useToggleFavouriteMutation,
  useGetFavouritesQuery,
  useGetSentRequestsQuery,
  useGetReceivedRequestsQuery,
  useAcceptRequestMutation,
  useDeclineRequestMutation,
} = profileApi;
