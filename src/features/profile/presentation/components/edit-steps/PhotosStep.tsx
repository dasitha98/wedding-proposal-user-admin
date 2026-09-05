'use client';

import { Loader2, Plus, Star, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

import { useUploadPhotoMutation } from '../../../data/api/profileApi';
import { cn } from '../../../../../shared/utils/cn';
import type { ProfilePhoto } from '../../../domain/entities/Profile';

interface PhotosStepProps {
  photos: ProfilePhoto[];
  onChange: (photos: ProfilePhoto[]) => void;
}

export function PhotosStep({ photos, onChange }: PhotosStepProps) {
  const [uploadPhoto, { isLoading }] = useUploadPhotoMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      const { uri } = await uploadPhoto(file).unwrap();
      onChange([...photos, { uri, isBlurred: false }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upload that photo. Please try again.');
    }
  };

  const removePhoto = (index: number) => onChange(photos.filter((_, i) => i !== index));
  const makePrimary = (index: number) => {
    const reordered = [photos[index], ...photos.filter((_, i) => i !== index)];
    onChange(reordered);
  };

  return (
    <div>
      <p className="mb-4 text-sm text-ink-muted">Add up to 6 photos. Your first photo is shown as your primary profile picture.</p>
      {error && <p className="mb-4 text-sm text-danger">{error}</p>}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {photos.map((photo, i) => (
          <div key={photo.uri + i} className="group relative aspect-square overflow-hidden rounded-2xl bg-surface-sunken">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.uri} alt="" className="h-full w-full object-cover" />
            {i === 0 && (
              <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-ink">
                <Star size={11} className="fill-ink" /> Primary
              </span>
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              {i !== 0 && (
                <button
                  type="button"
                  onClick={() => makePrimary(i)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink hover:scale-105"
                  title="Make primary"
                >
                  <Star size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-danger hover:scale-105"
                title="Remove"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {photos.length < 6 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className={cn(
              'flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border-strong text-ink-muted transition-colors hover:border-primary-dark hover:text-primary-dark',
              isLoading && 'opacity-50'
            )}
          >
            {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Plus size={22} />}
            <span className="text-xs font-medium">{isLoading ? 'Uploading...' : 'Add photo'}</span>
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          void handleFileSelect(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
}
