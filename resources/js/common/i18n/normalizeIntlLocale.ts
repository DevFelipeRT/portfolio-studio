export function normalizeIntlLocale(locale: string | null | undefined): string | undefined {
  const trimmed = locale?.trim();

  if (!trimmed) {
    return undefined;
  }

  return trimmed.replace(/_/g, '-');
}
