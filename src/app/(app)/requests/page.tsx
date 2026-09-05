'use client';

import { useState } from 'react';

import { useGetReceivedRequestsQuery, useGetSentRequestsQuery } from '../../../features/profile/data/api/profileApi';
import { RequestListItem } from '../../../features/requests/presentation/components/RequestListItem';
import { EmptyState, ErrorState } from '../../../shared/components/EmptyState';
import { Skeleton } from '../../../shared/components/Skeleton';
import { Tabs } from '../../../shared/components/Tabs';

export default function RequestsPage() {
  const [tab, setTab] = useState<'received' | 'sent'>('received');

  const received = useGetReceivedRequestsQuery();
  const sent = useGetSentRequestsQuery();

  const active = tab === 'received' ? received : sent;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Connection Requests</h1>
        <p className="mt-1 text-sm text-ink-muted">Manage the connections you&apos;ve sent and received.</p>
      </div>

      <Tabs
        items={[
          { value: 'received', label: 'Received', badge: received.data?.filter((r) => r.status === 'pending').length },
          { value: 'sent', label: 'Sent' },
        ]}
        value={tab}
        onChange={(v) => setTab(v as 'received' | 'sent')}
      />

      {active.error ? (
        <ErrorState message="We couldn't load your requests." onRetry={active.refetch} />
      ) : active.isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : !active.data || active.data.length === 0 ? (
        <EmptyState
          title={tab === 'received' ? 'No requests received yet' : 'No requests sent yet'}
          description={
            tab === 'received'
              ? 'When someone sends you a connection request, it will show up here.'
              : 'Requests you send to other profiles will appear here.'
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {active.data.map((request) => (
            <RequestListItem key={request.id} request={request} direction={tab} />
          ))}
        </div>
      )}
    </div>
  );
}
