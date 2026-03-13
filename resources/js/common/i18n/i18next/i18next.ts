import i18next, { type i18n, type InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { Locale } from '@/common/locale';

let initialized = false;
let initPromise: Promise<i18n> | null = null;

export type I18nextRuntimeConfig = {
  locale: Locale;
  fallbackLocale: Locale;
  supportedLocales: readonly Locale[];
};

export function getI18next(): i18n {
  return i18next;
}

/**
 * Initializes i18next once for the application runtime.
 *
 * Resource loading is handled separately via scoped preloaders.
 */
export function ensureI18nextInitialized(
  runtime: I18nextRuntimeConfig,
): Promise<i18n> {
  if (initialized) {
    if (i18next.language !== runtime.locale) {
      void i18next.changeLanguage(runtime.locale);
    }
    return Promise.resolve(i18next);
  }

  if (initPromise) {
    return initPromise;
  }

  const options: InitOptions = {
    lng: runtime.locale,
    fallbackLng: runtime.fallbackLocale,
    supportedLngs: [...runtime.supportedLocales],
    // Translation files export nested objects; keep "." key semantics.
    keySeparator: '.',
    nsSeparator: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    saveMissing: false,
    missingKeyHandler(lngs, namespace, key) {
      if (!import.meta.env.DEV) return;

      const locale = Array.isArray(lngs) ? lngs[0] : lngs;
      // eslint-disable-next-line no-console
      console.warn(
        `[i18n] Missing key "${String(namespace)}.${key}" for locale "${String(locale)}".`,
      );
    },
  };

  const promise: Promise<i18n> = i18next
    .use(initReactI18next)
    .init(options)
    .then(() => {
      initialized = true;
      return i18next;
    })
    .finally(() => {
      initPromise = null;
    });

  initPromise = promise;
  return promise;
}
