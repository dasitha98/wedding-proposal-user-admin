import type { ReactNode } from 'react';
import { Heart } from 'lucide-react';

export function AuthShell({ children, tagline }: { children: ReactNode; tagline?: string }) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-ink p-12 text-white lg:flex">
        <div
          className="absolute inset-0 opacity-90"
          style={{ background: 'radial-gradient(circle at 30% 20%, #3a2f0f 0%, #14110c 60%)' }}
        />
        <div
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--primary), transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--primary-light), transparent 70%)' }}
        />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary-light to-primary">
            <Heart size={18} className="fill-ink text-ink" />
          </div>
          <span className="font-display text-xl font-semibold">Wedding Proposal</span>
        </div>

        <div className="relative z-10 max-w-md animate-fade-in-up">
          <h1 className="font-display text-4xl leading-tight font-semibold">
            {tagline ?? 'Every great marriage begins with a single, meaningful connection.'}
          </h1>
          <p className="mt-4 text-white/70">
            Join thousands of families who found trusted, lasting matches through our platform.
          </p>
        </div>

        <p className="relative z-10 text-sm text-white/40">© {new Date().getFullYear()} Wedding Proposal. All rights reserved.</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-surface-muted p-6 sm:p-10">
        <div className="w-full max-w-md animate-fade-in-up">{children}</div>
      </div>
    </div>
  );
}
