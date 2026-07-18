import type { Dataset } from '../../types/dataset.types';
import { useAnalysis } from '../../hooks/useAnalysis';
import { formatCurrency } from '../../utils/format';
import { Modal } from '../ui/Modal';
import { Spinner } from '../ui/Spinner';
import { KpiStatTile } from '../charts/KpiStatTile';
import { RevenueTrendChart } from '../charts/RevenueTrendChart';

interface DatasetAnalysisModalProps {
  dataset: Dataset;
  currency: string;
  onClose: () => void;
}

export function DatasetAnalysisModal({ dataset, currency, onClose }: DatasetAnalysisModalProps) {
  const { data: analysis, isLoading } = useAnalysis(dataset);

  return (
    <Modal title={dataset.originalFilename} onClose={onClose}>
      {isLoading && <Spinner label="Running analysis…" />}

      {analysis && (
        <div className="flex flex-col gap-6">
          <p className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-foreground-secondary">
            The Analytics Service isn't wired up yet — these numbers are sample data so you can
            preview how a finished analysis will look.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <KpiStatTile label="Total revenue" value={formatCurrency(analysis.kpis.totalRevenue, currency)} />
            <KpiStatTile label="Average ticket" value={formatCurrency(analysis.kpis.averageTicket, currency)} />
            <KpiStatTile label="Top product" value={analysis.kpis.topSellingProduct} />
            <KpiStatTile label="Total orders" value={analysis.kpis.totalOrders.toLocaleString('en-US')} />
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">Monthly revenue</h3>
            <RevenueTrendChart data={analysis.monthlyTrends} currency={currency} />
          </div>
        </div>
      )}
    </Modal>
  );
}
