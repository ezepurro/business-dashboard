export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-6xl px-6 text-sm text-foreground-secondary">
        <p>© {new Date().getFullYear()} Business Dashboard. Built for growing SMBs.</p>
      </div>
    </footer>
  );
}
