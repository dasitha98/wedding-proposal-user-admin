'use client';

import { Textarea } from '../../../../../shared/components';

export function AboutMeStep({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Textarea
      label="About Me"
      placeholder="Tell potential matches a little about yourself, your values, and what you're looking for..."
      value={value}
      maxLength={1000}
      rows={8}
      hint={`${value.length}/1000`}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
