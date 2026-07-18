const SPECS = [
  { value: '2.5s', label: 'max to compute KPIs for a 50,000-row dataset' },
  { value: '15MB', label: 'per .csv or .xlsx upload, validated before it ever hits storage' },
  { value: 'Unlimited', label: 'isolated company workspaces per account' },
];

export function SpecsStrip() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-3">
        {SPECS.map((spec) => (
          <div key={spec.label} className="text-center sm:text-left">
            <p className="font-mono text-4xl font-semibold text-foreground sm:text-5xl">{spec.value}</p>
            <p className="mt-2 text-sm text-foreground-secondary">{spec.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
