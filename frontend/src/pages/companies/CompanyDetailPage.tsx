import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
import type { Dataset } from '../../types/dataset.types';

export function CompanyDetailPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const { data: company, isLoading: isCompanyLoading, isError: isCompanyError } = useCompany(companyId!);
  const { data: datasetsPage, isLoading: areDatasetsLoading, isError: areDatasetsError } = useDatasets(companyId!);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  if (isCompanyLoading) {
    return <Spinner label="Loading company…" />;
  }

  if (isCompanyError || !company) {
    return <AlertBanner message="We couldn't load this company." />;
  }

  return (
    <div>
      <Link to={ROUTES.companies} className="text-sm font-medium text-primary">
        ← My Companies
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{company.name}</h1>
          <p className="mt-1 text-sm text-foreground-secondary">{company.industry ?? 'No industry set'}</p>
          <dl className="mt-3 flex gap-6 text-xs text-muted">
            <div>
              <dt className="uppercase tracking-wide">Currency</dt>
              <dd className="mt-0.5 text-foreground-secondary">{company.currency}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-wide">Founded</dt>
              <dd className="mt-0.5 text-foreground-secondary">{formatDate(company.foundedAt)}</dd>
            </div>
          </dl>
        </div>

        <UploadDatasetButton companyId={company._id} />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">Datasets</h2>

        <div className="mt-4">
          {areDatasetsLoading && <Spinner label="Loading datasets…" />}

          {areDatasetsError && <AlertBanner message="We couldn't load the datasets for this company." />}

          {!areDatasetsLoading && datasetsPage && datasetsPage.data.length === 0 && (
            <EmptyState
              title="No datasets yet"
              description="Upload a CSV or Excel file to see it listed here and preview its analysis."
            />
          )}

          {!areDatasetsLoading && datasetsPage && datasetsPage.data.length > 0 && (
            <DatasetList datasets={datasetsPage.data} onSelect={setSelectedDataset} />
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
    </div>
  );
}
