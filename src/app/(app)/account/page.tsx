'use client';

import { ChevronRight, KeyRound, Mail, Pencil, User } from 'lucide-react';
import Link from 'next/link';

import { getUserFullName } from '../../../features/auth/domain/entities/AuthUser';
import { useAuth } from '../../../features/auth/presentation/hooks/useAuth';
import { useGetCurrentUserQuery } from '../../../features/users/data/api/usersApi';
import { Avatar, Badge } from '../../../shared/components';
import { Card } from '../../../shared/components/Card';

const MENU_ITEMS = [
  { href: '/profile/edit', label: 'Edit Account', icon: User },
  { href: '/account/change-password', label: 'Change Password', icon: KeyRound },
];

export default function AccountPage() {
  const { user } = useAuth();
  const { data: currentUser } = useGetCurrentUserQuery();
  if (!user) return null;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Account</h1>
        <p className="mt-1 text-sm text-ink-muted">Manage your account settings.</p>
      </div>

      <Card className="flex items-center gap-4 p-5">
        <Avatar name={getUserFullName(user)} size={64} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-display text-lg font-semibold text-ink">{getUserFullName(user)}</p>
            {user.isEmailVerified && <Badge tone="success">Verified</Badge>}
          </div>
          <p className="flex items-center gap-1.5 truncate text-sm text-ink-muted">
            <Mail size={13} /> {user.email}
          </p>
          {currentUser && (
            <p className="mt-0.5 text-xs text-ink-faint">
              Member since {new Date(currentUser.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
            </p>
          )}
        </div>
        <Link href="/profile/edit" className="rounded-full p-2 text-ink-muted hover:bg-surface-sunken hover:text-ink">
          <Pencil size={16} />
        </Link>
      </Card>

      <Card className="divide-y divide-border overflow-hidden p-0">
        {MENU_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-surface-sunken">
            <item.icon size={18} className="text-ink-muted" />
            <span className="flex-1 text-sm font-medium text-ink">{item.label}</span>
            <ChevronRight size={16} className="text-ink-faint" />
          </Link>
        ))}
      </Card>
    </div>
  );
}
