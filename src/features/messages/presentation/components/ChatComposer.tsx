'use client';

import { Send } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';

interface ChatComposerProps {
  onSend: (text: string) => void;
  sending?: boolean;
}

export function ChatComposer({ onSend, sending }: ChatComposerProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-3 border-t border-border bg-surface p-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a message..."
        rows={1}
        className="max-h-32 flex-1 resize-none rounded-xl border border-border-strong bg-surface-muted px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark/40"
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || sending}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-primary-light to-primary text-ink transition-transform disabled:opacity-40 enabled:hover:scale-105"
      >
        <Send size={17} />
      </button>
    </div>
  );
}
