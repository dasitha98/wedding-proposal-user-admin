import type { ReactNode } from 'react';

import { Card } from './Card';

export function Section({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
        {action}
      </div>
      {children}
    </Card>
  );
}

export function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-0 last:pb-0">
      <span className="text-sm text-ink-muted">{label}</span>
      <span className="text-right text-sm font-medium text-ink">{value}</span>
    </div>
  );
}
