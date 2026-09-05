import type { ReactNode } from 'react';

import { cn } from '../utils/cn';

interface ChipProps {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function Chip({ selected = false, onClick, children, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
        selected
          ? 'border-primary-dark bg-primary-tint text-ink'
          : 'border-border-strong bg-surface text-ink-muted hover:border-primary-dark hover:text-ink',
        className
      )}
    >
      {children}
    </button>
  );
}
