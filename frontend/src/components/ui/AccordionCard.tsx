import { useState, type ReactNode } from 'react';
import { Card } from './Card';

interface AccordionCardProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function AccordionCard({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: AccordionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between"
      >
        <div className="text-left">
          <h3 className="text-lg font-semibold">{title}</h3>

          {subtitle && <p className="text-sm text-foreground-secondary">{subtitle}</p>}
        </div>

        <span className={`text-xl transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && <div className="mt-6">{children}</div>}
    </Card>
  );
}
