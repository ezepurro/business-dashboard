import { useTranslation } from 'react-i18next';
import type { Dataset } from '../../types/dataset.types';
import { useAnalysis } from '../../hooks/useAnalysis';
import { formatCurrency, formatNumber } from '../../utils/format';

import { Modal } from '../ui/Modal';
import { Spinner } from '../ui/Spinner';
import { AlertBanner } from '../ui/AlertBanner';
import { AccordionCard } from '../ui/AccordionCard';

import { KpiStatTile } from '../charts/KpiStatTile';

import { DatasetOverviewCard } from '../analysis/DatasetOverviewCard';
import { QualityMetricsCard } from '../analysis/QualityMetricsCard';
import { MissingValuesCard } from '../analysis/MissingValuesCard';
import { TransformationCard } from '../analysis/TransformationCard';
import { CleaningCard } from '../analysis/CleaningCard';
import { AnalyticsChartsCard } from '../analysis/AnalyticsChartsCard';
import { InsightsSummaryCard } from '../analysis/InsightsSummaryCard';
import { InsightsGroupsCard } from '../analysis/InsightsGroupsCard';

interface DatasetAnalysisModalProps {
  dataset: Dataset;
  currency: string;
  onClose: () => void;
}

export function DatasetAnalysisModal({ dataset, currency, onClose }: DatasetAnalysisModalProps) {
  const { t } = useTranslation();

  const { data: analysis, isLoading, isError } = useAnalysis(dataset);

  if (isLoading) {
    return (
      <Modal title={dataset.originalFilename} onClose={onClose}>
        <Spinner label={t('analysisModal.runningAnalysis')} />
      </Modal>
    );
  }

  if (isError || !analysis) {
    return (
      <Modal title={dataset.originalFilename} onClose={onClose}>
        <AlertBanner message={t('analysisModal.loadError')} />
      </Modal>
    );
  }

  if (analysis.status === 'FAILED') {
    return (
      <Modal title={dataset.originalFilename} onClose={onClose}>
        <AlertBanner message={analysis.errorMessage ?? t('analysisModal.processingFailed')} />
      </Modal>
    );
  }

  const profile = analysis.profile;

  const totalOrders = profile.metadata.rows;

  const revenueChart = profile.analytics.charts.find(
    (chart) =>
      chart.title.toLowerCase().includes('revenue') || chart.title.toLowerCase().includes('venta'),
  );

  const totalRevenue =
    revenueChart?.series[0]?.points.reduce((sum, point) => sum + point.value, 0) ?? 0;

  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const topSellingProduct =
    profile.insights.insights.find((insight) => insight.category === 'products')?.title ?? '-';

  return (
    <Modal title={dataset.originalFilename} onClose={onClose}>
      <div className="flex flex-col gap-6">
        {/* Overview */}
        <div className="grid gap-6 xl:grid-cols-2">
          <DatasetOverviewCard analysis={analysis} />

          <QualityMetricsCard quality={profile.quality} />
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiStatTile
            label={t('kpis.totalRevenue')}
            value={formatCurrency(totalRevenue, currency)}
          />

          <KpiStatTile
            label={t('kpis.averageTicket')}
            value={formatCurrency(averageTicket, currency)}
          />

          <KpiStatTile label={t('kpis.topProduct')} value={topSellingProduct} />

          <KpiStatTile label={t('kpis.totalOrders')} value={formatNumber(totalOrders)} />
        </div>

        {/* Missing Values */}
        <AccordionCard title={t('analysis.missingValues')} defaultOpen={false}>
          <MissingValuesCard missingValues={profile.missing_values} />
        </AccordionCard>

        {/* Cleaning */}
        <AccordionCard title={t('analysis.cleaning')} defaultOpen={false}>
          <CleaningCard cleaning={profile.cleaning} />
        </AccordionCard>

        {/* Transformations */}
        <AccordionCard title={t('analysis.transformation.title')} defaultOpen={false}>
          <TransformationCard transformation={profile.transformation} />
        </AccordionCard>

        {/* Charts */}
        <AccordionCard title={t('analysis.chartsTile')} defaultOpen={false}>
          <AnalyticsChartsCard analytics={profile.analytics} />
        </AccordionCard>

        {/* Executive Summary */}
        <AccordionCard title={t('analysis.executiveSummary')} defaultOpen={false}>
          <InsightsSummaryCard summary={profile.insights.summary} />
        </AccordionCard>

        {/* Business Insights */}
        <AccordionCard title={t('analysis.insights')} defaultOpen={false}>
          <InsightsGroupsCard groups={profile.insights.groups} />
        </AccordionCard>
      </div>
    </Modal>
  );
}
