'use client';

import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { useAdminDeleteMessageMutation, useAdminListMessagesQuery, type AdminMessage } from '../../../../features/admin/data/api/adminApi';
import { AdminPagination } from '../../../../features/admin/presentation/components/AdminPagination';
import { DeleteConfirmDialog } from '../../../../features/admin/presentation/components/DeleteConfirmDialog';
import { EmptyState, FullPageSpinner } from '../../../../shared/components';

const PAGE_SIZE = 20;

export default function AdminConversationMessagesPage() {
  const params = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminListMessagesQuery({ conversationId: params.id, page, pageSize: PAGE_SIZE });
  const [deleteMessage] = useAdminDeleteMessageMutation();
  const [deleting, setDeleting] = useState<AdminMessage | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/conversations" className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink">
        <ArrowLeft size={16} />
        Back to conversations
      </Link>

      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Messages</h1>
        <p className="text-sm text-ink-muted">Most recent first.</p>
      </div>

      {isLoading ? (
        <FullPageSpinner />
      ) : !data || data.items.length === 0 ? (
        <EmptyState title="No messages in this conversation" />
      ) : (
        <div className="flex flex-col gap-3">
          {data.items.map((m) => (
            <div key={m.id} className="group flex items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-card">
              <div>
                <p className="text-sm font-semibold text-ink">{m.senderName}</p>
                <p className="mt-1 text-sm text-ink-muted">{m.text}</p>
                <p className="mt-2 text-xs text-ink-faint">{new Date(m.sentAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setDeleting(m)}
                className="rounded-full p-2 text-ink-faint opacity-0 transition-opacity hover:bg-danger-tint hover:text-danger group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {data && <AdminPagination page={data.page} totalPages={data.totalPages} totalCount={data.totalCount} onPageChange={setPage} />}

      {deleting && (
        <DeleteConfirmDialog
          title="Delete message"
          message="Permanently delete this message?"
          onDelete={() => deleteMessage(deleting.id).unwrap()}
          onDone={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
