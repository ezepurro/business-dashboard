import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCompanies } from '../../hooks/useCompanies';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { AlertBanner } from '../../components/ui/AlertBanner';
import { CompanyCard } from '../../components/companies/CompanyCard';
import { CreateCompanyModal } from '../../components/companies/CreateCompanyModal';

export function CompaniesPage() {
  const { data: companies, isLoading, isError } = useCompanies();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  function handleCreated(companyId: string) {
    setIsModalOpen(false);
    navigate(ROUTES.companyDetail(companyId));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{t('companies.title')}</h1>
          <p className="mt-1 text-sm text-foreground-secondary">{t('companies.subtitle')}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="cursor-pointer">
          {t('companies.newCompany')}
        </Button>
      </div>

      <div className="mt-8">
        {isLoading && <Spinner label={t('companies.loading')} />}

        {isError && <AlertBanner message={t('companies.loadError')} />}

        {!isLoading && !isError && companies?.length === 0 && (
          <EmptyState
            title={t('companies.emptyTitle')}
            description={t('companies.emptyDescription')}
            action={
              <Button onClick={() => setIsModalOpen(true)} className="cursor-pointer">
                {t('companies.createFirst')}
              </Button>
            }
          />
        )}

        {!isLoading && companies && companies.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreateCompanyModal onClose={() => setIsModalOpen(false)} onCreated={handleCreated} />
      )}
    </div>
  );
}
