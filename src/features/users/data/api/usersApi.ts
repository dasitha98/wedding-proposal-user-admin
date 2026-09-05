import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth, unwrapApiResponse } from '../../../../core/api/apiClient';

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getCurrentUser: builder.query<CurrentUser, void>({
      query: () => '/users/me',
      transformResponse: unwrapApiResponse<CurrentUser>,
    }),
  }),
});

export const { useGetCurrentUserQuery } = usersApi;
