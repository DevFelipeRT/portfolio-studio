import type { Locale } from '@/common/locale';
import type { Namespace, TranslationTree } from '../types';
import type { BundleLoaders } from './types';
import type { TranslationModuleMeta } from './translationModuleMeta';

type LoaderEntry = {
  namespace: Namespace;
  loader: () => Promise<{ default: TranslationTree }>;
};

/**
 * Indexes translation module loaders by locale and records the namespaces
 * available for each locale.
 */
export function indexLoadersByLocale(
  loaders: BundleLoaders,
  parseMeta: (modulePath: string) => TranslationModuleMeta | null,
): {
  loadersByLocale: Map<Locale, LoaderEntry[]>;
  namespacesByLocale: Map<Locale, Set<Namespace>>;
  supportedLocales: readonly Locale[];
} {
  const loadersByLocale = new Map<Locale, LoaderEntry[]>();
  const namespacesByLocale = new Map<Locale, Set<Namespace>>();

  Object.entries(loaders).forEach(([modulePath, loader]) => {
    const meta = parseMeta(modulePath);
    if (!meta) {
      return;
    }

    const entries = loadersByLocale.get(meta.locale) ?? [];
    entries.push({ namespace: meta.namespace, loader });
    loadersByLocale.set(meta.locale, entries);

    const namespaces = namespacesByLocale.get(meta.locale) ?? new Set<Namespace>();
    namespaces.add(meta.namespace);
    namespacesByLocale.set(meta.locale, namespaces);
  });

  const supportedLocales = Object.freeze(Array.from(loadersByLocale.keys()));

  return {
    loadersByLocale,
    namespacesByLocale,
    supportedLocales,
  };
}
