'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

import { useDiscoverQuery } from '../../features/discover/data/api/discoverApi';
import { getActiveFilterCount } from '../../features/discover/domain/entities/DiscoverFilters';
import { FilterDrawer } from '../../features/discover/presentation/components/FilterDrawer';
import { ProfileCard } from '../../features/discover/presentation/components/ProfileCard';
import { useDiscoverFilters } from '../../features/discover/presentation/hooks/useDiscoverFilters';
import { useAuthGate } from '../../features/auth/presentation/context/AuthGateContext';
import { useProfileGate } from '../../features/profile/presentation/context/ProfileGateContext';
import { Button } from '../../shared/components';
import { EmptyState, ErrorState } from '../../shared/components/EmptyState';
import { Skeleton } from '../../shared/components/Skeleton';

const PAGE_SIZE = 14;

export default function DiscoverPage() {
  const { requireAuth } = useAuthGate();
  const { requireProfile } = useProfileGate();
  const { filters, draft, setDraft, openDraft, applyDraft, resetDraft, clearFilters } = useDiscoverFilters();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isFetching, isLoading, error, refetch } = useDiscoverQuery({ ...filters, page, pageSize: PAGE_SIZE });
  const activeFilterCount = getActiveFilterCount(filters);

  const handleApplyFilters = () => {
    setPage(1);
    applyDraft();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Discover</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {data ? `${data.totalCount} profile${data.totalCount === 1 ? '' : 's'} match your search` : 'Browse profiles curated for you'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                clearFilters();
                setPage(1);
              }}
              className="flex items-center gap-1 text-sm font-semibold text-ink-muted hover:text-danger"
            >
              <X size={14} /> Clear filters
            </button>
          )}
          <Button
            variant="secondary"
            onClick={() =>
              requireAuth(() =>
                requireProfile(() => {
                  openDraft();
                  setDrawerOpen(true);
                })
              )
            }
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-ink">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {error ? (
        <ErrorState message="We couldn't load profiles right now." onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-3/5 w-full rounded-2xl" />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <EmptyState title="No profiles found" description="Try adjusting your filters to see more results." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.items.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>

          {page < data.totalPages && (
            <div className="flex justify-center py-4">
              <Button variant="secondary" loading={isFetching} onClick={() => setPage((p) => p + 1)}>
                Load more
              </Button>
            </div>
          )}
        </>
      )}

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        draft={draft}
        onChange={setDraft}
        onApply={handleApplyFilters}
        onReset={resetDraft}
      />
    </div>
  );
}
