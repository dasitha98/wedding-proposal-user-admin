'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';

import { cn } from '../utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, label, error, hint, id, ...props },
  ref
) {
  const textareaId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={cn(
          'min-h-28 w-full resize-y rounded-xl border bg-surface px-3.5 py-3 text-sm text-ink placeholder:text-ink-faint',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-primary-dark/40',
          error ? 'border-danger' : 'border-border-strong focus:border-primary-dark',
          className
        )}
        {...props}
      />
      {error ? <p className="text-xs text-danger">{error}</p> : hint ? <p className="text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
});
