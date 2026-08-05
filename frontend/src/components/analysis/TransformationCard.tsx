import { useTranslation } from 'react-i18next';
import type { TransformationReport } from '../../types/analysis.types';
import { Card } from '../ui/Card';

interface Props {
  transformation: TransformationReport;
}

export function TransformationCard({ transformation }: Props) {
  const { t } = useTranslation();

  return (
    <Card>
      <div className="mb-4">
        <p className="text-sm text-foreground-secondary">{t('analysis.transformation.subtitle')}</p>
      </div>

      {transformation.actions.length === 0 ? (
        <p className="text-sm text-foreground-secondary">{t('analysis.transformation.empty')}</p>
      ) : (
        <div className="space-y-4">
          {transformation.actions.map((action, index) => (
            <div key={index} className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium capitalize text-foreground">
                  {action.transformation}
                </span>

                <span className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {(action.confidence * 100).toFixed(0)}%
                </span>
              </div>

              <p className="mt-2 text-sm text-foreground-secondary">{action.description}</p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded bg-muted px-2 py-1">{action.column}</span>

                <span
                  className={`rounded px-2 py-1 ${
                    action.automatic
                      ? 'bg-green-500/10 text-green-600'
                      : 'bg-yellow-500/10 text-yellow-700'
                  }`}
                >
                  {action.automatic ? t('analysis.common.automatic') : t('analysis.common.manual')}
                </span>
              </div>

              {action.recommendation && (
                <div className="mt-3 rounded bg-primary/5 p-3 text-sm text-foreground-secondary">
                  {action.recommendation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
