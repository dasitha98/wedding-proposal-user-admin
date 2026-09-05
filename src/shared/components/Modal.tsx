'use client';

import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

// Tailwind's cascade order isn't the same as class-string order, so a base
// utility (e.g. `w-full`) can silently beat an override with equal
// specificity. Drop base utilities whose prefix is also set by `className`.
const SIZE_PREFIXES = ['w-', 'max-w-', 'h-', 'max-h-'];

function withSizeOverrides(base: string, className?: string) {
  if (!className) return base;
  const overridden = new Set(
    className
      .split(/\s+/)
      .map((c) => SIZE_PREFIXES.find((p) => c.startsWith(p)))
      .filter((p): p is string => Boolean(p))
  );
  const kept = base
    .split(/\s+/)
    .filter((c) => !SIZE_PREFIXES.some((p) => c.startsWith(p) && overridden.has(p)));
  return kept.join(' ');
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-overlay backdrop-blur-sm animate-fade-in-up" onClick={onClose} />
      <div
        className={cn(
          withSizeOverrides('relative z-10 w-full max-w-lg animate-fade-in-up rounded-2xl bg-surface p-6 shadow-elevated', className),
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
            <button onClick={onClose} className="rounded-full p-1.5 text-ink-muted hover:bg-surface-sunken hover:text-ink">
              <X size={18} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}
