import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth, resolveMediaUrl, unwrapApiResponse } from '../../../../core/api/apiClient';
import type { DiscoverFilters } from '../../domain/entities/DiscoverFilters';
import type { DiscoverProfile } from '../../domain/entities/Profile';

export interface DiscoverResult {
  items: DiscoverProfile[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

interface BackendDiscoverProfile extends Omit<DiscoverProfile, 'photos'> {
  photos: string[];
}

interface BackendDiscoverResult {
  items: BackendDiscoverProfile[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface DiscoverQueryArgs extends DiscoverFilters {
  page: number;
  pageSize: number;
}

/** ASP.NET model binding expects repeated `key=value` pairs for list-valued query params. */
function buildDiscoverParams(args: DiscoverQueryArgs): string {
  const params = new URLSearchParams();
  params.set('sortBy', args.sortBy);
  params.set('minAge', String(args.ageRange[0]));
  params.set('maxAge', String(args.ageRange[1]));
  args.genders.forEach((g) => params.append('genders', g));
  if (args.country) params.set('country', args.country);
  if (args.district) params.set('district', args.district);
  if (args.city) params.set('city', args.city);
  args.religions.forEach((v) => params.append('religions', v));
  args.races.forEach((v) => params.append('races', v));
  args.castes.forEach((v) => params.append('castes', v));
  args.maritalStatuses.forEach((v) => params.append('maritalStatuses', v));
  if (args.jobTitle) params.set('jobTitle', args.jobTitle);
  params.set('onlyForeign', String(args.onlyForeign));
  params.set('onlyGold', String(args.onlyGold));
  params.set('onlyWithPhotos', String(args.onlyWithPhotos));
  params.set('page', String(args.page));
  params.set('pageSize', String(args.pageSize));
  return params.toString();
}

export const discoverApi = createApi({
  reducerPath: 'discoverApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    discover: builder.query<DiscoverResult, DiscoverQueryArgs>({
      query: (args) => `/discover?${buildDiscoverParams(args)}`,
      transformResponse: (response: { success: boolean; data?: BackendDiscoverResult; error?: string }) => {
        const result = unwrapApiResponse(response);
        return {
          ...result,
          items: result.items.map((item) => ({ ...item, photos: item.photos.map(resolveMediaUrl) })),
        };
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}(${JSON.stringify({ ...queryArgs, page: undefined })})`,
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) return newItems;
        return {
          ...newItems,
          items: [...currentCache.items, ...newItems.items],
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.page !== previousArg?.page,
    }),
  }),
});

export const { useDiscoverQuery } = discoverApi;
