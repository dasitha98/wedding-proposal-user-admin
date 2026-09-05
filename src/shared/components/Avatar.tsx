import { cn } from '../utils/cn';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
  ring?: boolean;
}

export function Avatar({ src, name, size = 44, className, ring = false }: AvatarProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');

  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        'relative shrink-0 overflow-hidden rounded-full bg-linear-to-br from-primary-light to-primary-dark',
        'flex items-center justify-center text-ink font-semibold',
        ring && 'ring-2 ring-primary ring-offset-2',
        className
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span style={{ fontSize: size * 0.36 }}>{initials || '?'}</span>
      )}
    </div>
  );
}
