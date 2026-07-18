import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { Button } from '../ui/Button';

export function Navbar() {
  const { user, status, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate(ROUTES.home);
  }

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to={ROUTES.home} className="text-lg font-semibold text-foreground">
          Business Dashboard
        </Link>

        <nav className="flex items-center gap-4">
          {status === 'authenticated' && user && (
            <>
              <Link
                to={ROUTES.companies}
                className="text-sm font-medium text-foreground-secondary hover:text-foreground"
              >
                My Companies
              </Link>
              <span className="hidden text-sm text-foreground-secondary sm:inline">{user.name}</span>
              <Button variant="secondary" onClick={handleLogout}>
                Log out
              </Button>
            </>
          )}

          {status === 'unauthenticated' && (
            <>
              <Link
                to={ROUTES.login}
                className="text-sm font-medium text-foreground-secondary hover:text-foreground"
              >
                Log in
              </Link>
              <Link to={ROUTES.register}>
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
