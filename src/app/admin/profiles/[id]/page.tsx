'use client';

import { ArrowLeft, Save, ShieldCheck, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { resolveMediaUrl } from '../../../../core/api/apiClient';
import {
  useAdminDeleteProfileMutation,
  useAdminDeleteProfilePhotoMutation,
  useAdminGetProfileQuery,
  useAdminUpdateProfileMutation,
  type AdminProfileDetail,
  type AdminVerification,
} from '../../../../features/admin/data/api/adminApi';
import { DeleteConfirmDialog } from '../../../../features/admin/presentation/components/DeleteConfirmDialog';
import { Avatar, Badge, Button, Checkbox, EmptyState, ErrorState, FullPageSpinner, Input } from '../../../../shared/components';
import { InfoRow, Section } from '../../../../shared/components/Section';

const VERIFICATION_LABELS: { key: keyof AdminVerification; label: string }[] = [
  { key: 'phoneVerified', label: 'Phone' },
  { key: 'emailVerified', label: 'Email' },
  { key: 'identityVerified', label: 'Identity' },
  { key: 'photoVerified', label: 'Photo' },
  { key: 'professionVerified', label: 'Profession' },
  { key: 'educationVerified', label: 'Education' },
];

export default function AdminProfileDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: profile, isLoading, isError } = useAdminGetProfileQuery(params.id);

  if (isLoading) return <FullPageSpinner />;
  if (isError || !profile) return <ErrorState message="This profile could not be loaded." />;

  // Keyed by profile.id so editable local state is (re)seeded via lazy useState initializers
  // whenever a different profile loads, instead of syncing it in an effect.
  return <ProfileDetailContent key={profile.id} profile={profile} />;
}

function ProfileDetailContent({ profile }: { profile: AdminProfileDetail }) {
  const router = useRouter();
  const [updateProfile, { isLoading: isSaving }] = useAdminUpdateProfileMutation();
  const [deleteProfile] = useAdminDeleteProfileMutation();
  const [deletePhoto] = useAdminDeleteProfilePhotoMutation();

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [isGold, setIsGold] = useState(profile.isGold);
  const [verification, setVerification] = useState<AdminVerification>(profile.verification);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const dirty =
    firstName !== profile.firstName ||
    lastName !== profile.lastName ||
    isGold !== profile.isGold ||
    JSON.stringify(verification) !== JSON.stringify(profile.verification);

  const onSave = async () => {
    setSaveError(null);
    try {
      await updateProfile({ id: profile.id, input: { firstName, lastName, isGold, verification } }).unwrap();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not save changes.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/profiles" className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink">
        <ArrowLeft size={16} />
        Back to profiles
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={`${profile.firstName} ${profile.lastName}`} src={profile.photos[0] ? resolveMediaUrl(profile.photos[0].uri) : undefined} size={56} />
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-sm text-ink-muted">
              {profile.email} &middot; {profile.age} years old
            </p>
          </div>
          {profile.isGold && <Badge tone="gold">Gold</Badge>}
        </div>
        <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
          <Trash2 size={16} />
          Delete profile
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Section title="About">
            <p className="text-sm text-ink-muted">{profile.aboutMe || 'No bio provided.'}</p>
            {(profile.hobbies.length > 0 || profile.interests.length > 0) && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {profile.hobbies.map((h) => (
                  <Badge key={h} tone="neutral">
                    {h}
                  </Badge>
                ))}
                {profile.interests.map((i) => (
                  <Badge key={i} tone="ink">
                    {i}
                  </Badge>
                ))}
              </div>
            )}
          </Section>

          <Section title="Basic Info">
            <InfoRow label="Gender" value={<span className="capitalize">{profile.basicInfo.gender}</span>} />
            <InfoRow label="Race" value={profile.basicInfo.race} />
            <InfoRow label="Religion" value={profile.basicInfo.religion} />
            <InfoRow label="Caste" value={profile.basicInfo.caste} />
            <InfoRow label="Marital status" value={profile.basicInfo.maritalStatus} />
            <InfoRow label="Height" value={profile.basicInfo.heightLabel} />
          </Section>

          <Section title="Education & Profession">
            <InfoRow label="Qualification" value={profile.education.qualification} />
            <InfoRow label="Qualification status" value={profile.education.qualificationStatus} />
            <InfoRow label="Job status" value={profile.profession.jobStatus} />
            <InfoRow label="Occupation" value={profile.profession.occupation} />
            <InfoRow label="Income range" value={profile.profession.incomeRange} />
          </Section>

          <Section title="Residency & Family">
            <InfoRow label="City" value={profile.residency.city} />
            <InfoRow label="District" value={profile.residency.district} />
            <InfoRow label="Country" value={profile.residency.country} />
            <InfoRow label="Father's occupation" value={profile.family.fatherOccupation} />
            <InfoRow label="Mother's occupation" value={profile.family.motherOccupation} />
            <InfoRow label="Sibling count" value={profile.family.siblingCount} />
          </Section>

          <Section title="Lifestyle & Assets">
            <InfoRow label="Smoking" value={profile.lifestyle.smoking} />
            <InfoRow label="Alcohol" value={profile.lifestyle.alcohol} />
            <InfoRow label="Assets" value={profile.assets.status} />
          </Section>

          <Section title={`Photos (${profile.photos.length})`}>
            {profile.photos.length === 0 ? (
              <p className="text-sm text-ink-muted">No photos uploaded.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {profile.photos.map((photo) => (
                  <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={resolveMediaUrl(photo.uri)} alt="" className="h-full w-full object-cover" />
                    <button
                      onClick={() => deletePhoto({ profileId: profile.id, photoId: photo.id })}
                      className="absolute inset-0 flex items-center justify-center bg-ink/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>

        <div className="flex flex-col gap-6">
          <Section
            title="Admin controls"
            action={
              dirty && (
                <Button size="sm" loading={isSaving} onClick={onSave}>
                  <Save size={14} />
                  Save
                </Button>
              )
            }
          >
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>

              <Checkbox label="Gold member" checked={isGold} onChange={(e) => setIsGold(e.target.checked)} />

              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
                  <ShieldCheck size={15} />
                  Verification
                </span>
                {VERIFICATION_LABELS.map(({ key, label }) => (
                  <Checkbox
                    key={key}
                    label={label}
                    checked={verification[key]}
                    onChange={(e) => setVerification({ ...verification, [key]: e.target.checked })}
                  />
                ))}
              </div>

              {saveError && <p className="rounded-lg bg-danger-tint px-3 py-2 text-sm text-danger">{saveError}</p>}
            </div>
          </Section>

          <Section title="Siblings">
            {profile.siblings.length === 0 ? (
              <EmptyState title="No siblings recorded" />
            ) : (
              <div className="flex flex-col gap-2">
                {profile.siblings.map((s) => (
                  <div key={s.id} className="rounded-lg border border-border p-3 text-sm">
                    <p className="font-medium text-ink">{s.relationship}</p>
                    <p className="text-ink-muted">
                      {s.maritalStatus}
                      {s.occupation ? ` &middot; ${s.occupation}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>
      </div>

      {confirmingDelete && (
        <DeleteConfirmDialog
          title="Delete profile"
          message={`This permanently deletes ${profile.firstName} ${profile.lastName}'s matrimony profile. This cannot be undone.`}
          onDelete={async () => {
            await deleteProfile(profile.id).unwrap();
            router.push('/admin/profiles');
          }}
          onDone={() => setConfirmingDelete(false)}
        />
      )}
    </div>
  );
}
