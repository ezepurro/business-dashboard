import { Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/ui/Spinner';
import { ROUTES } from '../constants/routes';

export function RequireAuth() {
  const { status } = useAuth();
  const { t } = useTranslation();

  if (status === 'loading') {
    return <Spinner label={t('ui.checkingSession')} />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <Outlet />;
}
