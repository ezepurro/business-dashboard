import { useTranslation } from 'react-i18next';

import type { AnalysisProfile } from '../../types/analysis.types';

import { formatCurrency, formatNumber } from '../../utils/format';

import { KpiStatTile } from '../charts/KpiStatTile';

interface Props {
  profile: AnalysisProfile;
  currency: string;
}

export function AnalysisKpisCard({ profile, currency }: Props) {
  const { t } = useTranslation();

  const totalOrders = profile.metadata.rows;

  const revenueChart = profile.analytics.charts.find(
    (chart) =>
      chart.title.toLowerCase().includes('revenue') || chart.title.toLowerCase().includes('venta'),
  );

  const totalRevenue =
    revenueChart?.series[0]?.points.reduce((sum, point) => sum + point.value, 0) ?? 0;

  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const topProductsChart = profile.analytics.charts.find((chart) =>
    chart.title.toLowerCase().includes('top products'),
  );

  const topSellingProduct = topProductsChart?.series[0]?.points[0]?.label ?? '-';

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiStatTile label={t('kpis.totalRevenue')} value={formatCurrency(totalRevenue, currency)} />

      <KpiStatTile
        label={t('kpis.averageTicket')}
        value={formatCurrency(averageTicket, currency)}
      />

      <KpiStatTile label={t('kpis.topProduct')} value={topSellingProduct} />

      <KpiStatTile label={t('kpis.totalOrders')} value={formatNumber(totalOrders)} />
    </div>
  );
}
