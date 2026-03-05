import type { Namespace } from '../types';

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
