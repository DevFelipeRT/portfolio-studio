export function parseBooleanFromString(raw: string): boolean | undefined {
  const normalized = raw.trim().toLowerCase();

  if (normalized === '') {
    return undefined;
  }

  if (normalized === 'true') {
    return true;
  }

  if (normalized === 'false') {
    return false;
  }

  return undefined;
}
