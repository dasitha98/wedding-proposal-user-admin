import { resolveMediaUrl } from '../../core/api/apiClient';

/** Wire shape returned by the backend for `ProfileSummaryResponse`. */
export interface BackendProfileSummary {
  id: string;
  firstName: string;
  lastName: string;
  photo: string | null;
  age: number;
  city: string;
  lastActiveLabel: string;
  isGold: boolean;
}

/** Normalized shape used across discover/saved/requests/messages UI. */
export interface ProfileSummary {
  id: string;
  name: string;
  age: number;
  photo: string | null;
  city: string;
  lastActiveLabel: string;
  isGold: boolean;
}

export function toProfileSummary(backend: BackendProfileSummary): ProfileSummary {
  return {
    id: backend.id,
    name: `${backend.firstName} ${backend.lastName}`.trim(),
    age: backend.age,
    photo: backend.photo ? resolveMediaUrl(backend.photo) : null,
    city: backend.city,
    lastActiveLabel: backend.lastActiveLabel,
    isGold: backend.isGold,
  };
}
