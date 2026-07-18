import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { parseApiError } from '../../utils/getErrorMessage';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { AlertBanner } from '../../components/ui/AlertBanner';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(ROUTES.companies);
    } catch (error) {
      setFormError(parseApiError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-20">
      <h1 className="text-2xl font-semibold text-foreground">{t('auth.login.title')}</h1>
      <p className="mt-1 text-sm text-foreground-secondary">{t('auth.login.subtitle')}</p>

      <Card className="mt-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formError && <AlertBanner message={formError} />}

          <Input
            label={t('auth.login.emailLabel')}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label={t('auth.login.passwordLabel')}
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" isLoading={isSubmitting} className="mt-2 cursor-pointer">
            {t('auth.login.submit')}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-foreground-secondary">
        {t('auth.login.noAccount')}{' '}
        <Link to={ROUTES.register} className="font-medium text-primary">
          {t('auth.login.signUp')}
        </Link>
      </p>
    </div>
  );
}
