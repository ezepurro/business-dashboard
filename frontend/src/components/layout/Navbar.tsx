import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { Button } from '../ui/Button';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  const { user, status, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  async function handleLogout() {
    await logout();
    navigate(ROUTES.home);
  }

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to={ROUTES.home} className="text-lg font-semibold text-foreground">
          {t('nav.brand')}
        </Link>

        <nav className="flex items-center gap-4">
          {status === 'authenticated' && user && (
            <>
              <Link
                to={ROUTES.companies}
                className="text-sm font-medium text-foreground-secondary hover:text-foreground"
              >
                {t('nav.myCompanies')}
              </Link>
              <span className="hidden text-sm text-foreground-secondary sm:inline">
                {user.name}
              </span>
              <Button variant="secondary" onClick={handleLogout} className="cursor-pointer">
                {t('common.logOut')}
              </Button>
            </>
          )}

          {status === 'unauthenticated' && (
            <>
              <Link
                to={ROUTES.login}
                className="text-sm font-medium text-foreground-secondary hover:text-foreground"
              >
                {t('common.logIn')}
              </Link>
              <Link to={ROUTES.register}>
                <Button className="cursor-pointer">{t('common.signUp')}</Button>
              </Link>
            </>
          )}

          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
