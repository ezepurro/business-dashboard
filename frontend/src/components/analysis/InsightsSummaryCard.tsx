import { Card } from '../ui/Card';
import { useTranslation } from 'react-i18next';
import type { InsightSummary } from '../../types/analysis.types';

interface Props {
  summary: InsightSummary;
}

export function InsightsSummaryCard({ summary }: Props) {
  const { t } = useTranslation();

  const items = [
    {
      label: t('analysis.overallScore'),
      value: summary.dataset_score.toFixed(1),
    },
    {
      label: t('analysis.insights'),
      value: summary.total_insights,
    },
    {
      label: t('analysis.warnings'),
      value: summary.high_priority_insights,
    },
    {
      label: t('analysis.critical'),
      value: summary.critical_insights,
    },
  ];

  return (
    <Card>
      <div className="mb-5">
        <p className="mt-2 text-sm text-foreground-secondary">{summary.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg border border-border bg-background p-4">
            <div className="text-3xl font-bold text-primary">{item.value}</div>

            <div className="mt-1 text-sm text-foreground-secondary">{item.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
