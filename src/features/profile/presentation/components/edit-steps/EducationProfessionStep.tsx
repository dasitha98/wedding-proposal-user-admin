'use client';

import { EDUCATION_STATUS_OPTIONS, INCOME_RANGE_OPTIONS, JOB_STATUS_OPTIONS, QUALIFICATION_STATUS_OPTIONS } from '../../../domain/entities/ProfileEnums';
import { JOB_TITLES } from '../../../../discover/domain/entities/FilterOptions';
import { Select } from '../../../../../shared/components';
import type { Education, Profession } from '../../../domain/entities/Profile';

interface Props {
  education: Partial<Education>;
  profession: Partial<Profession>;
  onEducationChange: (patch: Partial<Education>) => void;
  onProfessionChange: (patch: Partial<Profession>) => void;
}

export function EducationProfessionStep({ education, profession, onEducationChange, onProfessionChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Select
        label="Highest Education"
        value={education.qualification ?? ''}
        onChange={(e) => onEducationChange({ qualification: e.target.value as Education['qualification'] })}
      >
        <option value="" disabled>
          Select education
        </option>
        {EDUCATION_STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>

      <Select
        label="Education Status"
        value={education.qualificationStatus ?? ''}
        onChange={(e) => onEducationChange({ qualificationStatus: e.target.value as Education['qualificationStatus'] })}
      >
        <option value="" disabled>
          Select status
        </option>
        {QUALIFICATION_STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>

      <Select
        label="Job Status"
        value={profession.jobStatus ?? ''}
        onChange={(e) => onProfessionChange({ jobStatus: e.target.value as Profession['jobStatus'] })}
      >
        <option value="" disabled>
          Select job status
        </option>
        {JOB_STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>

      <Select label="Occupation" value={profession.occupation ?? ''} onChange={(e) => onProfessionChange({ occupation: e.target.value })}>
        <option value="" disabled>
          Select occupation
        </option>
        {JOB_TITLES.map((j) => (
          <option key={j} value={j}>
            {j}
          </option>
        ))}
      </Select>

      <Select
        label="Income Range"
        value={profession.incomeRange ?? ''}
        onChange={(e) => onProfessionChange({ incomeRange: e.target.value as Profession['incomeRange'] })}
      >
        <option value="" disabled>
          Select income range
        </option>
        {INCOME_RANGE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
