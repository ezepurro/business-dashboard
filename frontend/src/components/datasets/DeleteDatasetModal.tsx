import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDeleteDataset } from '../../hooks/useDatasets';
import { parseApiError } from '../../utils/getErrorMessage';
import type { Dataset } from '../../types/dataset.types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertBanner } from '../ui/AlertBanner';

interface DeleteDatasetModalProps {
  companyId: string;
  dataset: Dataset;
  onClose: () => void;
}

export function DeleteDatasetModal({ companyId, dataset, onClose }: DeleteDatasetModalProps) {
  const { t } = useTranslation();
  const deleteDataset = useDeleteDataset(companyId);
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);

    deleteDataset.mutate(dataset._id, {
      onSuccess: onClose,
      onError: (deleteError) => setError(parseApiError(deleteError).message),
    });
  }

  return (
    <Modal title={t('datasets.deleteModalTitle')} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {error && <AlertBanner message={error} />}

        <p className="text-sm text-foreground-secondary">
          {t('datasets.deleteModalMessage', { filename: dataset.originalFilename })}
        </p>

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="cursor-pointer">
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            isLoading={deleteDataset.isPending}
            className="cursor-pointer"
          >
            {t('common.delete')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
