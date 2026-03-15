import { canonicalizeLocale, type Locale } from '@/common/locale';
import { createI18nScope } from './scoped/scope';
import type { I18nPreloader } from '../../types';
import { commonI18nPreloader } from '../commonPreloader';
import { preloaderForI18nScopes } from './scoped/scopedBundlePreloader';

type LocalePreloadOptions = {
  locale: Locale;
  includeCommon: boolean;
  scopedPreloader: I18nPreloader | null;
};

type I18nBundlePreloadOptions = {
  locale: Locale;
  fallbackLocale?: Locale | null;
  scopeIds?: readonly string[] | null;
  includeCommon?: boolean;
};

/**
 * Resolves a locale input into the canonical locale representation used by the
 * i18n runtime.
 */
function resolveLocaleOrNull(input: string | null | undefined): Locale | null {
  if (!input) {
    return null;
  }

  return canonicalizeLocale(input);
}

/**
 * Returns whether the current build is running with Vite development flags.
 */
function isDevEnvironment(): boolean {
  const meta = import.meta as ImportMeta & {
    env?: { DEV?: boolean };
  };
  return Boolean(meta.env?.DEV);
}

/**
 * Resolves the preloader responsible for the provided scoped bundle ids.
 */
function resolveScopedPreloader(
  scopeIds?: readonly string[] | null,
): I18nPreloader | null {
  const scope = createI18nScope(scopeIds);
  const ids = scope.ids();

  if (!ids) {
    return null;
  }

  return preloaderForI18nScopes(ids);
}

/**
 * Invokes a locale preload operation when the target preloader exposes one.
 */
function preloadLocaleIfPossible(
  preloader: I18nPreloader,
  locale: Locale,
): Promise<void> {
  return preloader.preloadLocale?.(locale) ?? Promise.resolve();
}

/**
 * Builds the list of preload tasks required for a single locale.
 */
function buildLocalePreloadTasks(options: LocalePreloadOptions): Promise<void>[] {
  const { locale, includeCommon, scopedPreloader } = options;
  const tasks: Promise<void>[] = [];

  if (includeCommon) {
    tasks.push(preloadLocaleIfPossible(commonI18nPreloader, locale));
  }

  if (scopedPreloader) {
    tasks.push(preloadLocaleIfPossible(scopedPreloader, locale));
  }

  return tasks;
}

/**
 * Executes all preload tasks associated with a single locale.
 */
async function preloadLocaleBundles(options: LocalePreloadOptions): Promise<void> {
  const tasks = buildLocalePreloadTasks(options);
  await Promise.all(tasks);
}

/**
 * Preloads the shared bundle and any scoped bundles required for the target
 * locale, optionally repeating the process for a fallback locale.
 */
export async function preloadI18nBundles(
  options: I18nBundlePreloadOptions,
): Promise<void> {
  const {
    locale,
    fallbackLocale = null,
    scopeIds = null,
    includeCommon = true,
  } = options;
  const normalizedLocale = resolveLocaleOrNull(locale);
  if (!normalizedLocale) {
    if (isDevEnvironment()) {
      throw new Error(`[i18n] Invalid locale "${locale}" passed to preloadI18nBundles.`);
    }
    return;
  }

  const normalizedFallbackLocale = resolveLocaleOrNull(fallbackLocale);
  const scopedPreloader = resolveScopedPreloader(scopeIds);

  await preloadLocaleBundles({
    locale: normalizedLocale,
    includeCommon,
    scopedPreloader,
  });

  if (normalizedFallbackLocale && normalizedFallbackLocale !== normalizedLocale) {
    await preloadLocaleBundles({
      locale: normalizedFallbackLocale,
      includeCommon,
      scopedPreloader,
    });
  }
}
