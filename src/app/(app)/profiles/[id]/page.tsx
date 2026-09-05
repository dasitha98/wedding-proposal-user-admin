'use client';

import { MapPin } from 'lucide-react';
import { use } from 'react';

import { useGetProfileQuery } from '../../../../features/profile/data/api/profileApi';
import { getFullName } from '../../../../features/profile/domain/entities/Profile';
import { ProfileActionBar } from '../../../../features/profile/presentation/components/ProfileActionBar';
import { ProfileDetailSections } from '../../../../features/profile/presentation/components/ProfileDetailSections';
import { ProfileGallery } from '../../../../features/profile/presentation/components/ProfileGallery';
import { ErrorState } from '../../../../shared/components/EmptyState';
import { Skeleton } from '../../../../shared/components/Skeleton';

export default function ProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: profile, isLoading, error, refetch } = useGetProfileQuery(id);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <Skeleton className="aspect-4/5 w-full rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return <ErrorState message="This profile could not be found." onRetry={refetch} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
      <div className="flex flex-col gap-4 lg:sticky lg:top-8 lg:self-start">
        <ProfileGallery photos={profile.photos} name={getFullName(profile)} isVerified={profile.verification.identityVerified} />
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {getFullName(profile)}, {profile.age}
          </h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
            <MapPin size={14} /> {profile.city} · Active {profile.lastActiveLabel}
          </p>
        </div>
        <ProfileActionBar profile={profile} />
      </div>

      <ProfileDetailSections profile={profile} />
    </div>
  );
}
