'use client';

import { ASSETS_STATUS_OPTIONS, LIFESTYLE_HABIT_OPTIONS } from '../../../domain/entities/ProfileEnums';
import { Select } from '../../../../../shared/components';
import type { Assets, Lifestyle } from '../../../domain/entities/Profile';

interface Props {
  lifestyle: Partial<Lifestyle>;
  assets: Partial<Assets>;
  onLifestyleChange: (patch: Partial<Lifestyle>) => void;
  onAssetsChange: (patch: Partial<Assets>) => void;
}

export function LifestyleAssetsStep({ lifestyle, assets, onLifestyleChange, onAssetsChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Select label="Smoking" value={lifestyle.smoking ?? ''} onChange={(e) => onLifestyleChange({ smoking: e.target.value as Lifestyle['smoking'] })}>
        <option value="" disabled>
          Select an option
        </option>
        {LIFESTYLE_HABIT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>

      <Select label="Alcohol" value={lifestyle.alcohol ?? ''} onChange={(e) => onLifestyleChange({ alcohol: e.target.value as Lifestyle['alcohol'] })}>
        <option value="" disabled>
          Select an option
        </option>
        {LIFESTYLE_HABIT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>

      <Select label="Assets" value={assets.status ?? ''} onChange={(e) => onAssetsChange({ status: e.target.value as Assets['status'] })}>
        <option value="" disabled>
          Select an option
        </option>
        {ASSETS_STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
