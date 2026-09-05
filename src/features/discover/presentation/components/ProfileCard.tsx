'use client';

import { BadgeCheck, Heart, Loader2, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useToggleFavouriteMutation } from '../../../profile/data/api/profileApi';
import { useAuthGate } from '../../../auth/presentation/context/AuthGateContext';
import { useProfileGate } from '../../../profile/presentation/context/ProfileGateContext';
import { Badge } from '../../../../shared/components/Badge';
import { cn } from '../../../../shared/utils/cn';
import type { DiscoverProfile } from '../../domain/entities/Profile';

export function ProfileCard({ profile }: { profile: DiscoverProfile }) {
  const router = useRouter();
  const { requireAuth } = useAuthGate();
  const { requireProfile } = useProfileGate();
  const [toggleFavourite, { isLoading }] = useToggleFavouriteMutation();
  const photo = profile.photos[0];
  const href = `/profiles/${profile.id}`;

  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault();
        requireProfile(() => router.push(href));
      }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-transform duration-200 hover:-translate-y-1 hover:shadow-elevated"
    >
      <div className="relative aspect-4/5 w-full overflow-hidden bg-surface-sunken">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={profile.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl font-display text-ink-faint">
            {profile.name.charAt(0)}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/70 to-transparent" />

        <button
          onClick={(e) => {
            e.preventDefault();
            requireAuth(() => requireProfile(() => toggleFavourite(profile.id)));
          }}
          disabled={isLoading}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur-sm transition-transform hover:scale-110"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Heart size={16} />}
        </button>

        {profile.isGold && (
          <Badge tone="gold" className="absolute top-3 left-3">
            Gold
          </Badge>
        )}

        <div className="absolute inset-x-3 bottom-3 flex items-center gap-1.5 text-white">
          <h3 className="font-display text-lg font-semibold drop-shadow-sm">
            {profile.name}, {profile.age}
          </h3>
          {profile.isVerified && <BadgeCheck size={16} className="fill-primary text-ink" />}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="flex items-center gap-1 text-sm text-ink-muted">
          <MapPin size={13} />
          {[profile.city, profile.district, profile.country].filter(Boolean).join(', ')}
        </p>
        <p className={cn('truncate text-sm font-medium text-ink')}>{profile.jobTitle}</p>
        {profile.interests.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {profile.interests.slice(0, 2).map((interest) => (
              <span key={interest} className="rounded-full bg-surface-sunken px-2.5 py-1 text-xs font-medium text-ink-muted">
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
