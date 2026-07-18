import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const STEPS = [
  {
    title: 'Create your company',
    description: 'Set up one or more company workspaces to keep every business you manage completely isolated.',
  },
  {
    title: 'Upload your data',
    description: 'Drop in a CSV or Excel export of your sales — up to 15MB — straight from the tools you already use.',
  },
  {
    title: 'Get instant KPIs',
    description: 'Total revenue, average ticket, top product and monthly trends, rendered as ready-to-read dashboards.',
  },
];

const FEATURES = [
  {
    title: 'Multi-company workspaces',
    description: 'Segment every business into its own isolated space — switch between them without mixing data.',
  },
  {
    title: 'Secure by design',
    description: 'Passwords hashed with bcrypt and session handling built on short-lived JWT access tokens.',
  },
  {
    title: 'Automatic KPI extraction',
    description: 'No formulas to write — revenue, average ticket, top-selling product and trends are computed for you.',
  },
  {
    title: 'Decoupled file storage',
    description: 'Uploaded files live in dedicated object storage, kept separate from your operational database.',
  },
  {
    title: 'Built for growing teams',
    description: 'List, filter and manage every dataset you upload, with a clear processing status at every step.',
  },
  {
    title: 'Responsive dashboards',
    description: 'Designed to work equally well on desktop, tablet and mobile.',
  },
];

export function LandingPage() {
  const { status } = useAuth();
  const isAuthenticated = status === 'authenticated';

  return (
    <div className="flex flex-col">
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Turn spreadsheets into business dashboards, automatically
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-foreground-secondary">
          Business Dashboard is a Business Intelligence platform for small and medium-sized
          businesses. Upload your sales data and get interactive KPIs and charts in seconds — no
          spreadsheets, no manual reporting.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          {isAuthenticated ? (
            <Link to={ROUTES.companies}>
              <Button>Go to my companies</Button>
            </Link>
          ) : (
            <>
              <Link to={ROUTES.register}>
                <Button>Get started for free</Button>
              </Link>
              <Link to={ROUTES.login}>
                <Button variant="secondary">Log in</Button>
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-semibold text-foreground">How it works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <Card key={step.title}>
                <span className="text-sm font-semibold text-primary">Step {index + 1}</span>
                <h3 className="mt-2 text-base font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-foreground-secondary">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-2xl font-semibold text-foreground">
          Everything an SMB needs to understand its numbers
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-foreground-secondary">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {!isAuthenticated && (
        <section className="border-t border-border bg-surface py-16 text-center">
          <h2 className="text-2xl font-semibold text-foreground">Ready to see your business in numbers?</h2>
          <p className="mt-2 text-foreground-secondary">
            Create a free account and upload your first dataset in minutes.
          </p>
          <div className="mt-6">
            <Link to={ROUTES.register}>
              <Button>Create your account</Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
