import { useTranslation } from 'react-i18next';
import { ArrowRightIcon, ChartIcon, GridIcon, UploadIcon } from './icons';

interface Offering {
  title: string;
  description: string;
}

const OFFERING_META = [
  { anchor: '#ingestion', icon: UploadIcon },
  { anchor: '#kpis', icon: ChartIcon },
  { anchor: '#workspaces', icon: GridIcon },
];

export function ProductOfferings() {
  const { t } = useTranslation();
  const offerings = t('landing.offerings.items', { returnObjects: true }) as Offering[];

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-2xl font-semibold text-foreground">{t('landing.offerings.heading')}</h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground-secondary">
          {t('landing.offerings.subheading')}
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {offerings.map((offering, index) => {
            const { anchor, icon: Icon } = OFFERING_META[index];

            return (
              <a
                key={offering.title}
                href={anchor}
                className="group flex flex-col rounded-lg border border-border bg-surface p-6 transition hover:border-primary"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Icon />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{offering.title}</h3>
                <p className="mt-2 flex-1 text-sm text-foreground-secondary">{offering.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  {t('common.learnMore')}
                  <ArrowRightIcon
                    width={16}
                    height={16}
                    className="transition group-hover:translate-x-0.5"
                  />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
