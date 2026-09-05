'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';

import { useAuthGate } from '../../../features/auth/presentation/context/AuthGateContext';
import { useGetFavouritesQuery, useToggleFavouriteMutation } from '../../../features/profile/data/api/profileApi';
import { useProfileGate } from '../../../features/profile/presentation/context/ProfileGateContext';
import { Avatar, Badge, Button } from '../../../shared/components';
import { EmptyState, ErrorState } from '../../../shared/components/EmptyState';
import { Skeleton } from '../../../shared/components/Skeleton';

export default function SavedPage() {
  const { data: favourites, isLoading, error, refetch } = useGetFavouritesQuery();
  const [toggleFavourite] = useToggleFavouriteMutation();
  const { requireAuth } = useAuthGate();
  const { requireProfile } = useProfileGate();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Saved Profiles</h1>
        <p className="mt-1 text-sm text-ink-muted">Profiles you&apos;ve bookmarked for later.</p>
      </div>

      {error ? (
        <ErrorState message="We couldn't load your saved profiles." onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-2xl" />
          ))}
        </div>
      ) : !favourites || favourites.length === 0 ? (
        <EmptyState
          icon={<Heart size={22} />}
          title="No saved profiles yet"
          description="Tap the heart icon on any profile to save it here for later."
          action={
            <Link href="/">
              <Button>Browse Discover</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {favourites.map((profile) => (
            <div key={profile.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card">
              <Link href={`/profiles/${profile.id}`} className="flex flex-col items-center gap-2 text-center">
                <Avatar src={profile.photo} name={profile.name} size={72} />
                <div>
                  <p className="flex items-center justify-center gap-1.5 font-semibold text-ink">
                    {profile.name}, {profile.age}
                    {profile.isGold && <Badge tone="gold">Gold</Badge>}
                  </p>
                  <p className="text-sm text-ink-muted">{profile.city}</p>
                </div>
              </Link>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => requireAuth(() => requireProfile(() => toggleFavourite(profile.id)))}
              >
                <Heart size={14} className="fill-danger text-danger" /> Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
