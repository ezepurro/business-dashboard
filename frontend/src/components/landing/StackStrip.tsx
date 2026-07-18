const STACK = [
  'React',
  'TypeScript',
  'Node.js / Express',
  'MongoDB',
  'MinIO (S3-compatible)',
  'FastAPI',
  'Pandas',
];

export function StackStrip() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-center text-xs font-medium uppercase tracking-wide text-muted">
          Built on a modern, independently-scalable stack
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {STACK.map((item) => (
            <span key={item} className="text-sm font-medium text-foreground-secondary">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
