import { useTranslation } from 'react-i18next';
import type { Dataset } from '../../types/dataset.types';
import { formatDate, formatFileSize } from '../../utils/format';
import { DatasetStatusBadge } from './DatasetStatusBadge';

interface DatasetListProps {
  datasets: Dataset[];
  onSelect: (dataset: Dataset) => void;
}

export function DatasetList({ datasets, onSelect }: DatasetListProps) {
  const { t } = useTranslation();

  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
      {datasets.map((dataset) => (
        <li key={dataset._id}>
          <button
            type="button"
            onClick={() => onSelect(dataset)}
            className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-background"
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
        </li>
      ))}
    </ul>
  );
}
