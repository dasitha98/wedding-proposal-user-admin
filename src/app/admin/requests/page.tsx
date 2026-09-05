'use client';

import { Check, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import {
  useAdminDeleteConnectionRequestMutation,
  useAdminDeleteFavouriteMutation,
  useAdminListConnectionRequestsQuery,
  useAdminListFavouritesQuery,
  useAdminUpdateConnectionRequestStatusMutation,
  type AdminConnectionRequest,
  type AdminFavourite,
} from '../../../features/admin/data/api/adminApi';
import { AdminDataTable, type AdminColumn } from '../../../features/admin/presentation/components/AdminDataTable';
import { AdminPagination } from '../../../features/admin/presentation/components/AdminPagination';
import { DeleteConfirmDialog } from '../../../features/admin/presentation/components/DeleteConfirmDialog';
import { Badge, Button, Tabs } from '../../../shared/components';

const PAGE_SIZE = 12;

const STATUS_TONE = { sent: 'neutral', accepted: 'success', declined: 'danger' } as const;

export default function AdminRequestsPage() {
  const [tab, setTab] = useState<'requests' | 'favourites'>('requests');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Connections</h1>
        <p className="text-sm text-ink-muted">Connection requests and saved (favourited) profiles.</p>
      </div>

      <Tabs
        value={tab}
        onChange={(v) => setTab(v as typeof tab)}
        items={[
          { value: 'requests', label: 'Connection Requests' },
          { value: 'favourites', label: 'Favourites' },
        ]}
      />

      {tab === 'requests' ? <RequestsTab /> : <FavouritesTab />}
    </div>
  );
}

function RequestsTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminListConnectionRequestsQuery({ page, pageSize: PAGE_SIZE });
  const [updateStatus] = useAdminUpdateConnectionRequestStatusMutation();
  const [deleteRequest] = useAdminDeleteConnectionRequestMutation();
  const [deleting, setDeleting] = useState<AdminConnectionRequest | null>(null);

  const columns: AdminColumn<AdminConnectionRequest>[] = [
    { header: 'Requester', cell: (r) => r.requesterName },
    { header: 'Target', cell: (r) => r.targetName },
    { header: 'Status', cell: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge> },
    { header: 'Declines', cell: (r) => r.declineCount },
    { header: 'Updated', cell: (r) => new Date(r.updatedAt).toLocaleDateString() },
    {
      header: '',
      cell: (r) => (
        <div className="flex justify-end gap-2">
          {r.status !== 'accepted' && (
            <Button size="sm" variant="secondary" onClick={() => updateStatus({ id: r.id, status: 'accepted' })}>
              <Check size={14} />
            </Button>
          )}
          {r.status !== 'declined' && (
            <Button size="sm" variant="secondary" onClick={() => updateStatus({ id: r.id, status: 'declined' })}>
              <X size={14} />
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setDeleting(r)} className="text-danger hover:bg-danger-tint">
            <Trash2 size={16} />
          </Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <AdminDataTable columns={columns} rows={data?.items ?? []} keyFn={(r) => r.id} isLoading={isLoading} emptyTitle="No connection requests" />
      {data && <AdminPagination page={data.page} totalPages={data.totalPages} totalCount={data.totalCount} onPageChange={setPage} />}
      {deleting && (
        <DeleteConfirmDialog
          title="Delete connection request"
          message={`Delete the request from ${deleting.requesterName} to ${deleting.targetName}?`}
          onDelete={() => deleteRequest(deleting.id).unwrap()}
          onDone={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

function FavouritesTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminListFavouritesQuery({ page, pageSize: PAGE_SIZE });
  const [deleteFavourite] = useAdminDeleteFavouriteMutation();
  const [deleting, setDeleting] = useState<AdminFavourite | null>(null);

  const columns: AdminColumn<AdminFavourite>[] = [
    { header: 'User', cell: (f) => f.userName },
    { header: 'Saved profile', cell: (f) => f.targetProfileName },
    { header: 'Saved on', cell: (f) => new Date(f.createdAt).toLocaleDateString() },
    {
      header: '',
      cell: (f) => (
        <div className="flex justify-end">
          <Button size="sm" variant="ghost" onClick={() => setDeleting(f)} className="text-danger hover:bg-danger-tint">
            <Trash2 size={16} />
          </Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <AdminDataTable columns={columns} rows={data?.items ?? []} keyFn={(f) => f.id} isLoading={isLoading} emptyTitle="No saved profiles" />
      {data && <AdminPagination page={data.page} totalPages={data.totalPages} totalCount={data.totalCount} onPageChange={setPage} />}
      {deleting && (
        <DeleteConfirmDialog
          title="Remove favourite"
          message={`Remove ${deleting.userName}'s saved profile (${deleting.targetProfileName})?`}
          onDelete={() => deleteFavourite(deleting.id).unwrap()}
          onDone={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
