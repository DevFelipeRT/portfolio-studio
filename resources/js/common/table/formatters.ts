import { normalizeIntlLocale } from '@/common/i18n/normalizeIntlLocale';

type FormatTableDateOptions = {
  locale?: string | null;
  fallback?: string;
  isMobile?: boolean;
  todayAsTime?: boolean;
  format?: 'compact' | 'medium' | 'full';
};

type FormatTableDateRangeOptions = {
  locale?: string | null;
  fallback?: string;
  isMobile?: boolean;
  presentLabel?: string;
  format?: 'compact' | 'medium' | 'full';
};

export function formatTableDate(
  value: string | null | undefined,
  {
    locale,
    fallback = '\u2014',
    isMobile = false,
    todayAsTime = false,
    format,
  }: FormatTableDateOptions = {},
): string {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const normalizedLocale = locale ? normalizeIntlLocale(locale) : undefined;

  if (todayAsTime && isSameDay(date, new Date())) {
    return date.toLocaleTimeString(normalizedLocale, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const resolvedFormat = resolveDateFormat(format, isMobile);

  return date.toLocaleDateString(normalizedLocale, {
    day: '2-digit',
    month: resolvedFormat === 'compact' ? '2-digit' : 'short',
    ...(resolvedFormat === 'full' ? { year: 'numeric' } : {}),
  });
}

export function formatTableDateRange(
  start: string | null | undefined,
  end: string | null | undefined,
  {
    locale,
    fallback = '\u2014',
    isMobile = false,
    presentLabel,
    format,
  }: FormatTableDateRangeOptions = {},
): string {
  const startLabel = formatTableDate(start, {
    locale,
    fallback,
    isMobile,
    format,
  });

  if (!start || startLabel === fallback) {
    return startLabel;
  }

  if (!end) {
    return presentLabel ? `${startLabel} - ${presentLabel}` : startLabel;
  }

  const endLabel = formatTableDate(end, {
    locale,
    fallback,
    isMobile,
    format,
  });

  if (endLabel === fallback || start === end) {
    return startLabel;
  }

  return `${startLabel} - ${endLabel}`;
}

function resolveDateFormat(
  format: 'compact' | 'medium' | 'full' | undefined,
  isMobile: boolean,
): 'compact' | 'medium' | 'full' {
  if (format) {
    return format;
  }

  return isMobile ? 'compact' : 'full';
}

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}
