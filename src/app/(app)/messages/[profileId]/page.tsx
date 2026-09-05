'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { use, useEffect, useRef } from 'react';

import { useAuth } from '../../../../features/auth/presentation/hooks/useAuth';
import { useGetConversationQuery, useGetConversationsQuery, useSendMessageMutation } from '../../../../features/messages/data/api/messagesApi';
import { ChatComposer } from '../../../../features/messages/presentation/components/ChatComposer';
import { MessageBubble } from '../../../../features/messages/presentation/components/MessageBubble';
import { Avatar } from '../../../../shared/components';
import { ErrorState } from '../../../../shared/components/EmptyState';
import { FullPageSpinner } from '../../../../shared/components/Spinner';

export default function ChatPage({ params }: { params: Promise<{ profileId: string }> }) {
  const { profileId } = use(params);
  const { user } = useAuth();
  const { data: conversations } = useGetConversationsQuery();
  const conversation = conversations?.find((c) => c.profileId === profileId);

  const { data, isLoading, error, refetch } = useGetConversationQuery(
    { profileId, currentUserId: user?.id ?? '' },
    { skip: !user }
  );
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ block: 'end' });
  }, [data?.messages.length]);

  const handleSend = (text: string) => {
    if (!user) return;
    sendMessage({ profileId, text, currentUserId: user.id });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card md:h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-3 border-b border-border p-4">
        <Link href="/messages" className="rounded-full p-1.5 text-ink-muted hover:bg-surface-sunken md:hidden">
          <ArrowLeft size={18} />
        </Link>
        <Avatar src={conversation?.profile.photo} name={conversation?.profile.name ?? 'Conversation'} size={40} />
        <div>
          <p className="font-semibold text-ink">{conversation?.profile.name ?? 'Conversation'}</p>
          <p className="text-xs text-ink-muted">Active now</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <FullPageSpinner />
        ) : error ? (
          <ErrorState message="We couldn't load this conversation." onRetry={refetch} />
        ) : (
          <div className="flex flex-col gap-3">
            {data?.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={scrollRef} />
          </div>
        )}
      </div>

      <ChatComposer onSend={handleSend} sending={isSending} />
    </div>
  );
}
