import { UploadIcon } from './icons';
import { DatasetStatusBadge } from '../datasets/DatasetStatusBadge';

const ROWS = [
  { name: 'q3_sales_export.xlsx', size: '4.2 MB', status: 'READY' as const },
  { name: 'retail_orders_may.csv', size: '1.8 MB', status: 'PROCESSING' as const },
  { name: 'wholesale_2026.xlsx', size: '9.6 MB', status: 'UPLOADED' as const },
];

export function IngestionPanelMock() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between rounded-lg border border-dashed border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <UploadIcon width={16} height={16} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Drop a .csv or .xlsx file</p>
            <p className="text-xs text-muted">up to 15MB</p>
          </div>
        </div>
        <span className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
          Upload
        </span>
      </div>

      <ul className="mt-4 flex flex-col divide-y divide-border">
        {ROWS.map((row) => (
          <li key={row.name} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-foreground">{row.name}</p>
              <p className="text-xs text-muted">{row.size}</p>
            </div>
            <DatasetStatusBadge status={row.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
