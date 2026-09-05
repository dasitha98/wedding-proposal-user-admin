'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';

import { Chip } from './Chip';

interface TagPickerProps {
  pool: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}

export function TagPicker({ pool, selected, onChange }: TagPickerProps) {
  const [customTag, setCustomTag] = useState('');
  const options = Array.from(new Set([...pool, ...selected]));

  const toggle = (tag: string) => {
    onChange(selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag]);
  };

  const addCustom = () => {
    const tag = customTag.trim();
    if (tag && !selected.includes(tag)) onChange([...selected, tag]);
    setCustomTag('');
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {options.map((tag) => (
          <Chip key={tag} selected={selected.includes(tag)} onClick={() => toggle(tag)}>
            {tag}
            {selected.includes(tag) && <X size={12} className="ml-1.5" />}
          </Chip>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder="Add your own..."
          className="h-10 flex-1 rounded-xl border border-border-strong bg-surface px-3.5 text-sm text-ink placeholder:text-ink-faint focus:border-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark/40"
        />
        <button
          type="button"
          onClick={addCustom}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-strong text-ink-muted hover:border-primary-dark hover:text-primary-dark"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
