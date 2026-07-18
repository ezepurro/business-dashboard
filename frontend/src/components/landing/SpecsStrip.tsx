import { useTranslation } from 'react-i18next';

interface Spec {
  value: string;
  label: string;
}

export function SpecsStrip() {
  const { t } = useTranslation();
  const specs = t('landing.specs.items', { returnObjects: true }) as Spec[];

  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-3">
        {specs.map((spec) => (
          <div key={spec.label} className="text-center sm:text-left">
            <p className="font-mono text-4xl font-semibold text-foreground sm:text-5xl">{spec.value}</p>
            <p className="mt-2 text-sm text-foreground-secondary">{spec.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
