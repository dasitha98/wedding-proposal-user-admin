import type { Gender, MaritalStatus } from '../../../profile/domain/entities/ProfileEnums';
import { MAX_AGE, MIN_AGE, type SortOption } from './FilterOptions';

export interface DiscoverFilters {
  sortBy: SortOption;
  ageRange: [number, number];
  genders: Gender[];
  country: string | null;
  district: string | null;
  city: string | null;
  religions: string[];
  races: string[];
  castes: string[];
  maritalStatuses: MaritalStatus[];
  jobTitle: string | null;
  onlyForeign: boolean;
  onlyGold: boolean;
  onlyWithPhotos: boolean;
}

export const DEFAULT_FILTERS: DiscoverFilters = {
  sortBy: 'newest',
  ageRange: [MIN_AGE, MAX_AGE],
  genders: [],
  country: null,
  district: null,
  city: null,
  religions: [],
  races: [],
  castes: [],
  maritalStatuses: [],
  jobTitle: null,
  onlyForeign: false,
  onlyGold: false,
  onlyWithPhotos: false,
};

export function getActiveFilterCount(filters: DiscoverFilters): number {
  let count = 0;
  if (filters.sortBy !== DEFAULT_FILTERS.sortBy) count++;
  if (filters.ageRange[0] !== MIN_AGE || filters.ageRange[1] !== MAX_AGE) count++;
  if (filters.genders.length > 0) count++;
  if (filters.country) count++;
  if (filters.district) count++;
  if (filters.city) count++;
  if (filters.religions.length > 0) count++;
  if (filters.races.length > 0) count++;
  if (filters.castes.length > 0) count++;
  if (filters.maritalStatuses.length > 0) count++;
  if (filters.jobTitle) count++;
  if (filters.onlyForeign) count++;
  if (filters.onlyGold) count++;
  if (filters.onlyWithPhotos) count++;
  return count;
}
