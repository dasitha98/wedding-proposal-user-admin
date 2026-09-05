'use client';

import { cn } from '../utils/cn';

interface TabItem {
  value: string;
  label: string;
  badge?: number;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ items, value, onChange, className }: TabsProps) {
  return (
    <div className={cn('inline-flex rounded-full border border-border-strong bg-surface p-1', className)}>
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={cn(
              'relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              active ? 'bg-ink text-white' : 'text-ink-muted hover:text-ink'
            )}
          >
            {item.label}
            {!!item.badge && (
              <span
                className={cn(
                  'flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs',
                  active ? 'bg-primary text-ink' : 'bg-primary-tint text-primary-dark'
                )}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
