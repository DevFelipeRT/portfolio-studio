import type { Locale, LocaleInput } from '@/common/locale';
import type { Namespace } from '../types';

/**
 * Locale and namespace metadata derived from a translation module path.
 */
export type TranslationModuleMeta = {
  locale: Locale;
  namespace: Namespace;
};

/**
 * Parses a Vite glob module path into (locale, namespace) using the convention:
 * `.../<locale>/<namespace>.ts`.
 */
export function parseTranslationModulePath(
  modulePath: string,
  canonicalizeLocale: (input: LocaleInput) => Locale | null,
): TranslationModuleMeta | null {
  const normalized = modulePath.split('\\').join('/');
  const parts = normalized.split('/');
  const fileName = parts.pop();
  const folderName = parts.pop();

  if (!fileName || !folderName) {
    return null;
  }

  if (!fileName.endsWith('.ts')) {
    return null;
  }

  const namespace = fileName.slice(0, -'.ts'.length).trim();
  const locale = canonicalizeLocale(folderName);

  if (!namespace || !locale) {
    return null;
  }

  return {
    locale,
    namespace: namespace as Namespace,
  };
}
