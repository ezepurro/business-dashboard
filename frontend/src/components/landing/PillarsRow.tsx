import { useTranslation } from 'react-i18next';
import { BoltIcon, LayersIcon, ShieldIcon } from './icons';

interface Pillar {
  title: string;
  description: string;
}

const PILLAR_ICONS = [BoltIcon, LayersIcon, ShieldIcon];

export function PillarsRow() {
  const { t } = useTranslation();
  const pillars = t('landing.pillars.items', { returnObjects: true }) as Pillar[];

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = PILLAR_ICONS[index];

            return (
              <div key={pillar.title}>
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{pillar.title}</h3>
                <p className="mt-1.5 text-sm text-foreground-secondary">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
