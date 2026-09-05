'use client';

import { UserPlus, X } from 'lucide-react';

import { Button } from '../../../../shared/components';
import { Modal } from '../../../../shared/components/Modal';

interface CreateProfilePromptModalProps {
  open: boolean;
  onClose: () => void;
  onCreateProfile: () => void;
}

/** Blocks a signed-in member without a completed profile from anything but browsing Discover. */
export function CreateProfilePromptModal({ open, onClose, onCreateProfile }: CreateProfilePromptModalProps) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-md text-center">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 rounded-full p-1.5 text-ink-muted hover:bg-surface-sunken hover:text-ink"
      >
        <X size={18} />
      </button>

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-primary-light to-primary shadow-glow">
        <UserPlus size={30} className="text-ink" />
      </div>

      <h2 className="mt-6 font-display text-2xl font-semibold text-ink">Create your profile first</h2>
      <p className="mt-2 text-sm text-ink-muted">
        You need to finish setting up your own profile before you can view profiles, use filters, or do anything else here.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <Button fullWidth size="lg" onClick={onCreateProfile}>
          Create profile
        </Button>
      </div>
    </Modal>
  );
}
