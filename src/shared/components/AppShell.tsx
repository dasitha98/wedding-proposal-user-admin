'use client';

import { Compass, Heart, Home, LogOut, MessageCircle, User, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';

import { useAppDispatch } from '../../core/store/hooks';
import { useRevokeMutation } from '../../features/auth/data/api/authApi';
import { useAuthGate } from '../../features/auth/presentation/context/AuthGateContext';
import { useAuth } from '../../features/auth/presentation/hooks/useAuth';
import { signedOut } from '../../features/auth/presentation/state/authSlice';
import { useProfileGate } from '../../features/profile/presentation/context/ProfileGateContext';
import { getUserFullName, getUserInitials } from '../../features/auth/domain/entities/AuthUser';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { cn } from '../utils/cn';

const NAV_ITEMS = [
  { href: '/', label: 'Discover', icon: Compass },
  { href: '/requests', label: 'Requests', icon: Users },
  { href: '/messages', label: 'Messages', icon: MessageCircle },
  { href: '/saved', label: 'Saved', icon: Heart },
  { href: '/profile', label: 'My Profile', icon: User },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, tokens } = useAuth();
  const { isGuest, requireAuth } = useAuthGate();
  const { requireProfile } = useProfileGate();
  const [revoke] = useRevokeMutation();

  const handleSignOut = async () => {
    if (tokens) revoke({ refreshToken: tokens.refreshToken }).catch(() => {});
    dispatch(signedOut());
    router.push('/sign-in');
  };

  const isNavActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const handleNavClick = (e: MouseEvent, href: string) => {
    if (href === '/') return;
    e.preventDefault();
    requireAuth(() => requireProfile(() => router.push(href)));
  };

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface md:flex">
        <Link href="/" className="flex items-center gap-2.5 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-primary-light to-primary">
            <Home size={16} className="text-ink" />
          </div>
          <span className="font-display text-lg font-semibold text-ink">Wedding Proposal</span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                  active ? 'bg-primary-tint text-primary-dark' : 'text-ink-muted hover:bg-surface-sunken hover:text-ink'
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          {isGuest ? (
            <div className="flex flex-col gap-2 p-1">
              <Button size="sm" onClick={() => router.push('/sign-up')}>
                Create Account
              </Button>
              <Button variant="secondary" size="sm" onClick={() => router.push('/sign-in')}>
                Sign In
              </Button>
            </div>
          ) : (
            user && (
              <>
                <Link
                  href="/account"
                  onClick={(e) => handleNavClick(e, '/account')}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface-sunken"
                >
                  <Avatar name={getUserFullName(user) || getUserInitials(user)} size={38} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{getUserFullName(user)}</p>
                    <p className="truncate text-xs text-ink-muted">{user.email}</p>
                  </div>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-danger-tint hover:text-danger"
                >
                  <LogOut size={17} />
                  Sign out
                </button>
              </>
            )
          )}
        </div>
      </aside>

      <div className="flex flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-sm md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary-light to-primary">
              <Home size={14} className="text-ink" />
            </div>
            <span className="font-display font-semibold text-ink">Wedding Proposal</span>
          </Link>
          {user ? (
            <Avatar name={getUserFullName(user)} size={32} />
          ) : (
            <Button size="sm" onClick={() => router.push('/sign-in')}>
              Sign In
            </Button>
          )}
        </header>

        <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</main>

        <nav className="sticky bottom-0 z-20 flex items-center justify-around border-t border-border bg-surface/95 py-2 backdrop-blur-sm md:hidden">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn('flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium', active ? 'text-primary-dark' : 'text-ink-faint')}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
