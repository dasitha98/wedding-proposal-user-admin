'use client';

import { Heart, MessageCircle, UserSquare2, Users } from 'lucide-react';
import { useMemo } from 'react';

import {
  useAdminListConversationsQuery,
  useAdminListEmailVerificationOtpsQuery,
  useAdminListFavouritesQuery,
  useAdminListPasswordResetOtpsQuery,
  useAdminListProfilesQuery,
  useAdminListConnectionRequestsQuery,
  useAdminListRefreshTokensQuery,
  useAdminListUsersQuery,
} from '../../features/admin/data/api/adminApi';
import { PieChartCard } from '../../features/admin/presentation/components/charts/PieChartCard';
import type { ChartDatum } from '../../features/admin/presentation/components/charts/palette';
import { StatCard } from '../../features/admin/presentation/components/StatCard';
import { Card } from '../../shared/components';

// No backend aggregation endpoint exists yet, so breakdowns are computed client-side from
// a bounded sample. Sample sizes above this cap won't be fully reflected in the pie charts.
const SAMPLE_SIZE = 1000;

function countBy<T>(items: T[], keyFn: (item: T) => string | string[]): ChartDatum[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const keys = keyFn(item);
    for (const key of Array.isArray(keys) ? keys : [keys]) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return Array.from(counts, ([label, value]) => ({ label, value }));
}

function sampleSubtitle(sampled: number, total: number | undefined) {
  if (total === undefined || sampled >= total) return undefined;
  return `Based on the most recent ${sampled.toLocaleString()} of ${total.toLocaleString()} records`;
}

export default function AdminOverviewPage() {
  const { data: users, isFetching: usersLoading } = useAdminListUsersQuery({ page: 1, pageSize: SAMPLE_SIZE });
  const { data: profiles, isFetching: profilesLoading } = useAdminListProfilesQuery({ page: 1, pageSize: SAMPLE_SIZE });
  const { data: requests, isFetching: requestsLoading } = useAdminListConnectionRequestsQuery({ page: 1, pageSize: SAMPLE_SIZE });
  const { data: conversations } = useAdminListConversationsQuery({ page: 1, pageSize: 1 });
  const { data: favourites } = useAdminListFavouritesQuery({ page: 1, pageSize: 1 });
  const { data: refreshTokens, isFetching: refreshTokensLoading } = useAdminListRefreshTokensQuery({ page: 1, pageSize: SAMPLE_SIZE });
  const { data: passwordResetOtps, isFetching: passwordResetLoading } = useAdminListPasswordResetOtpsQuery({ page: 1, pageSize: SAMPLE_SIZE });
  const { data: emailVerificationOtps, isFetching: emailVerificationLoading } = useAdminListEmailVerificationOtpsQuery({ page: 1, pageSize: SAMPLE_SIZE });

  const tableSizes = useMemo<ChartDatum[]>(
    () => [
      { label: 'Users', value: users?.totalCount ?? 0 },
      { label: 'Profiles', value: profiles?.totalCount ?? 0 },
      { label: 'Connection requests', value: requests?.totalCount ?? 0 },
      { label: 'Favourites', value: favourites?.totalCount ?? 0 },
      { label: 'Conversations', value: conversations?.totalCount ?? 0 },
      { label: 'Refresh tokens', value: refreshTokens?.totalCount ?? 0 },
      { label: 'Password reset OTPs', value: passwordResetOtps?.totalCount ?? 0 },
      { label: 'Email verification OTPs', value: emailVerificationOtps?.totalCount ?? 0 },
    ],
    [users, profiles, requests, favourites, conversations, refreshTokens, passwordResetOtps, emailVerificationOtps],
  );

  const usersByRole = useMemo(
    () => countBy(users?.items ?? [], (u) => (u.roles.length > 0 ? u.roles : ['No role'])),
    [users],
  );
  const profilesByGender = useMemo(
    () => countBy(profiles?.items ?? [], (p) => (p.gender === 'male' ? 'Male' : 'Female')),
    [profiles],
  );
  const requestsByStatus = useMemo(
    () => countBy(requests?.items ?? [], (r) => r.status[0].toUpperCase() + r.status.slice(1)),
    [requests],
  );
  const refreshTokensByStatus = useMemo(
    () => countBy(refreshTokens?.items ?? [], (t) => (t.isActive ? 'Active' : 'Revoked')),
    [refreshTokens],
  );
  const passwordResetOtpsByStatus = useMemo(
    () => countBy(passwordResetOtps?.items ?? [], (o) => (o.consumedAt ? 'Consumed' : 'Pending')),
    [passwordResetOtps],
  );
  const emailVerificationOtpsByStatus = useMemo(
    () => countBy(emailVerificationOtps?.items ?? [], (o) => (o.consumedAt ? 'Consumed' : 'Pending')),
    [emailVerificationOtps],
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-muted">A snapshot of what&apos;s happening across the platform.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={users?.totalCount ?? '—'} icon={Users} />
        <StatCard label="Profiles" value={profiles?.totalCount ?? '—'} icon={UserSquare2} tone="ink" />
        <StatCard label="Connection Requests" value={requests?.totalCount ?? '—'} icon={Heart} />
        <StatCard label="Conversations" value={conversations?.totalCount ?? '—'} icon={MessageCircle} tone="ink" />
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Tables at a glance</h2>
        <p className="mt-1 text-sm text-ink-muted">Record count share across every table in the database.</p>
        <div className="mt-4 grid grid-cols-1">
          <PieChartCard title="Table sizes" data={tableSizes} totalLabel="Records" />
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Breakdowns</h2>
        <p className="mt-1 text-sm text-ink-muted">How each table splits by its most meaningful field.</p>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PieChartCard title="Users by role" totalLabel="Users" data={usersByRole} isLoading={usersLoading} subtitle={sampleSubtitle(users?.items.length ?? 0, users?.totalCount)} />
          <PieChartCard title="Profiles by gender" totalLabel="Profiles" data={profilesByGender} isLoading={profilesLoading} subtitle={sampleSubtitle(profiles?.items.length ?? 0, profiles?.totalCount)} />
          <PieChartCard title="Connection requests by status" totalLabel="Requests" data={requestsByStatus} isLoading={requestsLoading} subtitle={sampleSubtitle(requests?.items.length ?? 0, requests?.totalCount)} />
          <PieChartCard title="Refresh tokens by status" totalLabel="Tokens" data={refreshTokensByStatus} isLoading={refreshTokensLoading} subtitle={sampleSubtitle(refreshTokens?.items.length ?? 0, refreshTokens?.totalCount)} />
          <PieChartCard title="Password reset OTPs by status" totalLabel="OTPs" data={passwordResetOtpsByStatus} isLoading={passwordResetLoading} subtitle={sampleSubtitle(passwordResetOtps?.items.length ?? 0, passwordResetOtps?.totalCount)} />
          <PieChartCard title="Email verification OTPs by status" totalLabel="OTPs" data={emailVerificationOtpsByStatus} isLoading={emailVerificationLoading} subtitle={sampleSubtitle(emailVerificationOtps?.items.length ?? 0, emailVerificationOtps?.totalCount)} />
        </div>
      </div>

      <Card className="p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Manage the platform</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Use the sidebar to manage accounts, matrimony profiles, roles, connection requests, conversations, and
          security artifacts (refresh tokens and one-time codes) &mdash; all backed by the live database.
        </p>
      </Card>
    </div>
  );
}
