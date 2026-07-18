import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/ui/Spinner';
import { ROUTES } from '../constants/routes';

export function RequireAuth() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <Spinner label="Checking your session…" />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <Outlet />;
}
