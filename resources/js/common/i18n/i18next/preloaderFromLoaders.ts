import type { Locale } from '@/common/locale';
import { canonicalizeLocale } from '@/common/locale';
import type { Namespace, TranslationTree } from '../types';
import type { I18nPreloader } from '../registry';
import { getI18next } from './i18next';
import { scopedNamespace } from './scopedNamespace';
import type { TranslationModuleLoaders } from './types';
import { indexLoadersByLocale } from './indexLoadersByLocale';
import { parseTranslationModulePath } from './parseTranslationModulePath';

type LoaderEntry = {
  namespace: Namespace;
  loader: () => Promise<{ default: TranslationTree }>;
};

export function createI18nextPreloaderFromLoaders(
  scopeId: string,
  loaders: TranslationModuleLoaders,
): I18nPreloader {
  const { loadersByLocale } = indexLoadersByLocale(loaders, (modulePath) =>
    parseTranslationModulePath(modulePath, canonicalizeLocale),
  );

  const loadedLocales = new Set<Locale>();
  const inFlight = new Map<Locale, Promise<void>>();

  async function preloadLocale(locale: Locale): Promise<void> {
    if (loadedLocales.has(locale)) {
      return;
    }

    const existing = inFlight.get(locale);
    if (existing) {
      return existing;
    }

    const entries: LoaderEntry[] = loadersByLocale.get(locale) ?? [];
    const i18n = getI18next();

    const promise = Promise.all(
      entries.map(async ({ namespace, loader }) => {
        const mod = await loader();
        return [namespace, mod.default] as const;
      }),
    )
      .then((pairs) => {
        pairs.forEach(([namespace, tree]) => {
          const ns = scopedNamespace(scopeId, namespace);
          if (!ns) {
            return;
          }

          i18n.addResourceBundle(locale, ns, tree, true, true);
        });
        loadedLocales.add(locale);
      })
      .finally(() => {
        inFlight.delete(locale);
      });

    inFlight.set(locale, promise);
    return promise;
  }

  return { preloadLocale };
}
