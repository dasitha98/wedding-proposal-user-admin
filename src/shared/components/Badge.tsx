import type { ReactNode } from 'react';

import { cn } from '../utils/cn';

type Tone = 'gold' | 'neutral' | 'success' | 'danger' | 'ink';

const toneClasses: Record<Tone, string> = {
  gold: 'bg-linear-to-r from-primary-light to-primary text-ink',
  neutral: 'bg-surface-sunken text-ink-muted',
  success: 'bg-success-tint text-success',
  danger: 'bg-danger-tint text-danger',
  ink: 'bg-ink text-white',
};

export function Badge({ tone = 'neutral', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
