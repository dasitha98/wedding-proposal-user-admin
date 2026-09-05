'use client';

import { ChevronDown } from 'lucide-react';
import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react';

import { cn } from '../utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, label, error, id, children, ...props },
  ref
) {
  const selectId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'h-11 w-full appearance-none rounded-xl border bg-surface px-3.5 pr-10 text-sm text-ink',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-primary-dark/40',
            error ? 'border-danger' : 'border-border-strong focus:border-primary-dark',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
});
