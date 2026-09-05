import type { MaritalStatus } from '../../../profile/domain/entities/ProfileEnums';

export type Gender = 'male' | 'female';

export interface DiscoverProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  bio: string;
  country: string;
  district?: string;
  city?: string;
  religion: string;
  race: string;
  caste?: string;
  maritalStatus: MaritalStatus;
  jobTitle: string;
  joinedAt: string;
  isGold: boolean;
  photos: string[];
  interests: string[];
  isVerified: boolean;
}
