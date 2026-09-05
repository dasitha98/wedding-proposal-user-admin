import { useState } from 'react';

import { Button, Modal } from '../../../../shared/components';
import { ConfirmDialog } from './ConfirmDialog';

interface DeleteConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onDelete: () => Promise<unknown>;
  onDone: () => void;
}

/** Confirm-then-delete flow shared by every admin entity page: shows a confirm dialog, runs
 * the mutation, and falls back to an error modal (with a friendly backend message, e.g. a
 * blocked delete due to related data) instead of leaving the confirm dialog stuck loading. */
export function DeleteConfirmDialog({ title, message, confirmLabel, onDelete, onDone }: DeleteConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onDelete();
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'This action could not be completed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <Modal open onClose={onDone} title="Could not complete">
        <p className="text-sm text-danger">{error}</p>
        <div className="mt-4 flex justify-end">
          <Button onClick={onDone}>Close</Button>
        </div>
      </Modal>
    );
  }

  return (
    <ConfirmDialog
      open
      title={title}
      message={message}
      confirmLabel={confirmLabel}
      isLoading={isLoading}
      onConfirm={onConfirm}
      onCancel={onDone}
    />
  );
}
