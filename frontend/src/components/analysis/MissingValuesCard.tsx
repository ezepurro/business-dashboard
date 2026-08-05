import { useTranslation } from 'react-i18next';

import type { MissingValues } from '../../types/analysis.types';

interface Props {
  missingValues: MissingValues;
}

export function MissingValuesCard({ missingValues }: Props) {
  const { t } = useTranslation();

  const entries = Object.entries(missingValues);

  return (
    <div className="rounded-lg border border-border bg-background p-5">
      {entries.length === 0 ? (
        <p className="text-sm text-muted">{t('analysis.noMissingValues')}</p>
      ) : (
        <div className="space-y-2">
          {entries.map(([column, count]) => (
            <div
              key={column}
              className="flex items-center justify-between rounded-md border border-border px-3 py-2"
            >
              <span className="font-medium">{column}</span>

              <span className="text-sm text-muted">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
