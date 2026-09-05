import { cn } from '../../../../shared/utils/cn';
import type { Message } from '../../domain/entities/Message';

export function MessageBubble({ message }: { message: Message }) {
  const isMine = message.sender === 'me';
  return (
    <div className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm',
          isMine ? 'rounded-br-md bg-linear-to-r from-primary-light to-primary text-ink' : 'rounded-bl-md bg-surface-sunken text-ink'
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <p className={cn('mt-1 text-right text-[10px]', isMine ? 'text-ink/60' : 'text-ink-faint')}>
          {new Date(message.sentAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
