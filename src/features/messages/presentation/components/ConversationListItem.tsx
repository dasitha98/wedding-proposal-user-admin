import Link from 'next/link';

import { Avatar, Badge } from '../../../../shared/components';
import { formatRelativeTime } from '../../../../shared/utils/formatRelativeTime';
import type { ConversationSummary } from '../../domain/entities/ConversationSummary';

export function ConversationListItem({ conversation }: { conversation: ConversationSummary }) {
  return (
    <Link
      href={`/messages/${conversation.profileId}`}
      className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-card transition-colors hover:border-primary-dark"
    >
      <Avatar src={conversation.profile.photo} name={conversation.profile.name} size={52} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold text-ink">{conversation.profile.name}</p>
          {conversation.profile.isGold && <Badge tone="gold">Gold</Badge>}
        </div>
        <p className="truncate text-sm text-ink-muted">
          {conversation.isLastMessageMine && conversation.lastMessageText && 'You: '}
          {conversation.lastMessageText ?? 'Say hello!'}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        {conversation.lastMessageAt && <span className="text-xs text-ink-faint">{formatRelativeTime(conversation.lastMessageAt)}</span>}
        {conversation.unreadCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-ink">
            {conversation.unreadCount}
          </span>
        )}
      </div>
    </Link>
  );
}
