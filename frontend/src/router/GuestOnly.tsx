import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

/** Keeps already-authenticated users off /auth/login and /auth/register. */
export function GuestOnly() {
  const { status } = useAuth();

  if (status === 'authenticated') {
    return <Navigate to={ROUTES.companies} replace />;
  }

  return <Outlet />;
}
