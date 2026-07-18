export function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        className="animate-drift absolute -top-40 right-[-10%] h-[32rem] w-[32rem] rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: 'var(--color-primary)' }}
      />
      <div
        className="animate-pulse-soft absolute bottom-[-12rem] left-[-8%] h-[26rem] w-[26rem] rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: 'var(--color-chart-2)' }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 0%, var(--color-background) 85%)',
        }}
      />
    </div>
  );
}
