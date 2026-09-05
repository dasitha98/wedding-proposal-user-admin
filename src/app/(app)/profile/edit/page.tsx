'use client';

import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { SRI_LANKA } from '../../../../features/discover/domain/entities/FilterOptions';
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from '../../../../features/profile/data/api/profileApi';
import { isProfileCreated, type UpdateProfileInput } from '../../../../features/profile/domain/entities/Profile';
import { AboutMeStep } from '../../../../features/profile/presentation/components/edit-steps/AboutMeStep';
import { BasicInfoStep } from '../../../../features/profile/presentation/components/edit-steps/BasicInfoStep';
import { EducationProfessionStep } from '../../../../features/profile/presentation/components/edit-steps/EducationProfessionStep';
import { FamilyStep } from '../../../../features/profile/presentation/components/edit-steps/FamilyStep';
import { HobbiesInterestsStep } from '../../../../features/profile/presentation/components/edit-steps/HobbiesInterestsStep';
import { LifestyleAssetsStep } from '../../../../features/profile/presentation/components/edit-steps/LifestyleAssetsStep';
import { PhotosStep } from '../../../../features/profile/presentation/components/edit-steps/PhotosStep';
import { ResidencyStep } from '../../../../features/profile/presentation/components/edit-steps/ResidencyStep';
import { ProfileCompletionBar } from '../../../../features/profile/presentation/components/ProfileCompletionBar';
import { initDraftFromProfile, useProfileDraft } from '../../../../features/profile/presentation/hooks/useProfileDraft';
import { Button } from '../../../../shared/components';
import { EmptyState } from '../../../../shared/components/EmptyState';
import { FullPageSpinner } from '../../../../shared/components/Spinner';
import { cn } from '../../../../shared/utils/cn';

interface StepDefinition {
  value: string;
  label: string;
  /** Whether this step's required fields are filled in. Steps with no required fields are always complete. */
  isComplete: (draft: UpdateProfileInput) => boolean;
}

const STEPS: StepDefinition[] = [
  {
    value: 'basic',
    label: 'Basic Info',
    isComplete: (draft) =>
      [draft.firstName, draft.lastName, draft.basicInfo?.race, draft.basicInfo?.religion, draft.basicInfo?.caste, draft.basicInfo?.heightLabel].every(
        (value) => !!value?.trim()
      ),
  },
  {
    value: 'photos',
    label: 'Photos',
    // Entirely optional — the member adds photos if they like.
    isComplete: () => true,
  },
  {
    value: 'about',
    label: 'About Me',
    isComplete: (draft) => !!draft.aboutMe?.trim(),
  },
  {
    value: 'career',
    label: 'Education & Career',
    isComplete: (draft) => !!draft.profession?.occupation?.trim(),
  },
  {
    value: 'residency',
    label: 'Residency',
    isComplete: (draft) =>
      !!draft.residency?.country?.trim() &&
      (draft.residency.country !== SRI_LANKA || !!(draft.residency?.district?.trim() && draft.residency?.city?.trim())),
  },
  {
    value: 'family',
    label: 'Family',
    isComplete: () => true,
  },
  {
    value: 'lifestyle',
    label: 'Lifestyle',
    isComplete: () => true,
  },
  {
    value: 'tags',
    label: 'Hobbies & Interests',
    isComplete: (draft) => !!draft.hobbies?.length && !!draft.interests?.length,
  },
];

function computeProgress(draft: UpdateProfileInput): number {
  const completed = STEPS.filter((step) => step.isComplete(draft)).length;
  return completed / STEPS.length;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { data: profile, isLoading, error, refetch } = useGetMyProfileQuery();

  if (isLoading) return <FullPageSpinner />;

  if (error || !profile) {
    return (
      <EmptyState
        title="Could not load your profile"
        description="Something went wrong while loading your profile. Please try again."
        action={<Button onClick={() => refetch()}>Retry</Button>}
      />
    );
  }

  return <ProfileEditor key={profile.id} profile={profile} onSaved={() => router.push('/profile')} />;
}

function ProfileEditor({
  profile,
  onSaved,
}: {
  profile: NonNullable<ReturnType<typeof useGetMyProfileQuery>['data']>;
  onSaved: () => void;
}) {
  const isNewUser = !isProfileCreated(profile);
  const [step, setStep] = useState('basic');
  const { draft, update, updateNested, setPhotos } = useProfileDraft(profile);
  const [updateProfile, { isLoading: isSaving }] = useUpdateMyProfileMutation();
  // Snapshot of the last-saved (or just-loaded) draft, used to detect unsaved edits so the
  // save button can be disabled until there's actually something new to save.
  const [savedSnapshot, setSavedSnapshot] = useState(() => initDraftFromProfile(profile));
  const isDirty = JSON.stringify(draft) !== JSON.stringify(savedSnapshot);

  const stepIndex = STEPS.findIndex((s) => s.value === step);
  const progress = computeProgress(draft);
  const isComplete = progress >= 1;

  const handleSave = async () => {
    await updateProfile(draft).unwrap();
    setSavedSnapshot(draft);

    if (isComplete) {
      onSaved();
      return;
    }

    // Not done yet — jump to the next incomplete section instead of leaving the page,
    // so filling one section in flows straight into whatever's still missing.
    for (let offset = 1; offset <= STEPS.length; offset += 1) {
      const next = STEPS[(stepIndex + offset) % STEPS.length];
      if (!next.isComplete(draft)) {
        setStep(next.value);
        break;
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          {isNewUser ? 'Create Profile' : 'Edit Profile'}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {isNewUser ? 'Complete your profile to start browsing and connecting.' : 'Keep your details accurate to get the best matches.'}
        </p>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="inline-flex rounded-full border border-border-strong bg-surface p-1">
          {STEPS.map((s) => {
            const active = s.value === step;
            const done = s.isComplete(draft);
            return (
              <button
                key={s.value}
                onClick={() => setStep(s.value)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors',
                  active ? 'bg-ink text-white' : 'text-ink-muted hover:text-ink'
                )}
              >
                {done && (
                  <Check size={14} className={active ? 'text-primary' : 'text-primary-dark'} />
                )}
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-8">
        {step === 'basic' && (
          <BasicInfoStep
            value={draft.basicInfo ?? {}}
            firstName={draft.firstName}
            lastName={draft.lastName}
            managedBy={draft.managedBy}
            onChange={(patch) => updateNested('basicInfo', patch)}
            onFirstNameChange={(firstName) => update('firstName', firstName)}
            onLastNameChange={(lastName) => update('lastName', lastName)}
            onManagedByChange={(managedBy) => update('managedBy', managedBy)}
          />
        )}
        {step === 'photos' && <PhotosStep photos={draft.photos ?? []} onChange={setPhotos} />}
        {step === 'about' && <AboutMeStep value={draft.aboutMe ?? ''} onChange={(v) => update('aboutMe', v)} />}
        {step === 'career' && (
          <EducationProfessionStep
            education={draft.education ?? {}}
            profession={draft.profession ?? {}}
            onEducationChange={(patch) => updateNested('education', patch)}
            onProfessionChange={(patch) => updateNested('profession', patch)}
          />
        )}
        {step === 'residency' && <ResidencyStep value={draft.residency ?? {}} onChange={(patch) => updateNested('residency', patch)} />}
        {step === 'family' && <FamilyStep value={draft.family ?? {}} onChange={(patch) => updateNested('family', patch)} />}
        {step === 'lifestyle' && (
          <LifestyleAssetsStep
            lifestyle={draft.lifestyle ?? {}}
            assets={draft.assets ?? {}}
            onLifestyleChange={(patch) => updateNested('lifestyle', patch)}
            onAssetsChange={(patch) => updateNested('assets', patch)}
          />
        )}
        {step === 'tags' && (
          <HobbiesInterestsStep
            hobbies={draft.hobbies ?? []}
            interests={draft.interests ?? []}
            onHobbiesChange={(hobbies) => update('hobbies', hobbies)}
            onInterestsChange={(interests) => update('interests', interests)}
          />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between gap-3">
          {stepIndex > 0 ? (
            <Button variant="secondary" className="w-28 sm:w-32" onClick={() => setStep(STEPS[stepIndex - 1].value)}>
              <ChevronLeft size={16} /> Back
            </Button>
          ) : (
            <span />
          )}
          {stepIndex < STEPS.length - 1 && (
            <Button className="w-28 sm:w-32" onClick={() => setStep(STEPS[stepIndex + 1].value)}>
              Next <ChevronRight size={16} />
            </Button>
          )}
        </div>

        <ProfileCompletionBar
          label={isComplete ? 'Save Changes' : 'Save Profile'}
          progress={progress}
          disabled={!isDirty}
          loading={isSaving}
          onClick={handleSave}
        />
      </div>
    </div>
  );
}
