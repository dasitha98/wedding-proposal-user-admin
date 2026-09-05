import type {
  AssetsStatus,
  EducationStatus,
  Gender,
  IncomeRange,
  JobStatus,
  LifestyleHabit,
  ManagedBy,
  MaritalStatus,
  QualificationStatus,
  RelationshipStatus,
  SiblingRelationship,
} from './ProfileEnums';

export interface ProfilePhoto {
  uri: string;
  isBlurred: boolean;
}

export interface BasicInfo {
  gender: Gender;
  race: string;
  religion: string;
  caste: string;
  dateOfBirthMasked: string;
  maritalStatus: MaritalStatus;
  heightLabel: string;
}

export interface Education {
  qualification: EducationStatus;
  qualificationStatus: QualificationStatus;
}

export interface Profession {
  jobStatus: JobStatus;
  occupation: string;
  incomeRange: IncomeRange;
}

export interface Residency {
  city: string;
  district: string;
  country: string;
}

export interface Sibling {
  relationship: SiblingRelationship;
  maritalStatus: MaritalStatus;
  occupation?: string;
}

export interface Family {
  fatherOccupation?: string;
  motherOccupation?: string;
  siblingCount: number;
  siblings: Sibling[];
}

export interface Lifestyle {
  smoking: LifestyleHabit;
  alcohol: LifestyleHabit;
}

export interface Assets {
  status: AssetsStatus;
}

export interface Verification {
  phoneVerified: boolean;
  emailVerified: boolean;
  identityVerified: boolean;
  photoVerified: boolean;
  professionVerified: boolean;
  educationVerified: boolean;
}

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  photos: ProfilePhoto[];
  age: number;
  city: string;
  lastActiveLabel: string;
  managedBy: ManagedBy | null;
  isFavourite: boolean;
  relationshipStatus: RelationshipStatus;
  basicInfo: BasicInfo;
  education: Education;
  profession: Profession;
  residency: Residency;
  family: Family;
  lifestyle: Lifestyle;
  assets: Assets;
  hobbies: string[];
  interests: string[];
  verification: Verification;
  aboutMe?: string;
  isGold: boolean;
}

export function getFullName(profile: Pick<Profile, 'firstName' | 'lastName'>): string {
  return `${profile.firstName} ${profile.lastName}`.trim();
}

/**
 * Whether the member has filled in their own profile, as opposed to still sitting on the
 * blank placeholder the backend seeds on first access (see ProfileService.GetByUserIdAsync).
 */
export function isProfileCreated(profile: Pick<Profile, 'basicInfo'>): boolean {
  const { race, religion, caste, heightLabel } = profile.basicInfo;
  return [race, religion, caste, heightLabel].every((value) => value.trim().length > 0);
}

export interface SiblingUpdate {
  relationship: SiblingRelationship;
  maritalStatus: MaritalStatus;
  occupation?: string;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  managedBy?: ManagedBy;
  aboutMe?: string;
  hobbies?: string[];
  interests?: string[];
  photos?: ProfilePhoto[];
  basicInfo?: Partial<Omit<BasicInfo, 'dateOfBirthMasked'>>;
  education?: Partial<Education>;
  profession?: Partial<Profession>;
  residency?: Partial<Residency>;
  family?: {
    fatherOccupation?: string;
    motherOccupation?: string;
    siblingCount?: number;
    siblings?: SiblingUpdate[];
  };
  lifestyle?: Partial<Lifestyle>;
  assets?: Partial<Assets>;
}

export interface CreateProfileInput {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}
