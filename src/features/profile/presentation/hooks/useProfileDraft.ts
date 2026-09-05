import { useState } from 'react';

import type { Profile, ProfilePhoto, UpdateProfileInput } from '../../domain/entities/Profile';

export function initDraftFromProfile(profile: Profile): UpdateProfileInput {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    managedBy: profile.managedBy ?? undefined,
    aboutMe: profile.aboutMe ?? '',
    hobbies: profile.hobbies,
    interests: profile.interests,
    photos: profile.photos,
    basicInfo: {
      gender: profile.basicInfo.gender,
      race: profile.basicInfo.race,
      religion: profile.basicInfo.religion,
      caste: profile.basicInfo.caste,
      maritalStatus: profile.basicInfo.maritalStatus,
      heightLabel: profile.basicInfo.heightLabel,
    },
    education: { ...profile.education },
    profession: { ...profile.profession },
    residency: { ...profile.residency },
    family: {
      fatherOccupation: profile.family.fatherOccupation,
      motherOccupation: profile.family.motherOccupation,
      siblingCount: profile.family.siblingCount,
      siblings: profile.family.siblings,
    },
    lifestyle: { ...profile.lifestyle },
    assets: { ...profile.assets },
  };
}

export function useProfileDraft(profile: Profile) {
  const [draft, setDraft] = useState<UpdateProfileInput>(() => initDraftFromProfile(profile));

  const update = <K extends keyof UpdateProfileInput>(key: K, value: UpdateProfileInput[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const updateNested = <K extends 'basicInfo' | 'education' | 'profession' | 'residency' | 'family' | 'lifestyle' | 'assets'>(
    key: K,
    value: Partial<NonNullable<UpdateProfileInput[K]>>
  ) => {
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], ...value } }));
  };

  const setPhotos = (photos: ProfilePhoto[]) => update('photos', photos);

  return { draft, update, updateNested, setPhotos };
}
