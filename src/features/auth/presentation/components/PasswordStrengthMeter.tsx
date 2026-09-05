'use client';

import { cn } from '../../../../shared/utils/cn';

function scorePassword(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

const LABELS = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
const COLORS = ['bg-danger', 'bg-danger', 'bg-primary-dark', 'bg-primary', 'bg-success'];

export function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const score = scorePassword(password);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn('h-1.5 flex-1 rounded-full bg-surface-sunken transition-colors', i < score && COLORS[score])}
          />
        ))}
      </div>
      <p className="text-xs text-ink-muted">{LABELS[score]}</p>
    </div>
  );
}
