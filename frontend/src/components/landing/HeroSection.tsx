import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { Button } from '../ui/Button';
import { HeroBackground } from './HeroBackground';

export function HeroSection() {
  const { status } = useAuth();
  const { t } = useTranslation();
  const isAuthenticated = status === 'authenticated';

  return (
    <section className="relative overflow-hidden border-b border-border">
      <HeroBackground />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start px-6 py-32 sm:py-40">
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {t('landing.hero.badge')}
        </span>

        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-foreground sm:text-7xl">
          {t('landing.hero.headlineLine1')}
          <br />
          {t('landing.hero.headlineLine2')}
        </h1>

        <p className="mt-6 max-w-xl text-lg text-foreground-secondary">{t('landing.hero.subtitle')}</p>

        <div className="mt-10 flex items-center gap-3">
          {isAuthenticated ? (
            <Link to={ROUTES.companies}>
              <Button className="cursor-pointer px-6 py-3 text-base">
                {t('common.goToMyCompanies')}
              </Button>
            </Link>
          ) : (
            <>
              <Link to={ROUTES.register}>
                <Button className="cursor-pointer px-6 py-3 text-base">
                  {t('common.getStartedFree')}
                </Button>
              </Link>
              <Link to={ROUTES.login}>
                <Button variant="secondary" className="cursor-pointer px-6 py-3 text-base">
                  {t('common.logIn')}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
