import { useTranslation } from 'react-i18next';

import type { Analysis } from '../../types/analysis.types';

interface Props {
  analysis: Analysis;
}

export function DatasetOverviewCard({ analysis }: Props) {
  const { t } = useTranslation();

  const { metadata, quality } = analysis.profile;

  return (
    <div className="rounded-lg border border-border bg-background p-5">
      <h3 className="mb-4 text-base font-semibold text-foreground">{t('analysis.overview')}</h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted">{t('analysis.rows')}</p>
          <p className="font-semibold">{metadata.rows.toLocaleString()}</p>
        </div>

        <div>
          <p className="text-muted">{t('analysis.columns')}</p>
          <p className="font-semibold">{metadata.columns}</p>
        </div>

        <div>
          <p className="text-muted">{t('analysis.quality')}</p>
          <p className="font-semibold">{quality.overall_score.toFixed(1)}%</p>
        </div>

        <div>
          <p className="text-muted">{t('analysis.processingTime')}</p>
          <p className="font-semibold">{analysis.processingTime} ms</p>
        </div>

        <div>
          <p className="text-muted">{t('analysis.engine')}</p>
          <p className="font-semibold">{analysis.engineVersion}</p>
        </div>

        <div>
          <p className="text-muted">{t('analysis.python')}</p>
          <p className="font-semibold">{analysis.pythonVersion}</p>
        </div>
      </div>
    </div>
  );
}
