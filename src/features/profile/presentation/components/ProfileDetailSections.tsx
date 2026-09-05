import {
  assetsStatusLabel,
  educationStatusLabel,
  genderLabel,
  incomeRangeLabel,
  jobStatusLabel,
  lifestyleHabitLabel,
  managedByLabel,
  maritalStatusLabel,
  qualificationStatusLabel,
  siblingRelationshipLabel,
} from '../../domain/entities/ProfileEnums';
import { Badge } from '../../../../shared/components/Badge';
import { InfoRow, Section } from '../../../../shared/components/Section';
import type { Profile } from '../../domain/entities/Profile';

export function ProfileDetailSections({ profile }: { profile: Profile }) {
  return (
    <div className="flex flex-col gap-5">
      {profile.aboutMe && (
        <Section title="About Me">
          <p className="text-sm leading-relaxed text-ink-muted">{profile.aboutMe}</p>
        </Section>
      )}

      <Section title="Basic Information">
        <InfoRow label="Gender" value={genderLabel(profile.basicInfo.gender)} />
        <InfoRow label="Date of Birth" value={profile.basicInfo.dateOfBirthMasked} />
        <InfoRow label="Height" value={profile.basicInfo.heightLabel} />
        <InfoRow label="Marital Status" value={maritalStatusLabel(profile.basicInfo.maritalStatus)} />
        <InfoRow label="Religion" value={profile.basicInfo.religion} />
        <InfoRow label="Ethnicity" value={profile.basicInfo.race} />
        <InfoRow label="Caste" value={profile.basicInfo.caste} />
        {profile.managedBy && <InfoRow label="Profile Managed By" value={managedByLabel(profile.managedBy)} />}
      </Section>

      <Section title="Education & Profession">
        <InfoRow label="Education" value={educationStatusLabel(profile.education.qualification)} />
        <InfoRow label="Status" value={qualificationStatusLabel(profile.education.qualificationStatus)} />
        <InfoRow label="Job Status" value={jobStatusLabel(profile.profession.jobStatus)} />
        <InfoRow label="Occupation" value={profile.profession.occupation} />
        <InfoRow label="Income Range" value={incomeRangeLabel(profile.profession.incomeRange)} />
      </Section>

      <Section title="Residency">
        <InfoRow label="Country" value={profile.residency.country} />
        <InfoRow label="District" value={profile.residency.district} />
        <InfoRow label="City" value={profile.residency.city} />
      </Section>

      <Section title="Family Details">
        <InfoRow label="Father's Occupation" value={profile.family.fatherOccupation} />
        <InfoRow label="Mother's Occupation" value={profile.family.motherOccupation} />
        <InfoRow label="Number of Siblings" value={profile.family.siblingCount} />
        {profile.family.siblings.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {profile.family.siblings.map((sibling, i) => (
              <div key={i} className="rounded-xl bg-surface-sunken px-3.5 py-2.5 text-sm">
                <span className="font-medium text-ink">{siblingRelationshipLabel(sibling.relationship)}</span>
                <span className="text-ink-muted"> · {maritalStatusLabel(sibling.maritalStatus)}</span>
                {sibling.occupation && <span className="text-ink-muted"> · {sibling.occupation}</span>}
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Other Details">
        <InfoRow label="Smoking" value={lifestyleHabitLabel(profile.lifestyle.smoking)} />
        <InfoRow label="Alcohol" value={lifestyleHabitLabel(profile.lifestyle.alcohol)} />
        <InfoRow label="Assets" value={assetsStatusLabel(profile.assets.status)} />
      </Section>

      {profile.hobbies.length > 0 && (
        <Section title="Hobbies">
          <div className="flex flex-wrap gap-2">
            {profile.hobbies.map((h) => (
              <Badge key={h} tone="neutral">
                {h}
              </Badge>
            ))}
          </div>
        </Section>
      )}

      {profile.interests.length > 0 && (
        <Section title="Looking For">
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((i) => (
              <Badge key={i} tone="gold">
                {i}
              </Badge>
            ))}
          </div>
        </Section>
      )}

      <Section title="Verification">
        <div className="flex flex-wrap gap-2">
          <Badge tone={profile.verification.identityVerified ? 'success' : 'neutral'}>Identity</Badge>
          <Badge tone={profile.verification.photoVerified ? 'success' : 'neutral'}>Photo</Badge>
          <Badge tone={profile.verification.phoneVerified ? 'success' : 'neutral'}>Phone</Badge>
          <Badge tone={profile.verification.emailVerified ? 'success' : 'neutral'}>Email</Badge>
          <Badge tone={profile.verification.professionVerified ? 'success' : 'neutral'}>Profession</Badge>
          <Badge tone={profile.verification.educationVerified ? 'success' : 'neutral'}>Education</Badge>
        </div>
      </Section>
    </div>
  );
}
