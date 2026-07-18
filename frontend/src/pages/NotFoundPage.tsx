import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold text-foreground">Page not found</h1>
      <p className="text-foreground-secondary">The page you're looking for doesn't exist.</p>
      <Link to={ROUTES.home}>
        <Button>Back home</Button>
      </Link>
    </div>
  );
}
