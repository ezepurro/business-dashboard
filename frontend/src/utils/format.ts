import i18n from '../i18n';

const LOCALE_TAGS: Record<string, string> = {
  en: 'en-US',
  es: 'es-AR',
};

export function resolveLocale() {
  const baseLanguage = i18n.language.split('-')[0];
  return LOCALE_TAGS[baseLanguage] ?? LOCALE_TAGS.en;
}

export function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat(resolveLocale(), { style: 'currency', currency }).format(value);
}

export function formatDate(value: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(resolveLocale(), { dateStyle: 'medium' }).format(new Date(value));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat(resolveLocale()).format(value);
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let size = bytes / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
