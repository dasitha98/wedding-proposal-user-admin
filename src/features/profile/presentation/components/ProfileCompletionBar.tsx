'use client';

import { Loader2 } from 'lucide-react';

interface ProfileCompletionBarProps {
  label: string;
  /** Fraction of required fields completed, 0-1. Always reflected live in the fill + percentage. */
  progress: number;
  /** Caller decides pressability — e.g. disabled while there's nothing unsaved to save. */
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}

/** Save button that doubles as a profile-completion progress bar, mirroring the mobile app's equivalent. */
export function ProfileCompletionBar({ label, progress, disabled = false, loading = false, onClick }: ProfileCompletionBarProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  const isComplete = clamped >= 1;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="relative h-13 w-full overflow-hidden rounded-full bg-surface-sunken transition-opacity disabled:opacity-50"
    >
      <div
        className="absolute inset-y-0 left-0 bg-linear-to-r from-primary-light to-primary transition-[width] duration-300"
        style={{ width: `${clamped * 100}%` }}
      />
      <span className="relative flex h-full items-center justify-center gap-2 text-sm font-semibold">
        {loading ? (
          <Loader2 className="animate-spin text-ink" size={16} />
        ) : (
          <span className={isComplete ? 'text-ink' : 'text-ink-muted'}>
            {isComplete ? label : `${label} · ${Math.round(clamped * 100)}%`}
          </span>
        )}
      </span>
    </button>
  );
}
