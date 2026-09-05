export type Gender = 'male' | 'female';

export type MaritalStatus =
  | 'neverMarried'
  | 'divorced'
  | 'widowed'
  | 'separated'
  | 'awaitingDivorce'
  | 'limitedToSignature';

export type ManagedBy = 'self' | 'parent' | 'guardian';

export type RelationshipStatus =
  | 'none'
  | 'sent'
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'blocked'
  | 'connected'
  | 'unavailable';

export type EducationStatus =
  | 'ol'
  | 'al'
  | 'diploma'
  | 'bachelors'
  | 'masters'
  | 'doctorate'
  | 'professional'
  | 'other';

export type QualificationStatus = 'currentlyFollowing' | 'completed';

export type JobStatus = 'employed' | 'selfEmployed' | 'businessOwner' | 'unemployed' | 'student' | 'other';

export type IncomeRange =
  | 'below25k'
  | '25kTo50k'
  | '50kTo100k'
  | '100kTo250k'
  | '250kTo500k'
  | '500kTo1m'
  | 'above1m'
  | 'preferNotToSay';

export type AssetsStatus = 'notAvailable' | 'available' | 'preferNotToSay';

export type LifestyleHabit = 'yes' | 'no' | 'occasionally' | 'preferNotToSay';

export type SiblingRelationship = 'olderBrother' | 'youngerBrother' | 'olderSister' | 'youngerSister';

interface Option<T extends string> {
  label: string;
  value: T;
}

export const GENDER_OPTIONS: Option<Gender>[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

export const MARITAL_STATUS_OPTIONS: Option<MaritalStatus>[] = [
  { label: 'Never Married', value: 'neverMarried' },
  { label: 'Divorced', value: 'divorced' },
  { label: 'Widowed', value: 'widowed' },
  { label: 'Separated', value: 'separated' },
  { label: 'Awaiting Divorce', value: 'awaitingDivorce' },
  { label: 'Limited to Signature', value: 'limitedToSignature' },
];

export const MANAGED_BY_OPTIONS: Option<ManagedBy>[] = [
  { label: 'Self', value: 'self' },
  { label: 'Parent', value: 'parent' },
  { label: 'Guardian', value: 'guardian' },
];

export const EDUCATION_STATUS_OPTIONS: Option<EducationStatus>[] = [
  { label: 'O/L', value: 'ol' },
  { label: 'A/L', value: 'al' },
  { label: 'Diploma', value: 'diploma' },
  { label: "Bachelor's Degree", value: 'bachelors' },
  { label: "Master's Degree", value: 'masters' },
  { label: 'Doctorate', value: 'doctorate' },
  { label: 'Professional Qualification', value: 'professional' },
  { label: 'Other', value: 'other' },
];

export const QUALIFICATION_STATUS_OPTIONS: Option<QualificationStatus>[] = [
  { label: 'Currently Following', value: 'currentlyFollowing' },
  { label: 'Completed', value: 'completed' },
];

export const JOB_STATUS_OPTIONS: Option<JobStatus>[] = [
  { label: 'Employed', value: 'employed' },
  { label: 'Self Employed', value: 'selfEmployed' },
  { label: 'Business Owner', value: 'businessOwner' },
  { label: 'Unemployed', value: 'unemployed' },
  { label: 'Student', value: 'student' },
  { label: 'Other', value: 'other' },
];

export const INCOME_RANGE_OPTIONS: Option<IncomeRange>[] = [
  { label: 'Below 25k', value: 'below25k' },
  { label: '25k - 50k', value: '25kTo50k' },
  { label: '50k - 100k', value: '50kTo100k' },
  { label: '100k - 250k', value: '100kTo250k' },
  { label: '250k - 500k', value: '250kTo500k' },
  { label: '500k - 1M', value: '500kTo1m' },
  { label: 'Above 1M', value: 'above1m' },
  { label: 'Prefer not to say', value: 'preferNotToSay' },
];

export const ASSETS_STATUS_OPTIONS: Option<AssetsStatus>[] = [
  { label: 'Not Available', value: 'notAvailable' },
  { label: 'Available', value: 'available' },
  { label: 'Prefer not to say', value: 'preferNotToSay' },
];

export const LIFESTYLE_HABIT_OPTIONS: Option<LifestyleHabit>[] = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
  { label: 'Occasionally', value: 'occasionally' },
  { label: 'Prefer not to say', value: 'preferNotToSay' },
];

export const SIBLING_RELATIONSHIP_OPTIONS: Option<SiblingRelationship>[] = [
  { label: 'Older Brother', value: 'olderBrother' },
  { label: 'Younger Brother', value: 'youngerBrother' },
  { label: 'Older Sister', value: 'olderSister' },
  { label: 'Younger Sister', value: 'youngerSister' },
];

function labelFor<T extends string>(options: Option<T>[], value: T): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export const genderLabel = (v: Gender): string => labelFor(GENDER_OPTIONS, v);
export const maritalStatusLabel = (v: MaritalStatus): string => labelFor(MARITAL_STATUS_OPTIONS, v);
export const managedByLabel = (v: ManagedBy): string => labelFor(MANAGED_BY_OPTIONS, v);
export const educationStatusLabel = (v: EducationStatus): string => labelFor(EDUCATION_STATUS_OPTIONS, v);
export const qualificationStatusLabel = (v: QualificationStatus): string => labelFor(QUALIFICATION_STATUS_OPTIONS, v);
export const jobStatusLabel = (v: JobStatus): string => labelFor(JOB_STATUS_OPTIONS, v);
export const incomeRangeLabel = (v: IncomeRange): string => labelFor(INCOME_RANGE_OPTIONS, v);
export const assetsStatusLabel = (v: AssetsStatus): string => labelFor(ASSETS_STATUS_OPTIONS, v);
export const lifestyleHabitLabel = (v: LifestyleHabit): string => labelFor(LIFESTYLE_HABIT_OPTIONS, v);
export const siblingRelationshipLabel = (v: SiblingRelationship): string => labelFor(SIBLING_RELATIONSHIP_OPTIONS, v);
