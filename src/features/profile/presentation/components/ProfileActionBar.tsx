'use client';

import { Heart, MessageCircle, Send, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useCancelRequestMutation, useSendRequestMutation, useToggleFavouriteMutation } from '../../data/api/profileApi';
import { useAuthGate } from '../../../auth/presentation/context/AuthGateContext';
import { Button } from '../../../../shared/components';
import { cn } from '../../../../shared/utils/cn';
import type { Profile } from '../../domain/entities/Profile';
import { useProfileGate } from '../context/ProfileGateContext';

export function ProfileActionBar({ profile }: { profile: Profile }) {
  const router = useRouter();
  const { requireAuth } = useAuthGate();
  const { requireProfile } = useProfileGate();
  const [sendRequest, { isLoading: isSending }] = useSendRequestMutation();
  const [cancelRequest, { isLoading: isCancelling }] = useCancelRequestMutation();
  const [toggleFavourite, { isLoading: isFavouriting }] = useToggleFavouriteMutation();

  return (
    <div className="flex flex-wrap items-center gap-3">
      {profile.relationshipStatus === 'none' && (
        <Button loading={isSending} onClick={() => requireAuth(() => requireProfile(() => sendRequest(profile.id)))}>
          <Send size={16} /> Send Request
        </Button>
      )}
      {profile.relationshipStatus === 'sent' && (
        <Button variant="secondary" loading={isCancelling} onClick={() => cancelRequest(profile.id)}>
          <X size={16} /> Cancel Request
        </Button>
      )}
      {profile.relationshipStatus === 'pending' && (
        <Button variant="secondary" onClick={() => router.push('/requests')}>
          Respond to Request
        </Button>
      )}
      {(profile.relationshipStatus === 'accepted' || profile.relationshipStatus === 'connected') && (
        <Button onClick={() => router.push(`/messages/${profile.id}`)}>
          <MessageCircle size={16} /> Message
        </Button>
      )}

      <Button
        variant="secondary"
        loading={isFavouriting}
        onClick={() => requireAuth(() => requireProfile(() => toggleFavourite(profile.id)))}
        aria-pressed={profile.isFavourite}
      >
        <Heart size={16} className={cn(profile.isFavourite && 'fill-danger text-danger')} />
        {profile.isFavourite ? 'Saved' : 'Save'}
      </Button>
    </div>
  );
}
