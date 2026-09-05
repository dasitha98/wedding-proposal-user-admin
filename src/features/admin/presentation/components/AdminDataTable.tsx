import type { ReactNode } from 'react';

import { EmptyState, Skeleton } from '../../../../shared/components';

export interface AdminColumn<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface AdminDataTableProps<T> {
  columns: AdminColumn<T>[];
  rows: T[];
  keyFn: (row: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function AdminDataTable<T>({
  columns,
  rows,
  keyFn,
  isLoading,
  emptyTitle = 'Nothing here yet',
  emptyDescription,
}: AdminDataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <div className="flex flex-col gap-3 p-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-sunken/60">
              {columns.map((col) => (
                <th key={col.header} className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={keyFn(row)} className="border-b border-border last:border-0 hover:bg-surface-sunken/40">
                {columns.map((col) => (
                  <td key={col.header} className={`whitespace-nowrap px-5 py-3.5 text-ink ${col.className ?? ''}`}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
