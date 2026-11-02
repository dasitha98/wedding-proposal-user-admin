import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth, unwrapApiResponse, type ApiResponse } from '../../../../core/api/apiClient';

export interface AdminPagedResponse<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailConfirmed: boolean;
  isLockedOut: boolean;
  createdAt: string;
  lastActiveAt: string | null;
  roles: string[];
  profileId: string | null;
}

export interface AdminUpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  emailConfirmed?: boolean;
  isLockedOut?: boolean;
  roles?: string[];
}

export interface AdminCreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles?: string[];
}

export interface AdminRole {
  id: string;
  name: string;
}

export interface AdminProfileSummary {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  gender: 'male' | 'female';
  age: number;
  religion: string;
  city: string;
  country: string;
  isGold: boolean;
  photoCount: number;
  createdAt: string;
}

export interface AdminBasicInfo {
  gender: 'male' | 'female';
  race: string;
  religion: string;
  caste: string;
  maritalStatus: string;
  heightLabel: string;
}
export interface AdminEducation {
  qualification: string;
  qualificationStatus: string;
}
export interface AdminProfession {
  jobStatus: string;
  occupation: string;
  incomeRange: string;
}
export interface AdminResidency {
  city: string;
  district: string;
  country: string;
}
export interface AdminFamily {
  fatherOccupation: string | null;
  motherOccupation: string | null;
  siblingCount: number;
}
export interface AdminLifestyle {
  smoking: string;
  alcohol: string;
}
export interface AdminAssets {
  status: string;
}
export interface AdminVerification {
  phoneVerified: boolean;
  emailVerified: boolean;
  identityVerified: boolean;
  photoVerified: boolean;
  professionVerified: boolean;
  educationVerified: boolean;
}
export interface AdminPhoto {
  id: string;
  uri: string;
  isBlurred: boolean;
  order: number;
}
export interface AdminSibling {
  id: string;
  relationship: string;
  maritalStatus: string;
  occupation: string | null;
}

export interface AdminProfileDetail {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  age: number;
  managedBy: 'self' | 'parent' | 'guardian' | null;
  aboutMe: string | null;
  hobbies: string[];
  interests: string[];
  isGold: boolean;
  createdAt: string;
  updatedAt: string;
  basicInfo: AdminBasicInfo;
  education: AdminEducation;
  profession: AdminProfession;
  residency: AdminResidency;
  family: AdminFamily;
  lifestyle: AdminLifestyle;
  assets: AdminAssets;
  verification: AdminVerification;
  photos: AdminPhoto[];
  siblings: AdminSibling[];
}

export interface AdminUpdateProfileInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  managedBy?: 'self' | 'parent' | 'guardian';
  aboutMe?: string;
  hobbies?: string[];
  interests?: string[];
  basicInfo?: Partial<AdminBasicInfo>;
  education?: Partial<AdminEducation>;
  profession?: Partial<AdminProfession>;
  residency?: Partial<AdminResidency>;
  family?: Partial<AdminFamily> & { siblings?: AdminSiblingInput[] };
  lifestyle?: Partial<AdminLifestyle>;
  assets?: Partial<AdminAssets>;
  isGold?: boolean;
  verification?: AdminVerification;
}

export interface AdminSiblingInput {
  relationship: string;
  maritalStatus: string;
  occupation?: string | null;
}

export interface AdminCreateProfileInput {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export type AdminConnectionStatus = 'sent' | 'accepted' | 'declined';

export interface AdminConnectionRequest {
  id: string;
  requesterUserId: string;
  requesterName: string;
  targetUserId: string;
  targetName: string;
  status: AdminConnectionStatus;
  declineCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminFavourite {
  id: string;
  userId: string;
  userName: string;
  targetProfileId: string;
  targetProfileName: string;
  createdAt: string;
}

export interface AdminConversation {
  id: string;
  userAId: string;
  userAName: string;
  userBId: string;
  userBName: string;
  createdAt: string;
  messageCount: number;
}

export interface AdminMessage {
  id: string;
  conversationId: string;
  senderUserId: string;
  senderName: string;
  text: string;
  sentAt: string;
}

export interface AdminRefreshToken {
  id: string;
  userId: string;
  userEmail: string;
  expiresAt: string;
  createdAt: string;
  revokedAt: string | null;
  isActive: boolean;
}

export interface AdminOtp {
  id: string;
  email: string;
  expiresAt: string;
  resendAvailableAt: string;
  attemptsRemaining: number;
  consumedAt: string | null;
  type: 'PasswordReset' | 'EmailVerification';
}

interface ListParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

function listQuery(params: ListParams) {
  const query: Record<string, string> = {};
  if (params.search) query.search = params.search;
  if (params.page) query.page = String(params.page);
  if (params.pageSize) query.pageSize = String(params.pageSize);
  return query;
}

const voidResponse = (response: ApiResponse<undefined>) => {
  if (!response.success) throw new Error(response.error ?? 'Request failed.');
};

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'AdminUser',
    'AdminRole',
    'AdminProfile',
    'AdminConnectionRequest',
    'AdminFavourite',
    'AdminConversation',
    'AdminMessage',
    'AdminRefreshToken',
    'AdminOtp',
  ],
  endpoints: (builder) => ({
    // Users
    adminListUsers: builder.query<AdminPagedResponse<AdminUser>, ListParams>({
      query: (params) => ({ url: '/admin/users', params: listQuery(params) }),
      transformResponse: unwrapApiResponse<AdminPagedResponse<AdminUser>>,
      providesTags: (result) =>
        result
          ? [...result.items.map((u) => ({ type: 'AdminUser' as const, id: u.id })), { type: 'AdminUser', id: 'LIST' }]
          : [{ type: 'AdminUser', id: 'LIST' }],
    }),
    adminGetUser: builder.query<AdminUser, string>({
      query: (id) => ({ url: `/admin/users/${id}` }),
      transformResponse: unwrapApiResponse<AdminUser>,
      providesTags: (_r, _e, id) => [{ type: 'AdminUser', id }],
    }),
    adminCreateUser: builder.mutation<AdminUser, AdminCreateUserInput>({
      query: (body) => ({ url: '/admin/users', method: 'POST', body }),
      transformResponse: unwrapApiResponse<AdminUser>,
      invalidatesTags: [{ type: 'AdminUser', id: 'LIST' }],
    }),
    adminUpdateUser: builder.mutation<AdminUser, { id: string; input: AdminUpdateUserInput }>({
      query: ({ id, input }) => ({ url: `/admin/users/${id}`, method: 'PUT', body: input }),
      transformResponse: unwrapApiResponse<AdminUser>,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'AdminUser', id }, { type: 'AdminUser', id: 'LIST' }],
    }),
    adminDeleteUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/admin/users/${id}`, method: 'DELETE' }),
      transformResponse: voidResponse,
      invalidatesTags: [{ type: 'AdminUser', id: 'LIST' }],
    }),

    // Roles
    adminListRoles: builder.query<AdminRole[], void>({
      query: () => ({ url: '/admin/roles' }),
      transformResponse: unwrapApiResponse<AdminRole[]>,
      providesTags: [{ type: 'AdminRole', id: 'LIST' }],
    }),

    // Profiles
    adminListProfiles: builder.query<AdminPagedResponse<AdminProfileSummary>, ListParams>({
      query: (params) => ({ url: '/admin/profiles', params: listQuery(params) }),
      transformResponse: unwrapApiResponse<AdminPagedResponse<AdminProfileSummary>>,
      providesTags: (result) =>
        result
          ? [...result.items.map((p) => ({ type: 'AdminProfile' as const, id: p.id })), { type: 'AdminProfile', id: 'LIST' }]
          : [{ type: 'AdminProfile', id: 'LIST' }],
    }),
    adminCreateProfile: builder.mutation<AdminProfileDetail, AdminCreateProfileInput>({
      query: (body) => ({ url: '/admin/profiles', method: 'POST', body }),
      transformResponse: unwrapApiResponse<AdminProfileDetail>,
      invalidatesTags: [{ type: 'AdminProfile', id: 'LIST' }, { type: 'AdminUser', id: 'LIST' }],
    }),
    adminGetProfile: builder.query<AdminProfileDetail, string>({
      query: (id) => ({ url: `/admin/profiles/${id}` }),
      transformResponse: unwrapApiResponse<AdminProfileDetail>,
      providesTags: (_r, _e, id) => [{ type: 'AdminProfile', id }],
    }),
    adminUpdateProfile: builder.mutation<AdminProfileDetail, { id: string; input: AdminUpdateProfileInput }>({
      query: ({ id, input }) => ({ url: `/admin/profiles/${id}`, method: 'PUT', body: input }),
      transformResponse: unwrapApiResponse<AdminProfileDetail>,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'AdminProfile', id }, { type: 'AdminProfile', id: 'LIST' }],
    }),
    adminDeleteProfile: builder.mutation<void, string>({
      query: (id) => ({ url: `/admin/profiles/${id}`, method: 'DELETE' }),
      transformResponse: voidResponse,
      invalidatesTags: [{ type: 'AdminProfile', id: 'LIST' }, { type: 'AdminUser', id: 'LIST' }],
    }),
    adminDeleteProfilePhoto: builder.mutation<void, { profileId: string; photoId: string }>({
      query: ({ profileId, photoId }) => ({ url: `/admin/profiles/${profileId}/photos/${photoId}`, method: 'DELETE' }),
      transformResponse: voidResponse,
      invalidatesTags: (_r, _e, { profileId }) => [{ type: 'AdminProfile', id: profileId }],
    }),

    // Connection requests
    adminListConnectionRequests: builder.query<AdminPagedResponse<AdminConnectionRequest>, ListParams>({
      query: (params) => ({ url: '/admin/connection-requests', params: listQuery(params) }),
      transformResponse: unwrapApiResponse<AdminPagedResponse<AdminConnectionRequest>>,
      providesTags: [{ type: 'AdminConnectionRequest', id: 'LIST' }],
    }),
    adminUpdateConnectionRequestStatus: builder.mutation<AdminConnectionRequest, { id: string; status: AdminConnectionStatus }>({
      query: ({ id, status }) => ({ url: `/admin/connection-requests/${id}/status`, method: 'PUT', body: { status } }),
      transformResponse: unwrapApiResponse<AdminConnectionRequest>,
      invalidatesTags: [{ type: 'AdminConnectionRequest', id: 'LIST' }],
    }),
    adminDeleteConnectionRequest: builder.mutation<void, string>({
      query: (id) => ({ url: `/admin/connection-requests/${id}`, method: 'DELETE' }),
      transformResponse: voidResponse,
      invalidatesTags: [{ type: 'AdminConnectionRequest', id: 'LIST' }],
    }),

    // Favourites
    adminListFavourites: builder.query<AdminPagedResponse<AdminFavourite>, ListParams>({
      query: (params) => ({ url: '/admin/favourites', params: listQuery(params) }),
      transformResponse: unwrapApiResponse<AdminPagedResponse<AdminFavourite>>,
      providesTags: [{ type: 'AdminFavourite', id: 'LIST' }],
    }),
    adminDeleteFavourite: builder.mutation<void, string>({
      query: (id) => ({ url: `/admin/favourites/${id}`, method: 'DELETE' }),
      transformResponse: voidResponse,
      invalidatesTags: [{ type: 'AdminFavourite', id: 'LIST' }],
    }),

    // Conversations & messages
    adminListConversations: builder.query<AdminPagedResponse<AdminConversation>, ListParams>({
      query: (params) => ({ url: '/admin/conversations', params: listQuery(params) }),
      transformResponse: unwrapApiResponse<AdminPagedResponse<AdminConversation>>,
      providesTags: [{ type: 'AdminConversation', id: 'LIST' }],
    }),
    adminDeleteConversation: builder.mutation<void, string>({
      query: (id) => ({ url: `/admin/conversations/${id}`, method: 'DELETE' }),
      transformResponse: voidResponse,
      invalidatesTags: [{ type: 'AdminConversation', id: 'LIST' }],
    }),
    adminListMessages: builder.query<AdminPagedResponse<AdminMessage>, { conversationId: string } & ListParams>({
      query: ({ conversationId, ...params }) => ({ url: `/admin/conversations/${conversationId}/messages`, params: listQuery(params) }),
      transformResponse: unwrapApiResponse<AdminPagedResponse<AdminMessage>>,
      providesTags: [{ type: 'AdminMessage', id: 'LIST' }],
    }),
    adminDeleteMessage: builder.mutation<void, string>({
      query: (id) => ({ url: `/admin/messages/${id}`, method: 'DELETE' }),
      transformResponse: voidResponse,
      invalidatesTags: [{ type: 'AdminMessage', id: 'LIST' }],
    }),

    // Security: refresh tokens & OTPs
    adminListRefreshTokens: builder.query<AdminPagedResponse<AdminRefreshToken>, ListParams>({
      query: (params) => ({ url: '/admin/refresh-tokens', params: listQuery(params) }),
      transformResponse: unwrapApiResponse<AdminPagedResponse<AdminRefreshToken>>,
      providesTags: [{ type: 'AdminRefreshToken', id: 'LIST' }],
    }),
    adminDeleteRefreshToken: builder.mutation<void, string>({
      query: (id) => ({ url: `/admin/refresh-tokens/${id}`, method: 'DELETE' }),
      transformResponse: voidResponse,
      invalidatesTags: [{ type: 'AdminRefreshToken', id: 'LIST' }],
    }),
    adminListPasswordResetOtps: builder.query<AdminPagedResponse<AdminOtp>, ListParams>({
      query: (params) => ({ url: '/admin/otps/password-reset', params: listQuery(params) }),
      transformResponse: unwrapApiResponse<AdminPagedResponse<AdminOtp>>,
      providesTags: [{ type: 'AdminOtp', id: 'PASSWORD_RESET_LIST' }],
    }),
    adminDeletePasswordResetOtp: builder.mutation<void, string>({
      query: (id) => ({ url: `/admin/otps/password-reset/${id}`, method: 'DELETE' }),
      transformResponse: voidResponse,
      invalidatesTags: [{ type: 'AdminOtp', id: 'PASSWORD_RESET_LIST' }],
    }),
    adminListEmailVerificationOtps: builder.query<AdminPagedResponse<AdminOtp>, ListParams>({
      query: (params) => ({ url: '/admin/otps/email-verification', params: listQuery(params) }),
      transformResponse: unwrapApiResponse<AdminPagedResponse<AdminOtp>>,
      providesTags: [{ type: 'AdminOtp', id: 'EMAIL_VERIFICATION_LIST' }],
    }),
    adminDeleteEmailVerificationOtp: builder.mutation<void, string>({
      query: (id) => ({ url: `/admin/otps/email-verification/${id}`, method: 'DELETE' }),
      transformResponse: voidResponse,
      invalidatesTags: [{ type: 'AdminOtp', id: 'EMAIL_VERIFICATION_LIST' }],
    }),
  }),
});

export const {
  useAdminListUsersQuery,
  useAdminGetUserQuery,
  useAdminCreateUserMutation,
  useAdminUpdateUserMutation,
  useAdminDeleteUserMutation,
  useAdminListRolesQuery,
  useAdminListProfilesQuery,
  useAdminCreateProfileMutation,
  useAdminGetProfileQuery,
  useAdminUpdateProfileMutation,
  useAdminDeleteProfileMutation,
  useAdminDeleteProfilePhotoMutation,
  useAdminListConnectionRequestsQuery,
  useAdminUpdateConnectionRequestStatusMutation,
  useAdminDeleteConnectionRequestMutation,
  useAdminListFavouritesQuery,
  useAdminDeleteFavouriteMutation,
  useAdminListConversationsQuery,
  useAdminDeleteConversationMutation,
  useAdminListMessagesQuery,
  useAdminDeleteMessageMutation,
  useAdminListRefreshTokensQuery,
  useAdminDeleteRefreshTokenMutation,
  useAdminListPasswordResetOtpsQuery,
  useAdminDeletePasswordResetOtpMutation,
  useAdminListEmailVerificationOtpsQuery,
  useAdminDeleteEmailVerificationOtpMutation,
} = adminApi;