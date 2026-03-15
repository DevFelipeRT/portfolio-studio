import type { Locale } from '@/common/locale';
import type { I18nPreloader } from '../../types';

export type LocaleBundleLoaderEntry<T> = {
  key: string;
  loader: () => Promise<{ default: T }>;
};

type CreateLocaleBundlePreloaderOptions<T> = {
  entriesByLocale: ReadonlyMap<Locale, readonly LocaleBundleLoaderEntry<T>[]>;
  apply(
    locale: Locale,
    entries: readonly (readonly [key: string, value: T])[],
  ): void | Promise<void>;
};

/**
 * Creates a locale-aware preloader that loads bundle entries once per locale
 * and delegates application of the loaded payloads to the provided callback.
 */
export function createLocaleBundlePreloader<T>(
  options: CreateLocaleBundlePreloaderOptions<T>,
): I18nPreloader {
  const { entriesByLocale, apply } = options;
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

    const entries = entriesByLocale.get(locale) ?? [];

    const promise = Promise.all(
      entries.map(async ({ key, loader }) => {
        const mod = await loader();
        return [key, mod.default] as const;
      }),
    )
      .then(async (pairs) => {
        await apply(locale, pairs);
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
