'use client';

import { MessageCircle } from 'lucide-react';

import { useGetConversationsQuery } from '../../../features/messages/data/api/messagesApi';
import { ConversationListItem } from '../../../features/messages/presentation/components/ConversationListItem';
import { EmptyState, ErrorState } from '../../../shared/components/EmptyState';
import { Skeleton } from '../../../shared/components/Skeleton';

export default function MessagesPage() {
  const { data: conversations, isLoading, error, refetch } = useGetConversationsQuery();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Messages</h1>
        <p className="mt-1 text-sm text-ink-muted">Conversations with your connections.</p>
      </div>

      {error ? (
        <ErrorState message="We couldn't load your conversations." onRetry={refetch} />
      ) : isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : !conversations || conversations.length === 0 ? (
        <EmptyState
          icon={<MessageCircle size={22} />}
          title="No conversations yet"
          description="Once you connect with someone, your conversation will appear here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {conversations.map((c) => (
            <ConversationListItem key={c.profileId} conversation={c} />
          ))}
        </div>
      )}
    </div>
  );
}
