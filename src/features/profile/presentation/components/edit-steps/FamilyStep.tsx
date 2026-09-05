'use client';

import { Plus, Trash2 } from 'lucide-react';

import { MARITAL_STATUS_OPTIONS, SIBLING_RELATIONSHIP_OPTIONS } from '../../../domain/entities/ProfileEnums';
import { Input, Select } from '../../../../../shared/components';
import type { SiblingUpdate } from '../../../domain/entities/Profile';

interface FamilyValue {
  fatherOccupation?: string;
  motherOccupation?: string;
  siblingCount?: number;
  siblings?: SiblingUpdate[];
}

export function FamilyStep({ value, onChange }: { value: FamilyValue; onChange: (patch: FamilyValue) => void }) {
  const siblings = value.siblings ?? [];

  const updateSibling = (index: number, patch: Partial<SiblingUpdate>) => {
    const next = siblings.map((s, i) => (i === index ? { ...s, ...patch } : s));
    onChange({ siblings: next });
  };

  const addSibling = () => {
    onChange({ siblings: [...siblings, { relationship: 'olderBrother', maritalStatus: 'neverMarried' }] });
  };

  const removeSibling = (index: number) => onChange({ siblings: siblings.filter((_, i) => i !== index) });

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Father's Occupation"
          value={value.fatherOccupation ?? ''}
          onChange={(e) => onChange({ fatherOccupation: e.target.value })}
        />
        <Input
          label="Mother's Occupation"
          value={value.motherOccupation ?? ''}
          onChange={(e) => onChange({ motherOccupation: e.target.value })}
        />
        <Input
          label="Number of Siblings"
          type="number"
          min={0}
          value={value.siblingCount ?? 0}
          onChange={(e) => onChange({ siblingCount: Number(e.target.value) })}
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-ink">Sibling Details</h4>
          <button type="button" onClick={addSibling} className="flex items-center gap-1 text-sm font-semibold text-primary-dark hover:underline">
            <Plus size={14} /> Add sibling
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {siblings.map((sibling, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 rounded-xl bg-surface-sunken p-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
              <Select
                value={sibling.relationship}
                onChange={(e) => updateSibling(i, { relationship: e.target.value as SiblingUpdate['relationship'] })}
              >
                {SIBLING_RELATIONSHIP_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
              <Select
                value={sibling.maritalStatus}
                onChange={(e) => updateSibling(i, { maritalStatus: e.target.value as SiblingUpdate['maritalStatus'] })}
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
                onChange={(e) => updateSibling(i, { occupation: e.target.value })}
              />
              <button
                type="button"
                onClick={() => removeSibling(i)}
                className="flex items-center justify-center rounded-xl text-danger hover:bg-danger-tint sm:px-3"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
