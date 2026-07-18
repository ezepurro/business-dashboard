import { ArrowRightIcon, ChartIcon, GridIcon, UploadIcon } from './icons';

const OFFERINGS = [
  {
    anchor: '#ingestion',
    icon: UploadIcon,
    title: 'Smart Ingestion',
    description:
      'Upload .csv or .xlsx sales exports up to 15MB. Every file is validated by extension, MIME type and size before it reaches storage.',
  },
  {
    anchor: '#kpis',
    icon: ChartIcon,
    title: 'Automatic KPIs',
    description:
      'Total revenue, average ticket, top-selling product and monthly trends — computed the moment a dataset finishes processing.',
  },
  {
    anchor: '#workspaces',
    icon: GridIcon,
    title: 'Multi-Company Workspaces',
    description:
      'Every company you manage gets its own isolated space for datasets, KPIs and history — switch between them in one click.',
  },
];

export function ProductOfferings() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-2xl font-semibold text-foreground">What Business Dashboard does</h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground-secondary">
          Three pieces, one pipeline: get data in, turn it into numbers that matter, and keep every
          business you run cleanly separated.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {OFFERINGS.map(({ anchor, icon: Icon, title, description }) => (
            <a
              key={title}
              href={anchor}
              className="group flex flex-col rounded-lg border border-border bg-surface p-6 transition hover:border-primary"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Icon />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-2 flex-1 text-sm text-foreground-secondary">{description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Learn more
                <ArrowRightIcon
                  width={16}
                  height={16}
                  className="transition group-hover:translate-x-0.5"
                />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
