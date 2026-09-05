'use client';

import { COUNTRIES, SRI_LANKA, SRI_LANKA_DISTRICTS, SRI_LANKA_DISTRICT_CITIES } from '../../../../discover/domain/entities/FilterOptions';
import { Input, Select } from '../../../../../shared/components';
import type { Residency } from '../../../domain/entities/Profile';

export function ResidencyStep({ value, onChange }: { value: Partial<Residency>; onChange: (patch: Partial<Residency>) => void }) {
  const isSriLanka = value.country === SRI_LANKA;
  const cities = value.district ? (SRI_LANKA_DISTRICT_CITIES[value.district] ?? []) : [];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Select
        label="Country"
        value={value.country ?? ''}
        onChange={(e) => onChange({ country: e.target.value, district: '', city: '' })}
      >
        <option value="" disabled>
          Select country
        </option>
        {COUNTRIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      {isSriLanka ? (
        <>
          <Select label="District" value={value.district ?? ''} onChange={(e) => onChange({ district: e.target.value, city: '' })}>
            <option value="" disabled>
              Select district
            </option>
            {SRI_LANKA_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
          <Select label="City" value={value.city ?? ''} disabled={cities.length === 0} onChange={(e) => onChange({ city: e.target.value })}>
            <option value="" disabled>
              Select city
            </option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </>
      ) : (
        <>
          <Input label="District / State" value={value.district ?? ''} onChange={(e) => onChange({ district: e.target.value })} />
          <Input label="City" value={value.city ?? ''} onChange={(e) => onChange({ city: e.target.value })} />
        </>
      )}
    </div>
  );
}
