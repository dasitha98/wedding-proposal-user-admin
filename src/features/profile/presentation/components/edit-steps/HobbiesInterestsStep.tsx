'use client';

import { HOBBIES_POOL, INTERESTS_POOL } from '../../../domain/constants/tagPools';
import { TagPicker } from '../../../../../shared/components/TagPicker';

interface Props {
  hobbies: string[];
  interests: string[];
  onHobbiesChange: (hobbies: string[]) => void;
  onInterestsChange: (interests: string[]) => void;
}

export function HobbiesInterestsStep({ hobbies, interests, onHobbiesChange, onInterestsChange }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h4 className="mb-3 text-sm font-semibold text-ink">Hobbies</h4>
        <TagPicker pool={HOBBIES_POOL} selected={hobbies} onChange={onHobbiesChange} />
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold text-ink">Looking For</h4>
        <TagPicker pool={INTERESTS_POOL} selected={interests} onChange={onInterestsChange} />
      </div>
    </div>
  );
}
