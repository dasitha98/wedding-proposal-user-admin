'use client';

import { GENDER_OPTIONS, MANAGED_BY_OPTIONS, MARITAL_STATUS_OPTIONS, type ManagedBy } from '../../../domain/entities/ProfileEnums';
import { RACES, RELIGIONS, CASTES } from '../../../../discover/domain/entities/FilterOptions';
import { Input, Select } from '../../../../../shared/components';
import type { BasicInfo } from '../../../domain/entities/Profile';

interface BasicInfoStepProps {
  value: Partial<Omit<BasicInfo, 'dateOfBirthMasked'>>;
  firstName?: string;
  lastName?: string;
  managedBy?: ManagedBy;
  onChange: (patch: Partial<Omit<BasicInfo, 'dateOfBirthMasked'>>) => void;
  onFirstNameChange: (firstName: string) => void;
  onLastNameChange: (lastName: string) => void;
  onManagedByChange: (managedBy: ManagedBy) => void;
}

export function BasicInfoStep({
  value,
  firstName,
  lastName,
  managedBy,
  onChange,
  onFirstNameChange,
  onLastNameChange,
  onManagedByChange,
}: BasicInfoStepProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input label="First Name" value={firstName ?? ''} onChange={(e) => onFirstNameChange(e.target.value)} />

      <Input label="Last Name" value={lastName ?? ''} onChange={(e) => onLastNameChange(e.target.value)} />

      <Select label="Gender" value={value.gender ?? ''} onChange={(e) => onChange({ gender: e.target.value as BasicInfo['gender'] })}>
        <option value="" disabled>
          Select gender
        </option>
        {GENDER_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>

      <Select label="Managed By" value={managedBy ?? ''} onChange={(e) => onManagedByChange(e.target.value as ManagedBy)}>
        <option value="" disabled>
          Select who manages this profile
        </option>
        {MANAGED_BY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>

      <Select label="Religion" value={value.religion ?? ''} onChange={(e) => onChange({ religion: e.target.value })}>
        <option value="" disabled>
          Select religion
        </option>
        {RELIGIONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </Select>

      <Select label="Ethnicity" value={value.race ?? ''} onChange={(e) => onChange({ race: e.target.value })}>
        <option value="" disabled>
          Select ethnicity
        </option>
        {RACES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </Select>

      <Select label="Caste" value={value.caste ?? ''} onChange={(e) => onChange({ caste: e.target.value })}>
        <option value="" disabled>
          Select caste
        </option>
        {CASTES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      <Select
        label="Marital Status"
        value={value.maritalStatus ?? ''}
        onChange={(e) => onChange({ maritalStatus: e.target.value as BasicInfo['maritalStatus'] })}
      >
        <option value="" disabled>
          Select marital status
        </option>
        {MARITAL_STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>

      <Input
        label="Height"
        placeholder={"e.g. 5' 8\""}
        value={value.heightLabel ?? ''}
        onChange={(e) => onChange({ heightLabel: e.target.value })}
      />
    </div>
  );
}
