import type { Locale } from '@/common/locale';
import { canonicalizeLocale } from '@/common/locale';
import type { I18nPreloader, Namespace, TranslationTree } from '../types';
import { createLocaleBundlePreloader } from '../preloading/bundle/localeBundlePreloader';
import { getI18next } from './i18next';
import { scopedNamespace } from './scopedNamespace';
import type { BundleLoaders } from './types';
import { indexLoadersByLocale } from './indexLoadersByLocale';
import { parseTranslationModulePath } from './translationModuleMeta';

/**
 * Creates an i18next-backed preloader from translation module loaders scoped to
 * a specific i18n scope id.
 */
export function createI18nextPreloader(
  scopeId: string,
  loaders: BundleLoaders,
): I18nPreloader {
  const { loadersByLocale } = indexLoadersByLocale(loaders, (modulePath) =>
    parseTranslationModulePath(modulePath, canonicalizeLocale),
  );
  const entriesByLocale = new Map<
    Locale,
    readonly {
      key: Namespace;
      loader: () => Promise<{ default: TranslationTree }>;
    }[]
  >();

  loadersByLocale.forEach((entries, locale) => {
    entriesByLocale.set(
      locale,
      entries.map(({ namespace, loader }) => ({ key: namespace, loader })),
    );
  });

  return createLocaleBundlePreloader<TranslationTree>({
    entriesByLocale,
    /**
     * Installs the loaded translation trees into i18next using the scoped
     * namespace convention of the application.
     */
    apply(locale, entries) {
      const i18n = getI18next();

      entries.forEach(([namespace, tree]) => {
        const ns = scopedNamespace(scopeId, namespace);
        if (!ns) {
          return;
        }

        i18n.addResourceBundle(locale, ns, tree, true, true);
      });
    },
  });
}
