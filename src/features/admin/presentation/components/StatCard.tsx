import type { LucideIcon } from 'lucide-react';

import { Card } from '../../../../shared/components';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: 'gold' | 'ink';
}

export function StatCard({ label, value, icon: Icon, tone = 'gold' }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div
        className={
          tone === 'gold'
            ? 'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary-light to-primary text-ink shadow-glow'
            : 'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-white'
        }
      >
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</p>
        <p className="font-display text-2xl font-semibold text-ink">{value}</p>
      </div>
    </Card>
  );
}
