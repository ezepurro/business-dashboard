import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-lg rounded-lg border border-border bg-surface p-6 shadow-lg"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="text-foreground-secondary hover:text-foreground"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
