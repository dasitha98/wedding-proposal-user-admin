'use client';

import {
  Heart,
  Key,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  ShieldCheck,
  UserSquare2,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { useAppDispatch } from '../../../../core/store/hooks';
import { getUserFullName } from '../../../auth/domain/entities/AuthUser';
import { useRevokeMutation } from '../../../auth/data/api/authApi';
import { useAuth } from '../../../auth/presentation/hooks/useAuth';
import { signedOut } from '../../../auth/presentation/state/authSlice';
import { Avatar } from '../../../../shared/components';
import { cn } from '../../../../shared/utils/cn';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/profiles', label: 'Profiles', icon: UserSquare2 },
  { href: '/admin/requests', label: 'Connection Requests', icon: Heart },
  { href: '/admin/conversations', label: 'Conversations', icon: MessageCircle },
  { href: '/admin/security', label: 'Security', icon: Key },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, tokens } = useAuth();
  const [revoke] = useRevokeMutation();

  const handleSignOut = async () => {
    if (tokens) revoke({ refreshToken: tokens.refreshToken }).catch(() => {});
    dispatch(signedOut());
    router.push('/sign-in');
  };

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-border bg-ink">
        <Link href="/admin" className="flex items-center gap-2.5 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-primary-light to-primary shadow-glow">
            <ShieldCheck size={18} className="text-ink" />
          </div>
          <div>
            <span className="block font-display text-base font-semibold text-white">Admin</span>
            <span className="block text-[11px] text-white/50">Wedding Proposal</span>
          </div>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                  active ? 'bg-linear-to-r from-primary-light to-primary text-ink shadow-glow' : 'text-white/70 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          {user && (
            <>
              <div className="flex items-center gap-3 rounded-xl px-2 py-2">
                <Avatar name={getUserFullName(user)} size={38} ring />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{getUserFullName(user)}</p>
                  <p className="truncate text-xs text-white/50">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-danger/20 hover:text-danger"
              >
                <LogOut size={17} />
                Sign out
              </button>
            </>
          )}
        </div>
      </aside>

      <div className="flex flex-1 flex-col pl-64">
        <main className="flex flex-1 flex-col px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
