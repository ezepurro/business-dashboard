import { useTranslation } from 'react-i18next';
import type { Dataset } from '../../types/dataset.types';
import { formatDate, formatFileSize } from '../../utils/format';
import { DatasetStatusBadge } from './DatasetStatusBadge';
import { TrashIcon } from './icons';

interface DatasetListProps {
  datasets: Dataset[];
  onSelect: (dataset: Dataset) => void;
  onDelete: (dataset: Dataset) => void;
}

export function DatasetList({ datasets, onSelect, onDelete }: DatasetListProps) {
  const { t } = useTranslation();

  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
      {datasets.map((dataset) => (
        <li key={dataset._id} className="flex items-center gap-2 px-2">
          <button
            type="button"
            onClick={() => onSelect(dataset)}
            className="flex min-w-0 flex-1 items-center justify-between gap-4 px-2 py-3 text-left transition hover:bg-background"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{dataset.originalFilename}</p>
              <p className="mt-0.5 text-xs text-muted">
                {t('datasets.uploadedOn', {
                  size: formatFileSize(dataset.size),
                  date: formatDate(dataset.createdAt),
                })}
              </p>
            </div>
            <DatasetStatusBadge status={dataset.status} />
          </button>

          {dataset.status === 'UPLOADED' && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(dataset);
              }}
              aria-label={t('datasets.deleteAction')}
              title={t('datasets.deleteAction')}
              className="shrink-0 cursor-pointer rounded-md p-2 text-muted transition hover:bg-danger/10 hover:text-danger"
            >
              <TrashIcon />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
