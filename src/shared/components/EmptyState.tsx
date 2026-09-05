import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border-strong bg-surface/60 px-6 py-16 text-center">
      {icon && <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-primary-tint text-primary-dark">{icon}</div>}
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; action?: ReactNode; onRetry?: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-danger/20 bg-danger-tint px-6 py-16 text-center">
      <h3 className="font-display text-lg font-semibold text-ink">Something went wrong</h3>
      <p className="max-w-sm text-sm text-ink-muted">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 text-sm font-semibold text-primary-dark hover:underline">
          Try again
        </button>
      )}
    </div>
  );
}
