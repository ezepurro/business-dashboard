import { Badge } from '../ui/Badge';
import type { DatasetStatus } from '../../types/dataset.types';

const STATUS_CONFIG: Record<DatasetStatus, { label: string; tone: 'neutral' | 'success' | 'warning' | 'danger' }> = {
  UPLOADING: { label: 'Uploading', tone: 'neutral' },
  UPLOADED: { label: 'Uploaded', tone: 'neutral' },
  PROCESSING: { label: 'Processing', tone: 'warning' },
  READY: { label: 'Ready', tone: 'success' },
  FAILED: { label: 'Failed', tone: 'danger' },
  DELETED: { label: 'Deleted', tone: 'neutral' },
};

export function DatasetStatusBadge({ status }: { status: DatasetStatus }) {
  const config = STATUS_CONFIG[status];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}
