import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '../../../../shared/components';

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function AdminPagination({ page, totalPages, totalCount, onPageChange }: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-1 pt-4">
      <p className="text-xs text-ink-muted">
        Page {page} of {totalPages} &middot; {totalCount} total
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft size={16} />
          Prev
        </Button>
        <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
