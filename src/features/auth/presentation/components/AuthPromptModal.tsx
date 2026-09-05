'use client';

import { Heart, X } from 'lucide-react';

import { Button } from '../../../../shared/components';
import { Modal } from '../../../../shared/components/Modal';

interface AuthPromptModalProps {
  open: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
}

/** Blocks a guest action (e.g. opening a profile) behind a sign-in/sign-up prompt. */
export function AuthPromptModal({ open, onClose, onSignIn, onSignUp }: AuthPromptModalProps) {
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
        <Heart size={30} className="fill-ink text-ink" />
      </div>

      <h2 className="mt-6 font-display text-2xl font-semibold text-ink">Ready to meet them?</h2>
      <p className="mt-2 text-sm text-ink-muted">
        Create a free account or sign in to view full profiles, connect, and start your journey to find your match.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <Button fullWidth size="lg" onClick={onSignUp}>
          Create Account
        </Button>
        <Button variant="secondary" fullWidth size="lg" onClick={onSignIn}>
          Sign In
        </Button>
      </div>
    </Modal>
  );
}
