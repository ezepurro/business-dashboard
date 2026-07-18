interface KpiStatTileProps {
  label: string;
  value: string;
}

export function KpiStatTile({ label, value }: KpiStatTileProps) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
