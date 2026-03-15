import type { Namespace } from '../types';

/**
 * Resolves the fully qualified namespace used by i18next for a scoped
 * translation namespace.
 */
export function scopedNamespace(scopeId: string, namespace?: Namespace): string | null {
  const scope = scopeId.trim();
  if (!scope) {
    return null;
  }

  if (!namespace) {
    return null;
  }

  const ns = String(namespace).trim();
  if (!ns) {
    return null;
  }

  return `${scope}.${ns}`;
}
