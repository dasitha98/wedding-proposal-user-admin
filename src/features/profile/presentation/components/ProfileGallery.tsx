'use client';

import { BadgeCheck } from 'lucide-react';
import { useState } from 'react';

import { cn } from '../../../../shared/utils/cn';
import type { ProfilePhoto } from '../../domain/entities/Profile';

export function ProfileGallery({ photos, name, isVerified }: { photos: ProfilePhoto[]; name: string; isVerified?: boolean }) {
  const [active, setActive] = useState(0);
  const photo = photos[active];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-surface-sunken sm:aspect-square">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.uri} alt={name} className={cn('h-full w-full object-cover', photo.isBlurred && 'blur-xl')} />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-6xl text-ink-faint">
            {name.charAt(0)}
          </div>
        )}
        {isVerified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink backdrop-blur-sm">
            <BadgeCheck size={14} className="text-primary-dark" /> Verified
          </div>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {photos.map((p, i) => (
            <button
              key={p.uri + i}
              onClick={() => setActive(i)}
              className={cn(
                'h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors',
                i === active ? 'border-primary-dark' : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.uri} alt="" className={cn('h-full w-full object-cover', p.isBlurred && 'blur-md')} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
