import { useTranslation } from 'react-i18next';

interface SpinnerProps {
  label?: string;
}

export function Spinner({ label }: SpinnerProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center gap-3 py-12 text-foreground-secondary">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <span className="text-sm">{label ?? t('common.loading')}</span>
    </div>
  );
}
