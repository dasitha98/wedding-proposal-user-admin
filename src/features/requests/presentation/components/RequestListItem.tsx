'use client';

import { Check, X } from 'lucide-react';
import Link from 'next/link';

import { useAcceptRequestMutation, useCancelRequestMutation, useDeclineRequestMutation } from '../../../profile/data/api/profileApi';
import { Avatar, Badge, Button } from '../../../../shared/components';
import { formatRelativeTime } from '../../../../shared/utils/formatRelativeTime';
import type { ConnectionRequest } from '../../domain/entities/ConnectionRequest';

export function RequestListItem({ request, direction }: { request: ConnectionRequest; direction: 'received' | 'sent' }) {
  const [accept, { isLoading: isAccepting }] = useAcceptRequestMutation();
  const [decline, { isLoading: isDeclining }] = useDeclineRequestMutation();
  const [cancel, { isLoading: isCancelling }] = useCancelRequestMutation();

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-card">
      <Link href={`/profiles/${request.profile.id}`} className="flex flex-1 items-center gap-4 min-w-0">
        <Avatar src={request.profile.photo} name={request.profile.name} size={52} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-ink">
              {request.profile.name}, {request.profile.age}
            </p>
            {request.profile.isGold && <Badge tone="gold">Gold</Badge>}
          </div>
          <p className="truncate text-sm text-ink-muted">
            {request.profile.city} · {formatRelativeTime(request.createdAt)}
          </p>
        </div>
      </Link>

      <div className="flex shrink-0 gap-2">
        {direction === 'received' ? (
          <>
            <Button size="sm" variant="secondary" loading={isDeclining} onClick={() => decline(request.id)}>
              <X size={15} /> Decline
            </Button>
            <Button size="sm" loading={isAccepting} onClick={() => accept(request.id)}>
              <Check size={15} /> Accept
            </Button>
          </>
        ) : (
          <Button size="sm" variant="secondary" loading={isCancelling} onClick={() => cancel(request.profile.id)}>
            <X size={15} /> Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
