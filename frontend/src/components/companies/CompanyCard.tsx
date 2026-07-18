import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Company } from '../../types/company.types';
import { ROUTES } from '../../constants/routes';
import { Card } from '../ui/Card';
import { formatDate } from '../../utils/format';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const { t } = useTranslation();

  return (
    <Link to={ROUTES.companyDetail(company._id)}>
      <Card className="h-full transition hover:border-primary">
        <h3 className="text-base font-semibold text-foreground">{company.name}</h3>
        <p className="mt-1 text-sm text-foreground-secondary">
          {company.industry ?? t('companies.noIndustry')}
        </p>

        <dl className="mt-4 flex items-center justify-between text-xs text-muted">
          <div>
            <dt className="uppercase tracking-wide">{t('companies.currency')}</dt>
            <dd className="mt-0.5 text-foreground-secondary">{company.currency}</dd>
          </div>
          <div className="text-right">
            <dt className="uppercase tracking-wide">{t('companies.founded')}</dt>
            <dd className="mt-0.5 text-foreground-secondary">{formatDate(company.foundedAt)}</dd>
          </div>
        </dl>
      </Card>
    </Link>
  );
}
