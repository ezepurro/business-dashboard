import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../constants/routes';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold text-foreground">{t('notFound.title')}</h1>
      <p className="text-foreground-secondary">{t('notFound.description')}</p>
      <Link to={ROUTES.home}>
        <Button>{t('notFound.backHome')}</Button>
      </Link>
    </div>
  );
}
