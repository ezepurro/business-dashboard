const COMPANIES = [
  { name: 'Acme Retail', industry: 'Retail', currency: 'USD' },
  { name: 'Northwind Traders', industry: 'Wholesale', currency: 'EUR' },
  { name: 'Bluepeak Coffee Co.', industry: 'Food & Beverage', currency: 'USD' },
  { name: 'Ferra Hardware', industry: 'Construction', currency: 'ARS' },
];

export function WorkspacePanelMock() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-2xl shadow-black/20">
      <div className="grid grid-cols-2 gap-3">
        {COMPANIES.map((company) => (
          <div key={company.name} className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm font-semibold text-foreground">{company.name}</p>
            <p className="mt-1 text-xs text-foreground-secondary">{company.industry}</p>
            <p className="mt-3 text-[10px] font-medium uppercase tracking-wide text-muted">
              {company.currency}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
