import { KpiStatTile } from '../charts/KpiStatTile';
import { RevenueTrendChart } from '../charts/RevenueTrendChart';

const SAMPLE_TRENDS = [
  { month: 'February', revenue: 48200 },
  { month: 'March', revenue: 61300 },
  { month: 'April', revenue: 55900 },
  { month: 'May', revenue: 74800 },
  { month: 'June', revenue: 69200 },
  { month: 'July', revenue: 88100 },
];

export function KpiPanelDemo() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-2xl shadow-black/20">
      <div className="grid grid-cols-2 gap-3">
        <KpiStatTile label="Total revenue" value="$397,500" />
        <KpiStatTile label="Average ticket" value="$68.40" />
      </div>
      <div className="mt-4">
        <RevenueTrendChart data={SAMPLE_TRENDS} currency="USD" />
      </div>
    </div>
  );
}
