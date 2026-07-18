import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/Badge';
import type { DatasetStatus } from '../../types/dataset.types';

const STATUS_TONE: Record<DatasetStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  UPLOADING: 'neutral',
  UPLOADED: 'neutral',
  PROCESSING: 'warning',
  READY: 'success',
  FAILED: 'danger',
  DELETED: 'neutral',
};

export function DatasetStatusBadge({ status }: { status: DatasetStatus }) {
  const { t } = useTranslation();

  return <Badge tone={STATUS_TONE[status]}>{t(`datasets.status.${status}`)}</Badge>;
}
