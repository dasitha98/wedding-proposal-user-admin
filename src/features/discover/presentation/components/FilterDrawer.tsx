'use client';

import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS } from '../../../profile/domain/entities/ProfileEnums';
import { Button, Checkbox, Chip, Select } from '../../../../shared/components';
import { Modal } from '../../../../shared/components/Modal';
import {
  CASTES,
  COUNTRIES,
  JOB_TITLES,
  MAX_AGE,
  MIN_AGE,
  RACES,
  RELIGIONS,
  SORT_OPTIONS,
  SRI_LANKA,
  SRI_LANKA_DISTRICTS,
  SRI_LANKA_DISTRICT_CITIES,
} from '../../domain/entities/FilterOptions';
import type { DiscoverFilters } from '../../domain/entities/DiscoverFilters';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  draft: DiscoverFilters;
  onChange: (draft: DiscoverFilters) => void;
  onApply: () => void;
  onReset: () => void;
}

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function FilterDrawer({ open, onClose, draft, onChange, onApply, onReset }: FilterDrawerProps) {
  const cities = draft.district ? (SRI_LANKA_DISTRICT_CITIES[draft.district] ?? []) : [];

  return (
    <Modal open={open} onClose={onClose} title="Filter profiles" className="max-w-2xl">
      <div className="flex max-h-[65vh] flex-col gap-6 overflow-y-auto pr-1">
        <section>
          <h4 className="mb-2 text-sm font-semibold text-ink">Sort by</h4>
          <Select
            value={draft.sortBy}
            onChange={(e) => onChange({ ...draft, sortBy: e.target.value as DiscoverFilters['sortBy'] })}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </section>

        <section>
          <h4 className="mb-2 text-sm font-semibold text-ink">
            Age range: {draft.ageRange[0]} – {draft.ageRange[1]}
          </h4>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={MIN_AGE}
              max={draft.ageRange[1]}
              value={draft.ageRange[0]}
              onChange={(e) => onChange({ ...draft, ageRange: [Number(e.target.value), draft.ageRange[1]] })}
              className="w-full accent-primary-dark"
            />
            <input
              type="range"
              min={draft.ageRange[0]}
              max={MAX_AGE}
              value={draft.ageRange[1]}
              onChange={(e) => onChange({ ...draft, ageRange: [draft.ageRange[0], Number(e.target.value)] })}
              className="w-full accent-primary-dark"
            />
          </div>
        </section>

        <section>
          <h4 className="mb-2 text-sm font-semibold text-ink">Gender</h4>
          <div className="flex flex-wrap gap-2">
            {GENDER_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                selected={draft.genders.includes(opt.value)}
                onClick={() => onChange({ ...draft, genders: toggleValue(draft.genders, opt.value) })}
              >
                {opt.label}
              </Chip>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            label="Country"
            value={draft.country ?? ''}
            onChange={(e) => onChange({ ...draft, country: e.target.value || null, district: null, city: null })}
          >
            <option value="">Any country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select
            label="District"
            value={draft.district ?? ''}
            disabled={draft.country !== SRI_LANKA}
            onChange={(e) => onChange({ ...draft, district: e.target.value || null, city: null })}
          >
            <option value="">Any district</option>
            {SRI_LANKA_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
          <Select
            label="City"
            value={draft.city ?? ''}
            disabled={cities.length === 0}
            onChange={(e) => onChange({ ...draft, city: e.target.value || null })}
          >
            <option value="">Any city</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </section>

        <section>
          <h4 className="mb-2 text-sm font-semibold text-ink">Religion</h4>
          <div className="flex flex-wrap gap-2">
            {RELIGIONS.map((r) => (
              <Chip key={r} selected={draft.religions.includes(r)} onClick={() => onChange({ ...draft, religions: toggleValue(draft.religions, r) })}>
                {r}
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <h4 className="mb-2 text-sm font-semibold text-ink">Ethnicity</h4>
          <div className="flex flex-wrap gap-2">
            {RACES.map((r) => (
              <Chip key={r} selected={draft.races.includes(r)} onClick={() => onChange({ ...draft, races: toggleValue(draft.races, r) })}>
                {r}
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <h4 className="mb-2 text-sm font-semibold text-ink">Caste</h4>
          <div className="flex flex-wrap gap-2">
            {CASTES.map((c) => (
              <Chip key={c} selected={draft.castes.includes(c)} onClick={() => onChange({ ...draft, castes: toggleValue(draft.castes, c) })}>
                {c}
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <h4 className="mb-2 text-sm font-semibold text-ink">Marital status</h4>
          <div className="flex flex-wrap gap-2">
            {MARITAL_STATUS_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                selected={draft.maritalStatuses.includes(opt.value)}
                onClick={() => onChange({ ...draft, maritalStatuses: toggleValue(draft.maritalStatuses, opt.value) })}
              >
                {opt.label}
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <Select label="Profession" value={draft.jobTitle ?? ''} onChange={(e) => onChange({ ...draft, jobTitle: e.target.value || null })}>
            <option value="">Any profession</option>
            {JOB_TITLES.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </Select>
        </section>

        <section className="flex flex-col gap-3">
          <Checkbox label="Living abroad only" checked={draft.onlyForeign} onChange={(e) => onChange({ ...draft, onlyForeign: e.target.checked })} />
          <Checkbox label="Gold members only" checked={draft.onlyGold} onChange={(e) => onChange({ ...draft, onlyGold: e.target.checked })} />
          <Checkbox label="Only with photos" checked={draft.onlyWithPhotos} onChange={(e) => onChange({ ...draft, onlyWithPhotos: e.target.checked })} />
        </section>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
        <button onClick={onReset} className="text-sm font-semibold text-ink-muted hover:text-ink">
          Clear all
        </button>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onApply();
              onClose();
            }}
          >
            Show results
          </Button>
        </div>
      </div>
    </Modal>
  );
}
