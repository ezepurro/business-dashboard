import type { ComponentType, ReactNode, SVGProps } from 'react';

interface DeepDiveSectionProps {
  id: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  visual: ReactNode;
  reverse?: boolean;
}

export function DeepDiveSection({
  id,
  icon: Icon,
  eyebrow,
  title,
  description,
  bullets,
  visual,
  reverse = false,
}: DeepDiveSectionProps) {
  return (
    <section id={id} className="scroll-mt-20 border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className={reverse ? 'lg:order-2' : undefined}>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Icon />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
            <h3 className="mt-2 text-2xl font-semibold text-foreground">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">{description}</p>

            <ul className="mt-6 flex flex-col gap-3">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5 text-sm text-foreground-secondary">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          <div className={reverse ? 'lg:order-1' : undefined}>{visual}</div>
        </div>
      </div>
    </section>
  );
}
