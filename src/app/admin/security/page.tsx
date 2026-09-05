'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import {
  useAdminDeleteEmailVerificationOtpMutation,
  useAdminDeletePasswordResetOtpMutation,
  useAdminDeleteRefreshTokenMutation,
  useAdminListEmailVerificationOtpsQuery,
  useAdminListPasswordResetOtpsQuery,
  useAdminListRefreshTokensQuery,
  type AdminOtp,
  type AdminRefreshToken,
} from '../../../features/admin/data/api/adminApi';
import { AdminDataTable, type AdminColumn } from '../../../features/admin/presentation/components/AdminDataTable';
import { AdminPagination } from '../../../features/admin/presentation/components/AdminPagination';
import { DeleteConfirmDialog } from '../../../features/admin/presentation/components/DeleteConfirmDialog';
import { Badge, Button, Tabs } from '../../../shared/components';

const PAGE_SIZE = 12;

export default function AdminSecurityPage() {
  const [tab, setTab] = useState<'tokens' | 'reset-otps' | 'verify-otps'>('tokens');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Security</h1>
        <p className="text-sm text-ink-muted">Session refresh tokens and outstanding one-time codes.</p>
      </div>

      <Tabs
        value={tab}
        onChange={(v) => setTab(v as typeof tab)}
        items={[
          { value: 'tokens', label: 'Refresh Tokens' },
          { value: 'reset-otps', label: 'Password-Reset OTPs' },
          { value: 'verify-otps', label: 'Email-Verification OTPs' },
        ]}
      />

      {tab === 'tokens' && <RefreshTokensTab />}
      {tab === 'reset-otps' && <OtpsTab kind="password-reset" />}
      {tab === 'verify-otps' && <OtpsTab kind="email-verification" />}
    </div>
  );
}

function RefreshTokensTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminListRefreshTokensQuery({ page, pageSize: PAGE_SIZE });
  const [deleteToken] = useAdminDeleteRefreshTokenMutation();
  const [deleting, setDeleting] = useState<AdminRefreshToken | null>(null);

  const columns: AdminColumn<AdminRefreshToken>[] = [
    { header: 'User', cell: (t) => t.userEmail },
    { header: 'Status', cell: (t) => <Badge tone={t.isActive ? 'success' : 'neutral'}>{t.isActive ? 'Active' : t.revokedAt ? 'Revoked' : 'Expired'}</Badge> },
    { header: 'Issued', cell: (t) => new Date(t.createdAt).toLocaleString() },
    { header: 'Expires', cell: (t) => new Date(t.expiresAt).toLocaleString() },
    {
      header: '',
      cell: (t) => (
        <div className="flex justify-end">
          <Button size="sm" variant="ghost" onClick={() => setDeleting(t)} className="text-danger hover:bg-danger-tint">
            <Trash2 size={16} />
          </Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <AdminDataTable columns={columns} rows={data?.items ?? []} keyFn={(t) => t.id} isLoading={isLoading} emptyTitle="No refresh tokens" />
      {data && <AdminPagination page={data.page} totalPages={data.totalPages} totalCount={data.totalCount} onPageChange={setPage} />}
      {deleting && (
        <DeleteConfirmDialog
          title="Revoke session"
          message={`Permanently remove this refresh token for ${deleting.userEmail}? They'll be signed out of that session.`}
          confirmLabel="Revoke"
          onDelete={() => deleteToken(deleting.id).unwrap()}
          onDone={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

function OtpsTab({ kind }: { kind: 'password-reset' | 'email-verification' }) {
  const [page, setPage] = useState(1);
  const useList = kind === 'password-reset' ? useAdminListPasswordResetOtpsQuery : useAdminListEmailVerificationOtpsQuery;
  const useDelete = kind === 'password-reset' ? useAdminDeletePasswordResetOtpMutation : useAdminDeleteEmailVerificationOtpMutation;

  const { data, isLoading } = useList({ page, pageSize: PAGE_SIZE });
  const [deleteOtp] = useDelete();
  const [deleting, setDeleting] = useState<AdminOtp | null>(null);

  const columns: AdminColumn<AdminOtp>[] = [
    { header: 'Email', cell: (o) => o.email },
    {
      header: 'Status',
      cell: (o) =>
        o.consumedAt ? (
          <Badge tone="success">Used</Badge>
        ) : new Date(o.expiresAt) < new Date() ? (
          <Badge tone="neutral">Expired</Badge>
        ) : (
          <Badge tone="gold">Pending</Badge>
        ),
    },
    { header: 'Attempts left', cell: (o) => o.attemptsRemaining },
    { header: 'Expires', cell: (o) => new Date(o.expiresAt).toLocaleString() },
    {
      header: '',
      cell: (o) => (
        <div className="flex justify-end">
          <Button size="sm" variant="ghost" onClick={() => setDeleting(o)} className="text-danger hover:bg-danger-tint">
            <Trash2 size={16} />
          </Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <AdminDataTable columns={columns} rows={data?.items ?? []} keyFn={(o) => o.id} isLoading={isLoading} emptyTitle="No outstanding codes" />
      {data && <AdminPagination page={data.page} totalPages={data.totalPages} totalCount={data.totalCount} onPageChange={setPage} />}
      {deleting && (
        <DeleteConfirmDialog
          title="Invalidate code"
          message={`Permanently remove this one-time code for ${deleting.email}?`}
          onDelete={() => deleteOtp(deleting.id).unwrap()}
          onDone={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
