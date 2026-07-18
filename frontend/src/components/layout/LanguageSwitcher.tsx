import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n';
import { GlobeIcon } from './icons';

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  es: 'Español',
};

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  // i18n.language may report a full browser tag (e.g. "en-US") even though the
  // "languageOnly" load strategy resolves resources to the base "en" bundle.
  const currentLanguage = i18n.language.split('-')[0] as SupportedLanguage;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function handleSelect(language: SupportedLanguage) {
    i18n.changeLanguage(language);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Change language"
        className="flex cursor-pointer items-center gap-1.5 rounded-md p-2 text-foreground-secondary transition hover:text-foreground"
      >
        <GlobeIcon />
        <span className="text-xs font-medium uppercase">{currentLanguage}</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-36 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-lg"
        >
          {SUPPORTED_LANGUAGES.map((language) => {
            const isActive = currentLanguage === language;

            return (
              <button
                key={language}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => handleSelect(language)}
                className={`flex w-full cursor-pointer items-center justify-between px-3 py-2 text-sm transition ${
                  isActive ? 'text-primary' : 'text-foreground-secondary hover:text-foreground'
                }`}
              >
                {LANGUAGE_NAMES[language]}
                {isActive && <span aria-hidden="true">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
