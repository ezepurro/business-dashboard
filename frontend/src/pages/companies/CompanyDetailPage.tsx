import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCompany } from '../../hooks/useCompanies';
import { useDatasets } from '../../hooks/useDatasets';
import { ROUTES } from '../../constants/routes';
import { formatDate } from '../../utils/format';
import { Spinner } from '../../components/ui/Spinner';
import { AlertBanner } from '../../components/ui/AlertBanner';
import { EmptyState } from '../../components/ui/EmptyState';
import { UploadDatasetButton } from '../../components/datasets/UploadDatasetButton';
import { DatasetList } from '../../components/datasets/DatasetList';
import { DatasetAnalysisModal } from '../../components/datasets/DatasetAnalysisModal';
import { DeleteDatasetModal } from '../../components/datasets/DeleteDatasetModal';
import type { Dataset } from '../../types/dataset.types';

export function CompanyDetailPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const { t } = useTranslation();
  const { data: company, isLoading: isCompanyLoading, isError: isCompanyError } = useCompany(companyId!);
  const { data: datasetsPage, isLoading: areDatasetsLoading, isError: areDatasetsError } = useDatasets(companyId!);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [datasetToDelete, setDatasetToDelete] = useState<Dataset | null>(null);

  if (isCompanyLoading) {
    return <Spinner label={t('companyDetail.loadingCompany')} />;
  }

  if (isCompanyError || !company) {
    return <AlertBanner message={t('companyDetail.loadCompanyError')} />;
  }

  return (
    <div>
      <Link to={ROUTES.companies} className="text-sm font-medium text-primary">
        ← {t('nav.myCompanies')}
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{company.name}</h1>
          <p className="mt-1 text-sm text-foreground-secondary">
            {company.industry ?? t('companies.noIndustry')}
          </p>
          <dl className="mt-3 flex gap-6 text-xs text-muted">
            <div>
              <dt className="uppercase tracking-wide">{t('companies.currency')}</dt>
              <dd className="mt-0.5 text-foreground-secondary">{company.currency}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-wide">{t('companies.founded')}</dt>
              <dd className="mt-0.5 text-foreground-secondary">{formatDate(company.foundedAt)}</dd>
            </div>
          </dl>
        </div>

        <UploadDatasetButton companyId={company._id} />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">{t('companyDetail.datasetsHeading')}</h2>

        <div className="mt-4">
          {areDatasetsLoading && <Spinner label={t('companyDetail.loadingDatasets')} />}

          {areDatasetsError && <AlertBanner message={t('companyDetail.loadDatasetsError')} />}

          {!areDatasetsLoading && datasetsPage && datasetsPage.data.length === 0 && (
            <EmptyState
              title={t('companyDetail.emptyTitle')}
              description={t('companyDetail.emptyDescription')}
            />
          )}

          {!areDatasetsLoading && datasetsPage && datasetsPage.data.length > 0 && (
            <DatasetList
              datasets={datasetsPage.data}
              onSelect={setSelectedDataset}
              onDelete={setDatasetToDelete}
            />
          )}
        </div>
      </div>

      {selectedDataset && (
        <DatasetAnalysisModal
          dataset={selectedDataset}
          currency={company.currency}
          onClose={() => setSelectedDataset(null)}
        />
      )}

      {datasetToDelete && (
        <DeleteDatasetModal
          companyId={company._id}
          dataset={datasetToDelete}
          onClose={() => setDatasetToDelete(null)}
        />
      )}
    </div>
  );
}
