import { useTranslation } from 'react-i18next';

import type { AnalysisQuality } from '../../types/analysis.types';

interface Props {
  quality: AnalysisQuality;
}

export function QualityMetricsCard({ quality }: Props) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border border-border bg-background p-5">
      <h3 className="mb-4 text-base font-semibold text-foreground">
        {t('analysis.qualityMetrics')}
      </h3>

      <div className="space-y-4">
        {quality.metrics.map((metric) => (
          <div key={metric.name}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{metric.name}</span>

              <span className="text-sm font-semibold">{metric.score.toFixed(1)}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${metric.score}%`,
                }}
              />
            </div>

            <p className="mt-1 text-xs text-muted">{metric.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
