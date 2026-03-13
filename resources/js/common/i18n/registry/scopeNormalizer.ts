export function normalizeScope(
  scope?: readonly string[] | null,
): readonly string[] | null {
  if (!scope) {
    return null;
  }

  const ids = scope
    .filter((id): id is string => typeof id === 'string')
    .map((id) => id.trim())
    .filter((id) => id !== '');

  if (ids.length === 0) {
    return null;
  }

  const seen = new Set<string>();
  const unique: string[] = [];
  ids.forEach((id) => {
    if (seen.has(id)) {
      return;
    }

    seen.add(id);
    unique.push(id);
  });

  return unique;
}
