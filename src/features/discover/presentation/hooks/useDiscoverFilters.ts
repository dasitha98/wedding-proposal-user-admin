import { useState } from 'react';

import { DEFAULT_FILTERS, type DiscoverFilters } from '../../domain/entities/DiscoverFilters';

export function useDiscoverFilters() {
  const [filters, setFilters] = useState<DiscoverFilters>(DEFAULT_FILTERS);
  const [draft, setDraft] = useState<DiscoverFilters>(DEFAULT_FILTERS);

  const openDraft = () => setDraft(filters);
  const applyDraft = () => setFilters(draft);
  const resetDraft = () => setDraft(DEFAULT_FILTERS);
  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setDraft(DEFAULT_FILTERS);
  };

  return { filters, draft, setDraft, openDraft, applyDraft, resetDraft, clearFilters };
}
