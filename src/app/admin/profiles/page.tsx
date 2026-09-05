'use client';

import { Plus, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import {
  useAdminCreateProfileMutation,
  useAdminListProfilesQuery,
  useAdminListUsersQuery,
  type AdminProfileSummary,
  type AdminUser,
} from '../../../features/admin/data/api/adminApi';
import { AdminDataTable, type AdminColumn } from '../../../features/admin/presentation/components/AdminDataTable';
import { AdminPagination } from '../../../features/admin/presentation/components/AdminPagination';
import { Badge, Button, Input, Modal } from '../../../shared/components';

const PAGE_SIZE = 12;

export default function AdminProfilesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);
  const { data, isLoading } = useAdminListProfilesQuery({ search: search || undefined, page, pageSize: PAGE_SIZE });

  const columns: AdminColumn<AdminProfileSummary>[] = [
    {
      header: 'Name',
      cell: (p) => (
        <Link href={`/admin/profiles/${p.id}`} className="font-medium text-ink hover:text-primary-dark hover:underline">
          {p.fullName}
        </Link>
      ),
    },
    { header: 'Email', cell: (p) => p.email },
    { header: 'Gender', cell: (p) => <span className="capitalize">{p.gender}</span> },
    { header: 'Age', cell: (p) => p.age },
    { header: 'Location', cell: (p) => [p.city, p.country].filter(Boolean).join(', ') || '—' },
    {
      header: 'Status',
      cell: (p) => (
        <div className="flex gap-1.5">
          {p.isGold && <Badge tone="gold">Gold</Badge>}
          <Badge tone="neutral">{p.photoCount} photo{p.photoCount === 1 ? '' : 's'}</Badge>
        </div>
      ),
    },
    { header: 'Created', cell: (p) => new Date(p.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Profiles</h1>
          <p className="text-sm text-ink-muted">Matrimony profiles submitted by users.</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus size={16} />
          New profile
        </Button>
      </div>

      <Input
        icon={<Search size={16} />}
        placeholder="Search by name..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="max-w-sm"
      />

      <AdminDataTable columns={columns} rows={data?.items ?? []} keyFn={(p) => p.id} isLoading={isLoading} emptyTitle="No profiles found" />
      {data && <AdminPagination page={data.page} totalPages={data.totalPages} totalCount={data.totalCount} onPageChange={setPage} />}

      {creating && <CreateProfileModal onClose={() => setCreating(false)} />}
    </div>
  );
}

function CreateProfileModal({ onClose }: { onClose: () => void }) {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: userResults, isFetching: isSearching } = useAdminListUsersQuery(
    { search: userSearch, page: 1, pageSize: 5 },
    { skip: !userSearch.trim() || !!selectedUser }
  );
  const [createProfile, { isLoading }] = useAdminCreateProfileMutation();

  const pickUser = (user: AdminUser) => {
    setSelectedUser(user);
    setFirstName(user.firstName);
    setLastName(user.lastName);
  };

  const canSave = selectedUser && firstName.trim() && lastName.trim() && dateOfBirth;

  const onSave = async () => {
    if (!selectedUser) return;
    setError(null);
    try {
      await createProfile({
        userId: selectedUser.id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth,
      }).unwrap();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create this profile.');
    }
  };

  return (
    <Modal open onClose={onClose} title="New profile">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">Account</span>
          {selectedUser ? (
            <div className="flex items-center justify-between rounded-xl border border-border-strong px-3.5 py-2.5">
              <div>
                <p className="text-sm font-medium text-ink">
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
                <p className="text-xs text-ink-muted">{selectedUser.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-ink-faint hover:text-ink"
                aria-label="Change account"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <Input
                icon={<Search size={16} />}
                placeholder="Search by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
              {userSearch.trim() && (
                <div className="flex flex-col overflow-hidden rounded-xl border border-border-strong">
                  {isSearching && <p className="px-3.5 py-2.5 text-sm text-ink-muted">Searching…</p>}
                  {!isSearching && (userResults?.items.length ?? 0) === 0 && (
                    <p className="px-3.5 py-2.5 text-sm text-ink-muted">No accounts found.</p>
                  )}
                  {userResults?.items.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => pickUser(user)}
                      className="flex flex-col items-start px-3.5 py-2.5 text-left hover:bg-surface-muted"
                    >
                      <span className="text-sm font-medium text-ink">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs text-ink-muted">{user.email}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={!selectedUser} />
          <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={!selectedUser} />
        </div>
        <Input
          label="Date of birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          disabled={!selectedUser}
        />

        {error && <p className="rounded-lg bg-danger-tint px-3 py-2 text-sm text-danger">{error}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={isLoading} disabled={!canSave} onClick={onSave}>
            Create profile
          </Button>
        </div>
      </div>
    </Modal>
  );
}
