'use client';

import { Check } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

import { cn } from '../utils/cn';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function Checkbox({ className, label, checked, ...props }: CheckboxProps) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 select-none">
      <span className="relative inline-flex">
        <input type="checkbox" checked={checked} className="peer sr-only" {...props} />
        <span
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-md border-2 border-border-strong bg-surface transition-colors',
            'peer-checked:border-primary-dark peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary-dark/40',
            className
          )}
        >
          {checked && <Check size={14} strokeWidth={3} className="text-ink" />}
        </span>
      </span>
      {label && <span className="text-sm text-ink">{label}</span>}
    </label>
  );
}
