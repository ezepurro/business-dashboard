import { BoltIcon, LayersIcon, ShieldIcon } from './icons';

const PILLARS = [
  {
    icon: BoltIcon,
    title: 'Skip the manual reporting',
    description: 'Drop in a spreadsheet and get revenue, ticket size and trends without a single formula.',
  },
  {
    icon: LayersIcon,
    title: 'One account, every company',
    description: 'Run reporting for as many businesses as you manage, each fully isolated from the others.',
  },
  {
    icon: ShieldIcon,
    title: 'Built on a secure core',
    description: 'bcrypt-hashed credentials, short-lived JWT sessions, and files kept out of your database entirely.',
  },
];

export function PillarsRow() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <div key={title}>
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm text-foreground-secondary">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
