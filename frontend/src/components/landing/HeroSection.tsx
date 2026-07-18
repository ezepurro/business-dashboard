import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { Button } from '../ui/Button';
import { HeroBackground } from './HeroBackground';

export function HeroSection() {
  const { status } = useAuth();
  const isAuthenticated = status === 'authenticated';

  return (
    <section className="relative overflow-hidden border-b border-border">
      <HeroBackground />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start px-6 py-32 sm:py-40">
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Business Intelligence for growing companies
        </span>

        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-foreground sm:text-7xl">
          Spreadsheets in.
          <br />
          Clarity out.
        </h1>

        <p className="mt-6 max-w-xl text-lg text-foreground-secondary">
          Business Dashboard turns raw sales spreadsheets into decision-ready KPIs and dashboards —
          automatically, for every company you run.
        </p>

        <div className="mt-10 flex items-center gap-3">
          {isAuthenticated ? (
            <Link to={ROUTES.companies}>
              <Button className="cursor-pointer px-6 py-3 text-base">Go to my companies</Button>
            </Link>
          ) : (
            <>
              <Link to={ROUTES.register}>
                <Button className="cursor-pointer px-6 py-3 text-base">Get started free</Button>
              </Link>
              <Link to={ROUTES.login}>
                <Button variant="secondary" className="cursor-pointer px-6 py-3 text-base">
                  Log in
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
