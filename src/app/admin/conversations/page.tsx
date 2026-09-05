'use client';

import { MessageSquareText, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import {
  useAdminDeleteConversationMutation,
  useAdminListConversationsQuery,
  type AdminConversation,
} from '../../../features/admin/data/api/adminApi';
import { AdminDataTable, type AdminColumn } from '../../../features/admin/presentation/components/AdminDataTable';
import { AdminPagination } from '../../../features/admin/presentation/components/AdminPagination';
import { DeleteConfirmDialog } from '../../../features/admin/presentation/components/DeleteConfirmDialog';
import { Badge, Button } from '../../../shared/components';

const PAGE_SIZE = 12;

export default function AdminConversationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminListConversationsQuery({ page, pageSize: PAGE_SIZE });
  const [deleteConversation] = useAdminDeleteConversationMutation();
  const [deleting, setDeleting] = useState<AdminConversation | null>(null);

  const columns: AdminColumn<AdminConversation>[] = [
    { header: 'Between', cell: (c) => `${c.userAName} & ${c.userBName}` },
    { header: 'Messages', cell: (c) => <Badge tone="neutral">{c.messageCount}</Badge> },
    { header: 'Started', cell: (c) => new Date(c.createdAt).toLocaleDateString() },
    {
      header: '',
      cell: (c) => (
        <div className="flex justify-end gap-2">
          <Link href={`/admin/conversations/${c.id}`}>
            <Button size="sm" variant="secondary">
              <MessageSquareText size={14} />
              View
            </Button>
          </Link>
          <Button size="sm" variant="ghost" onClick={() => setDeleting(c)} className="text-danger hover:bg-danger-tint">
            <Trash2 size={16} />
          </Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Conversations</h1>
        <p className="text-sm text-ink-muted">Message threads between connected users.</p>
      </div>

      <AdminDataTable columns={columns} rows={data?.items ?? []} keyFn={(c) => c.id} isLoading={isLoading} emptyTitle="No conversations yet" />
      {data && <AdminPagination page={data.page} totalPages={data.totalPages} totalCount={data.totalCount} onPageChange={setPage} />}

      {deleting && (
        <DeleteConfirmDialog
          title="Delete conversation"
          message={`Delete the conversation between ${deleting.userAName} and ${deleting.userBName}, including all its messages?`}
          onDelete={() => deleteConversation(deleting.id).unwrap()}
          onDone={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
