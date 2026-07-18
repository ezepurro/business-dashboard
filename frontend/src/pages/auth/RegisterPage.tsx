import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { parseApiError } from '../../utils/getErrorMessage';
import type { ApiFieldError } from '../../types/api.types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { AlertBanner } from '../../components/ui/AlertBanner';

function fieldError(errors: ApiFieldError[], field: string) {
  return errors.find((e) => e.field === field)?.message;
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldError[]>([]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors([]);
    setIsSubmitting(true);

    try {
      await register({ username, name, email, password });
      navigate(ROUTES.companies);
    } catch (error) {
      const parsed = parseApiError(error);
      setFormError(parsed.message);
      setFieldErrors(parsed.fieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-20">
      <h1 className="text-2xl font-semibold text-foreground">{t('auth.register.title')}</h1>
      <p className="mt-1 text-sm text-foreground-secondary">{t('auth.register.subtitle')}</p>

      <Card className="mt-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formError && <AlertBanner message={formError} />}

          <Input
            label={t('auth.register.usernameLabel')}
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={fieldError(fieldErrors, 'username')}
          />

          <Input
            label={t('auth.register.fullNameLabel')}
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldError(fieldErrors, 'name')}
          />

          <Input
            label={t('auth.register.emailLabel')}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldError(fieldErrors, 'email')}
          />

          <Input
            label={t('auth.register.passwordLabel')}
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldError(fieldErrors, 'password')}
          />

          <Button type="submit" isLoading={isSubmitting} className="mt-2 cursor-pointer">
            {t('auth.register.submit')}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-foreground-secondary">
        {t('auth.register.haveAccount')}{' '}
        <Link to={ROUTES.login} className="font-medium text-primary">
          {t('auth.register.logIn')}
        </Link>
      </p>
    </div>
  );
}
