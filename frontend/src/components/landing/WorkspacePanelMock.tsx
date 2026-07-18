import { useTranslation } from 'react-i18next';

const COMPANIES = [
  { name: 'Acme Retail', industryKey: 'retail', currency: 'USD' },
  { name: 'Northwind Traders', industryKey: 'wholesale', currency: 'EUR' },
  { name: 'Bluepeak Coffee Co.', industryKey: 'foodBeverage', currency: 'USD' },
  { name: 'Ferra Hardware', industryKey: 'construction', currency: 'ARS' },
] as const;

export function WorkspacePanelMock() {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-2xl shadow-black/20">
      <div className="grid grid-cols-2 gap-3">
        {COMPANIES.map((company) => (
          <div key={company.name} className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm font-semibold text-foreground">{company.name}</p>
            <p className="mt-1 text-xs text-foreground-secondary">
              {t(`landing.mockPanels.workspace.industries.${company.industryKey}`)}
            </p>
            <p className="mt-3 text-[10px] font-medium uppercase tracking-wide text-muted">
              {company.currency}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
