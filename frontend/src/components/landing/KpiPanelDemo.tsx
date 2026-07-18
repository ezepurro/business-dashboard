import { useTranslation } from 'react-i18next';
import { KpiStatTile } from '../charts/KpiStatTile';
import { RevenueTrendChart } from '../charts/RevenueTrendChart';
import { resolveLocale } from '../../utils/format';

const SAMPLE_REVENUE = [48200, 61300, 55900, 74800, 69200, 88100];

export function KpiPanelDemo() {
  const { t } = useTranslation();
  const monthFormatter = new Intl.DateTimeFormat(resolveLocale(), { month: 'long' });
  const now = new Date();

  const sampleTrends = SAMPLE_REVENUE.map((revenue, i) => ({
    month: monthFormatter.format(new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)),
    revenue,
  }));

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-2xl shadow-black/20">
      <div className="grid grid-cols-2 gap-3">
        <KpiStatTile label={t('kpis.totalRevenue')} value="$397,500" />
        <KpiStatTile label={t('kpis.averageTicket')} value="$68.40" />
      </div>
      <div className="mt-4">
        <RevenueTrendChart data={sampleTrends} currency="USD" />
      </div>
    </div>
  );
}
