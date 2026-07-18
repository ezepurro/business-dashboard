import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  function handleCreated(companyId: string) {
    setIsModalOpen(false);
    navigate(ROUTES.companyDetail(companyId));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Companies</h1>
          <p className="mt-1 text-sm text-foreground-secondary">
            Manage every business workspace you own.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="cursor-pointer">
          New company
        </Button>
      </div>

      <div className="mt-8">
        {isLoading && <Spinner label="Loading companies…" />}

        {isError && <AlertBanner message="We couldn't load your companies. Please try again." />}

        {!isLoading && !isError && companies?.length === 0 && (
          <EmptyState
            title="No companies yet"
            description="Create your first company to start uploading datasets and viewing KPIs."
            action={
              <Button onClick={() => setIsModalOpen(true)} className="cursor-pointer">
                Create your first company
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
