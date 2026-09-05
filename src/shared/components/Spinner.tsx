import { Loader2 } from 'lucide-react';

import { cn } from '../utils/cn';

export function Spinner({ size = 24, className }: { size?: number; className?: string }) {
  return <Loader2 size={size} className={cn('animate-spin text-primary-dark', className)} />;
}

export function FullPageSpinner() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <Spinner size={32} />
    </div>
  );
}
