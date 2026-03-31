import { normalizeIntlLocale } from '@/common/i18n/normalizeIntlLocale';

type FormatTableDateOptions = {
  locale?: string | null;
  fallback?: string;
  isMobile?: boolean;
  todayAsTime?: boolean;
};

type FormatTableDateRangeOptions = {
  locale?: string | null;
  fallback?: string;
  isMobile?: boolean;
  presentLabel?: string;
};

export function formatTableDate(
  value: string | null | undefined,
  {
    locale,
    fallback = '\u2014',
    isMobile = false,
    todayAsTime = false,
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

  return date.toLocaleDateString(normalizedLocale, {
    day: '2-digit',
    month: isMobile ? '2-digit' : 'short',
    ...(isMobile ? {} : { year: 'numeric' }),
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
  }: FormatTableDateRangeOptions = {},
): string {
  const startLabel = formatTableDate(start, {
    locale,
    fallback,
    isMobile,
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
  });

  if (endLabel === fallback || start === end) {
    return startLabel;
  }

  return `${startLabel} - ${endLabel}`;
}

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}
