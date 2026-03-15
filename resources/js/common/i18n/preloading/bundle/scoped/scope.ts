/**
 * Normalizes scope ids into a trimmed, unique, non-empty list.
 */
function normalizeScopeIds(
  scopeIds?: readonly string[] | null,
): readonly string[] | null {
  if (!scopeIds) {
    return null;
  }

  const ids = scopeIds
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

/**
 * Creates a normalized scope descriptor used by preloading logic.
 */
export function createI18nScope(scopeIds?: readonly string[] | null) {
  const normalizedIds = normalizeScopeIds(scopeIds);

  return {
    /**
     * Returns the cache key associated with the normalized scope.
     */
    key(): string {
      return normalizedIds ? normalizedIds.join('|') : '*';
    },

    /**
     * Indicates whether the scope targets all registered preloaders.
     */
    isAll(): boolean {
      return normalizedIds === null;
    },

    /**
     * Returns the normalized scope ids or `null` for the all-preloaders case.
     */
    ids(): readonly string[] | null {
      return normalizedIds;
    },
  };
}
