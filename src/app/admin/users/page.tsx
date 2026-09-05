'use client';

import { Plus, Search, ShieldCheck, Trash2, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import {
  useAdminCreateProfileMutation,
  useAdminCreateUserMutation,
  useAdminDeleteProfilePhotoMutation,
  useAdminDeleteUserMutation,
  useAdminGetProfileQuery,
  useAdminGetUserQuery,
  useAdminListRolesQuery,
  useAdminListUsersQuery,
  useAdminUpdateProfileMutation,
  useAdminUpdateUserMutation,
  type AdminProfileDetail,
  type AdminSiblingInput,
  type AdminUpdateProfileInput,
  type AdminUser,
} from '../../../features/admin/data/api/adminApi';
import { AdminDataTable, type AdminColumn } from '../../../features/admin/presentation/components/AdminDataTable';
import { AdminPagination } from '../../../features/admin/presentation/components/AdminPagination';
import { DeleteConfirmDialog } from '../../../features/admin/presentation/components/DeleteConfirmDialog';
import { Badge, Button, Checkbox, Input, Modal, Select, Spinner, Tabs, Textarea } from '../../../shared/components';

const PAGE_SIZE = 12;

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];
const MANAGED_BY_OPTIONS = [
  { value: 'self', label: 'Self' },
  { value: 'parent', label: 'Parent' },
  { value: 'guardian', label: 'Guardian' },
];
const MARITAL_STATUS_OPTIONS = [
  { value: 'neverMarried', label: 'Never married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'separated', label: 'Separated' },
  { value: 'awaitingDivorce', label: 'Awaiting divorce' },
  { value: 'limitedToSignature', label: 'Limited to signature' },
];
const EDUCATION_STATUS_OPTIONS = [
  { value: 'ol', label: 'O/L' },
  { value: 'al', label: 'A/L' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'bachelors', label: "Bachelor's" },
  { value: 'masters', label: "Master's" },
  { value: 'doctorate', label: 'Doctorate' },
  { value: 'professional', label: 'Professional' },
  { value: 'other', label: 'Other' },
];
const QUALIFICATION_STATUS_OPTIONS = [
  { value: 'currentlyFollowing', label: 'Currently following' },
  { value: 'completed', label: 'Completed' },
];
const JOB_STATUS_OPTIONS = [
  { value: 'employed', label: 'Employed' },
  { value: 'selfEmployed', label: 'Self-employed' },
  { value: 'businessOwner', label: 'Business owner' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'student', label: 'Student' },
  { value: 'other', label: 'Other' },
];
const INCOME_RANGE_OPTIONS = [
  { value: 'below25k', label: 'Below 25k' },
  { value: '25kTo50k', label: '25k - 50k' },
  { value: '50kTo100k', label: '50k - 100k' },
  { value: '100kTo250k', label: '100k - 250k' },
  { value: '250kTo500k', label: '250k - 500k' },
  { value: '500kTo1m', label: '500k - 1M' },
  { value: 'above1m', label: 'Above 1M' },
  { value: 'preferNotToSay', label: 'Prefer not to say' },
];
const ASSETS_STATUS_OPTIONS = [
  { value: 'notAvailable', label: 'Not available' },
  { value: 'available', label: 'Available' },
  { value: 'preferNotToSay', label: 'Prefer not to say' },
];
const LIFESTYLE_HABIT_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'occasionally', label: 'Occasionally' },
  { value: 'preferNotToSay', label: 'Prefer not to say' },
];
const SIBLING_RELATIONSHIP_OPTIONS = [
  { value: 'olderBrother', label: 'Older brother' },
  { value: 'youngerBrother', label: 'Younger brother' },
  { value: 'olderSister', label: 'Older sister' },
  { value: 'youngerSister', label: 'Younger sister' },
];

const WIZARD_STEPS = [
  { key: 'account', label: 'Account' },
  { key: 'basicInfo', label: 'Basic info' },
  { key: 'photos', label: 'Photos' },
  { key: 'aboutMe', label: 'About me' },
  { key: 'educationProfession', label: 'Education & profession' },
  { key: 'residency', label: 'Country' },
  { key: 'familyDetails', label: 'Family details' },
  { key: 'otherDetails', label: 'Other details' },
  { key: 'hobbiesInterests', label: 'Hobbies & interests' },
  { key: 'verification', label: 'Verification & status' },
] as const;

type WizardStepKey = (typeof WIZARD_STEPS)[number]['key'];

function tagsToText(tags: string[]) {
  return tags.join(', ');
}

function textToTags(text: string) {
  return text
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

function formatLastActive(lastActiveAt: string | null) {
  if (!lastActiveAt) return 'Never';

  const diffMs = Date.now() - new Date(lastActiveAt).getTime();
  const diffMinutes = Math.round(diffMs / 60_000);
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;

  return new Date(lastActiveAt).toLocaleDateString();
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<AdminUser | null>(null);
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useAdminListUsersQuery({ search: search || undefined, page, pageSize: PAGE_SIZE });
  const [deleteUser] = useAdminDeleteUserMutation();

  const columns: AdminColumn<AdminUser>[] = [
    { header: 'Name', cell: (u) => <span className="font-medium">{u.firstName} {u.lastName}</span> },
    { header: 'Email', cell: (u) => u.email },
    {
      header: 'Status',
      cell: (u) => (
        <div className="flex flex-wrap gap-1.5">
          {u.emailConfirmed && <Badge tone="success">Verified</Badge>}
          {u.isLockedOut && <Badge tone="danger">Suspended</Badge>}
          {u.roles.map((r) => (
            <Badge key={r} tone="gold">
              {r}
            </Badge>
          ))}
        </div>
      ),
    },
    { header: 'Joined', cell: (u) => new Date(u.createdAt).toLocaleDateString() },
    {
      header: 'Last active',
      cell: (u) => (
        <span className={u.lastActiveAt ? 'text-ink-muted' : 'text-ink-faint'}>{formatLastActive(u.lastActiveAt)}</span>
      ),
    },
    {
      header: '',
      cell: (u) => (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="secondary" onClick={() => setEditingUserId(u.id)}>
            Manage
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDeleting(u)} className="text-danger hover:bg-danger-tint">
            <Trash2 size={16} />
          </Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl font-semibold text-ink">Users</h1>
          <p className="text-sm text-ink-muted">Manage accounts, verification, suspension, and role assignment.</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus size={16} />
          New admin
        </Button>
      </div>

      <Input
        icon={<Search size={16} />}
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="max-w-sm"
      />

      <AdminDataTable
        columns={columns}
        rows={data?.items ?? []}
        keyFn={(u) => u.id}
        isLoading={isLoading}
        emptyTitle="No users found"
      />
      {data && <AdminPagination page={data.page} totalPages={data.totalPages} totalCount={data.totalCount} onPageChange={setPage} />}

      {creating && <CreateUserModal onClose={() => setCreating(false)} />}

      {editingUserId && <EditUserModal userId={editingUserId} onClose={() => setEditingUserId(null)} />}

      {deleting && (
        <DeleteConfirmDialog
          title="Delete user"
          message={`This permanently deletes ${deleting.firstName} ${deleting.lastName} (${deleting.email}). This cannot be undone.`}
          onDelete={() => deleteUser(deleting.id).unwrap()}
          onDone={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

function EditUserModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const { data: user, isLoading } = useAdminGetUserQuery(userId);

  return (
    <Modal open onClose={onClose} title="Manage user" className="h-[95vh] w-[min(80rem,calc(100vw-4rem))] max-w-none max-h-none overflow-y-auto">
      {isLoading || !user ? (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <UserWizardGate user={user} onClose={onClose} />
      )}
    </Modal>
  );
}

function UserWizardGate({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const [profileId, setProfileId] = useState(user.profileId);
  const { data: profile, isLoading } = useAdminGetProfileQuery(profileId ?? '', { skip: !profileId });

  if (profileId && (isLoading || !profile)) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <UserWizard
      user={user}
      profile={profileId ? (profile as AdminProfileDetail) : null}
      profileId={profileId}
      onProfileIdChange={setProfileId}
      onClose={onClose}
    />
  );
}

function UserWizard({
  user,
  profile,
  profileId,
  onProfileIdChange,
  onClose,
}: {
  user: AdminUser;
  profile: AdminProfileDetail | null;
  profileId: string | null;
  onProfileIdChange: (id: string) => void;
  onClose: () => void;
}) {
  const [updateUser, { isLoading: isSavingUser }] = useAdminUpdateUserMutation();
  const [createProfile] = useAdminCreateProfileMutation();
  const [updateProfile, { isLoading: isSavingProfile }] = useAdminUpdateProfileMutation();
  const [deletePhoto, { isLoading: isDeletingPhoto }] = useAdminDeleteProfilePhotoMutation();

  const [step, setStep] = useState<WizardStepKey>('account');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [accountFirstName, setAccountFirstName] = useState(user.firstName);
  const [accountLastName, setAccountLastName] = useState(user.lastName);
  const [emailConfirmed, setEmailConfirmed] = useState(user.emailConfirmed);
  const [isLockedOut, setIsLockedOut] = useState(user.isLockedOut);
  const [roles, setRoles] = useState<string[]>(user.roles);

  const [firstName, setFirstName] = useState(profile?.firstName ?? user.firstName);
  const [lastName, setLastName] = useState(profile?.lastName ?? user.lastName);
  const [dateOfBirth, setDateOfBirth] = useState(profile?.dateOfBirth.slice(0, 10) ?? '');
  const [managedBy, setManagedBy] = useState<'self' | 'parent' | 'guardian'>(profile?.managedBy ?? 'self');
  const [aboutMe, setAboutMe] = useState(profile?.aboutMe ?? '');
  const [hobbies, setHobbies] = useState(profile ? tagsToText(profile.hobbies) : '');
  const [interests, setInterests] = useState(profile ? tagsToText(profile.interests) : '');
  const [isGold, setIsGold] = useState(profile?.isGold ?? false);

  const [gender, setGender] = useState<'male' | 'female'>(profile?.basicInfo.gender ?? 'male');
  const [race, setRace] = useState(profile?.basicInfo.race ?? '');
  const [religion, setReligion] = useState(profile?.basicInfo.religion ?? '');
  const [caste, setCaste] = useState(profile?.basicInfo.caste ?? '');
  const [maritalStatus, setMaritalStatus] = useState(profile?.basicInfo.maritalStatus ?? 'neverMarried');
  const [heightLabel, setHeightLabel] = useState(profile?.basicInfo.heightLabel ?? '');

  const [qualification, setQualification] = useState(profile?.education.qualification ?? 'bachelors');
  const [qualificationStatus, setQualificationStatus] = useState(profile?.education.qualificationStatus ?? 'completed');

  const [jobStatus, setJobStatus] = useState(profile?.profession.jobStatus ?? 'employed');
  const [occupation, setOccupation] = useState(profile?.profession.occupation ?? '');
  const [incomeRange, setIncomeRange] = useState(profile?.profession.incomeRange ?? 'preferNotToSay');

  const [city, setCity] = useState(profile?.residency.city ?? '');
  const [district, setDistrict] = useState(profile?.residency.district ?? '');
  const [country, setCountry] = useState(profile?.residency.country ?? '');

  const [fatherOccupation, setFatherOccupation] = useState(profile?.family.fatherOccupation ?? '');
  const [motherOccupation, setMotherOccupation] = useState(profile?.family.motherOccupation ?? '');
  const [siblingCount, setSiblingCount] = useState(profile?.family.siblingCount ?? 0);
  const [siblings, setSiblings] = useState<AdminSiblingInput[]>(
    profile ? profile.siblings.map((s) => ({ relationship: s.relationship, maritalStatus: s.maritalStatus, occupation: s.occupation })) : []
  );

  const [smoking, setSmoking] = useState(profile?.lifestyle.smoking ?? 'no');
  const [alcohol, setAlcohol] = useState(profile?.lifestyle.alcohol ?? 'no');
  const [assetsStatus, setAssetsStatus] = useState(profile?.assets.status ?? 'preferNotToSay');

  const [phoneVerified, setPhoneVerified] = useState(profile?.verification.phoneVerified ?? false);
  const [emailVerified, setEmailVerified] = useState(profile?.verification.emailVerified ?? false);
  const [identityVerified, setIdentityVerified] = useState(profile?.verification.identityVerified ?? false);
  const [photoVerified, setPhotoVerified] = useState(profile?.verification.photoVerified ?? false);
  const [professionVerified, setProfessionVerified] = useState(profile?.verification.professionVerified ?? false);
  const [educationVerified, setEducationVerified] = useState(profile?.verification.educationVerified ?? false);

  const addSibling = () => {
    setSiblings((prev) => [...prev, { relationship: 'olderBrother', maritalStatus: 'neverMarried', occupation: '' }]);
  };
  const updateSibling = (index: number, patch: Partial<AdminSiblingInput>) => {
    setSiblings((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };
  const removeSibling = (index: number) => {
    setSiblings((prev) => prev.filter((_, i) => i !== index));
  };

  const onSave = async () => {
    setError(null);
    setSaved(false);

    if (!profileId && !dateOfBirth) {
      setError('Date of birth is required (Basic info) to create a profile for this account.');
      setStep('basicInfo');
      return;
    }

    try {
      await updateUser({
        id: user.id,
        input: { firstName: accountFirstName, lastName: accountLastName, emailConfirmed, isLockedOut, roles },
      }).unwrap();

      let currentProfileId = profileId;
      if (!currentProfileId) {
        const created = await createProfile({ userId: user.id, firstName, lastName, dateOfBirth }).unwrap();
        currentProfileId = created.id;
        onProfileIdChange(created.id);
      }

      const input: AdminUpdateProfileInput = {
        firstName,
        lastName,
        dateOfBirth,
        managedBy,
        aboutMe,
        hobbies: textToTags(hobbies),
        interests: textToTags(interests),
        isGold,
        basicInfo: { gender, race, religion, caste, maritalStatus, heightLabel },
        education: { qualification, qualificationStatus },
        profession: { jobStatus, occupation, incomeRange },
        residency: { city, district, country },
        family: {
          fatherOccupation: fatherOccupation || null,
          motherOccupation: motherOccupation || null,
          siblingCount,
          siblings,
        },
        lifestyle: { smoking, alcohol },
        assets: { status: assetsStatus },
        verification: {
          phoneVerified,
          emailVerified,
          identityVerified,
          photoVerified,
          professionVerified,
          educationVerified,
        },
      };

      await updateProfile({ id: currentProfileId, input }).unwrap();
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save changes.');
    }
  };

  const stepIndex = WIZARD_STEPS.findIndex((s) => s.key === step);
  const isSaving = isSavingUser || isSavingProfile;

  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-x-auto">
        <Tabs items={WIZARD_STEPS.map((s) => ({ value: s.key, label: s.label }))} value={step} onChange={(v) => setStep(v as WizardStepKey)} />
      </div>

      {!profileId && step !== 'account' && (
        <p className="rounded-lg bg-primary-tint px-3 py-2 text-sm text-ink-muted">
          This account doesn&apos;t have a matrimony profile yet. Fill in Basic info (including date of birth) and Save to create one.
        </p>
      )}

      {step === 'account' && (
        <Section title="Account">
          <Checkbox label="Email verified" checked={emailConfirmed} onChange={(e) => setEmailConfirmed(e.target.checked)} />
          <Checkbox
            label="Suspend account (blocks sign-in)"
            checked={isLockedOut}
            onChange={(e) => setIsLockedOut(e.target.checked)}
          />
          <Checkbox label="Paid (Gold member)" checked={isGold} onChange={(e) => setIsGold(e.target.checked)} />
        </Section>
      )}

      {step === 'basicInfo' && (
        <Section title="Basic info">
          <div className="grid grid-cols-3 gap-3">
            <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <Select label="Managed by" value={managedBy} onChange={(e) => setManagedBy(e.target.value as typeof managedBy)}>
              {MANAGED_BY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <Select label="Gender" value={gender} onChange={(e) => setGender(e.target.value as 'male' | 'female')}>
              {GENDER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <Input label="Race" value={race} onChange={(e) => setRace(e.target.value)} />
            <Input label="Religion" value={religion} onChange={(e) => setReligion(e.target.value)} />
            <Input label="Caste" value={caste} onChange={(e) => setCaste(e.target.value)} />
            <Input label="Date of birth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
            <Select label="Marital status" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
              {MARITAL_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <Input label="Height" value={heightLabel} onChange={(e) => setHeightLabel(e.target.value)} />
          </div>
        </Section>
      )}

      {step === 'photos' && (
        <Section title="Photos">
          {!profile || profile.photos.length === 0 ? (
            <p className="text-sm text-ink-muted">No photos uploaded.</p>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {profile.photos.map((photo) => (
                <div key={photo.id} className="group relative overflow-hidden rounded-xl border border-border-strong">
                  <img src={photo.uri} alt="" className="aspect-square w-full object-cover" />
                  <button
                    type="button"
                    disabled={isDeletingPhoto}
                    onClick={() => profileId && deletePhoto({ profileId, photoId: photo.id })}
                    className="absolute right-1.5 top-1.5 rounded-full bg-ink/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Delete photo"
                  >
                    <X size={14} />
                  </button>
                  {photo.isBlurred && (
                    <span className="absolute bottom-1.5 left-1.5 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] font-semibold text-white">
                      Blurred
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {step === 'aboutMe' && (
        <Section title="About me">
          <Textarea label="Description" value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} rows={6} />
        </Section>
      )}

      {step === 'educationProfession' && (
        <Section title="Education & profession">
          <div className="grid grid-cols-3 gap-3">
            <Select label="Qualification" value={qualification} onChange={(e) => setQualification(e.target.value)}>
              {EDUCATION_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <Select label="Qualification status" value={qualificationStatus} onChange={(e) => setQualificationStatus(e.target.value)}>
              {QUALIFICATION_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <Select label="Job status" value={jobStatus} onChange={(e) => setJobStatus(e.target.value)}>
              {JOB_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <Input label="Occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
            <Select label="Income range" value={incomeRange} onChange={(e) => setIncomeRange(e.target.value)}>
              {INCOME_RANGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
        </Section>
      )}

      {step === 'residency' && (
        <Section title="Country">
          <div className="grid grid-cols-3 gap-3">
            <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <Input label="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
            <Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>
        </Section>
      )}

      {step === 'familyDetails' && (
        <Section title="Family details">
          <div className="grid grid-cols-3 gap-3">
            <Input label="Father's occupation" value={fatherOccupation} onChange={(e) => setFatherOccupation(e.target.value)} />
            <Input label="Mother's occupation" value={motherOccupation} onChange={(e) => setMotherOccupation(e.target.value)} />
            <Input
              label="Sibling count"
              type="number"
              min={0}
              value={siblingCount}
              onChange={(e) => setSiblingCount(Number(e.target.value))}
            />
          </div>

          <div className="mt-3 flex flex-col gap-2">
            {siblings.map((sibling, index) => (
              <div key={index} className="flex items-center gap-2 rounded-xl border border-border-strong p-2.5">
                <Select
                  value={sibling.relationship}
                  onChange={(e) => updateSibling(index, { relationship: e.target.value })}
                  className="flex-1"
                >
                  {SIBLING_RELATIONSHIP_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
                <Select
                  value={sibling.maritalStatus}
                  onChange={(e) => updateSibling(index, { maritalStatus: e.target.value })}
                  className="flex-1"
                >
                  {MARITAL_STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
                <Input
                  placeholder="Occupation"
                  value={sibling.occupation ?? ''}
                  onChange={(e) => updateSibling(index, { occupation: e.target.value })}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeSibling(index)}
                  className="rounded-full p-1.5 text-ink-faint hover:bg-surface-sunken hover:text-danger"
                  aria-label="Remove sibling"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <Button size="sm" variant="secondary" onClick={addSibling} className="self-start">
              Add sibling
            </Button>
          </div>
        </Section>
      )}

      {step === 'otherDetails' && (
        <Section title="Other details">
          <div className="grid grid-cols-3 gap-3">
            <Select label="Assets" value={assetsStatus} onChange={(e) => setAssetsStatus(e.target.value)}>
              {ASSETS_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <Select label="Smoking" value={smoking} onChange={(e) => setSmoking(e.target.value)}>
              {LIFESTYLE_HABIT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <Select label="Alcohol" value={alcohol} onChange={(e) => setAlcohol(e.target.value)}>
              {LIFESTYLE_HABIT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
        </Section>
      )}

      {step === 'hobbiesInterests' && (
        <Section title="Hobbies & interests">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Hobbies (comma separated)" value={hobbies} onChange={(e) => setHobbies(e.target.value)} />
            <Input label="Interests (comma separated)" value={interests} onChange={(e) => setInterests(e.target.value)} />
          </div>
        </Section>
      )}

      {step === 'verification' && (
        <Section title="Verification & status">
          <div className="grid grid-cols-3 gap-2">
            <Checkbox label="Phone verified" checked={phoneVerified} onChange={(e) => setPhoneVerified(e.target.checked)} />
            <Checkbox label="Email verified" checked={emailVerified} onChange={(e) => setEmailVerified(e.target.checked)} />
            <Checkbox label="Identity verified" checked={identityVerified} onChange={(e) => setIdentityVerified(e.target.checked)} />
            <Checkbox label="Photo verified" checked={photoVerified} onChange={(e) => setPhotoVerified(e.target.checked)} />
            <Checkbox
              label="Profession verified"
              checked={professionVerified}
              onChange={(e) => setProfessionVerified(e.target.checked)}
            />
            <Checkbox
              label="Education verified"
              checked={educationVerified}
              onChange={(e) => setEducationVerified(e.target.checked)}
            />
          </div>
        </Section>
      )}

      {error && <p className="rounded-lg bg-danger-tint px-3 py-2 text-sm text-danger">{error}</p>}
      {saved && !error && <p className="rounded-lg bg-success-tint px-3 py-2 text-sm text-success">Changes saved.</p>}

      <div className="flex items-center justify-between border-t border-border-strong pt-4">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            disabled={stepIndex === 0}
            onClick={() => setStep(WIZARD_STEPS[stepIndex - 1].key)}
          >
            Back
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={stepIndex === WIZARD_STEPS.length - 1}
            onClick={() => setStep(WIZARD_STEPS[stepIndex + 1].key)}
          >
            Next
          </Button>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button loading={isSaving} onClick={onSave}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-t border-border-strong pt-4">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}

function CreateUserModal({ onClose }: { onClose: () => void }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState<string[]>(['Admin']);
  const [error, setError] = useState<string | null>(null);

  const { data: allRoles } = useAdminListRolesQuery();
  const [createUser, { isLoading }] = useAdminCreateUserMutation();

  const toggleRole = (name: string) => {
    setRoles((prev) => (prev.includes(name) ? prev.filter((r) => r !== name) : [...prev, name]));
  };

  const canSave = firstName.trim() && lastName.trim() && email.trim() && password.length >= 6;

  const onSave = async () => {
    setError(null);
    try {
      await createUser({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password, roles }).unwrap();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create this account.');
    }
  };

  return (
    <Modal open onClose={onClose} title="Add admin">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="At least 6 characters"
        />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">Roles</span>
          <div className="flex flex-wrap gap-2">
            {(allRoles ?? []).map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => toggleRole(role.name)}
                className={
                  roles.includes(role.name)
                    ? 'flex items-center gap-1 rounded-full bg-linear-to-r from-primary-light to-primary px-3 py-1.5 text-xs font-semibold text-ink'
                    : 'flex items-center gap-1 rounded-full border border-border-strong px-3 py-1.5 text-xs font-semibold text-ink-muted hover:border-primary-dark'
                }
              >
                {roles.includes(role.name) && <ShieldCheck size={12} />}
                {role.name}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="rounded-lg bg-danger-tint px-3 py-2 text-sm text-danger">{error}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={isLoading} disabled={!canSave} onClick={onSave}>
            Create account
          </Button>
        </div>
      </div>
    </Modal>
  );
}
