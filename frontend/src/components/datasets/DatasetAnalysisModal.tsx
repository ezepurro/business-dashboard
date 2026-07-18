import { useTranslation } from 'react-i18next';
import type { Dataset } from '../../types/dataset.types';
import { useAnalysis } from '../../hooks/useAnalysis';
import { formatCurrency, formatNumber } from '../../utils/format';
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
  const { t } = useTranslation();

  return (
    <Modal title={dataset.originalFilename} onClose={onClose}>
      {isLoading && <Spinner label={t('analysisModal.runningAnalysis')} />}

      {analysis && (
        <div className="flex flex-col gap-6">
          <p className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-foreground-secondary">
            {t('analysisModal.mockNotice')}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <KpiStatTile
              label={t('kpis.totalRevenue')}
              value={formatCurrency(analysis.kpis.totalRevenue, currency)}
            />
            <KpiStatTile
              label={t('kpis.averageTicket')}
              value={formatCurrency(analysis.kpis.averageTicket, currency)}
            />
            <KpiStatTile label={t('kpis.topProduct')} value={analysis.kpis.topSellingProduct} />
            <KpiStatTile label={t('kpis.totalOrders')} value={formatNumber(analysis.kpis.totalOrders)} />
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              {t('analysisModal.monthlyRevenue')}
            </h3>
            <RevenueTrendChart data={analysis.monthlyTrends} currency={currency} />
          </div>
        </div>
      )}
    </Modal>
  );
}
