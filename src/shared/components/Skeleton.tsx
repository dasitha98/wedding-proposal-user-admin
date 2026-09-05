import { cn } from '../utils/cn';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-shimmer rounded-lg', className)} />;
}
