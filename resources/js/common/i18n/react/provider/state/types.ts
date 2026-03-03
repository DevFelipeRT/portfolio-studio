import type { LocaleResolver } from '../../../core/locale';
import type { Locale } from '../../../core/types';
import type { I18nTranslatorProvider } from '../types';

export type PreloadLocale = (locale: Locale) => Promise<void>;

export type UseI18nProviderStateOptions = {
  initialLocale: string | null;
  fallbackLocale: string | null;
  localeResolver: LocaleResolver;
  translatorProvider?: I18nTranslatorProvider;
  loadingOverlayDelayMs: number;
};

export type UseI18nProviderStateResult = {
  activeLocale: Locale;
  supportedLocales: readonly Locale[];
  isCatalogReady: boolean;
  hasLoadedOnce: boolean;
  showOverlay: boolean;
  setLocale(nextLocale: string): Locale;
};
