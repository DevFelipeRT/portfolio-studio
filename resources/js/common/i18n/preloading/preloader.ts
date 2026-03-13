import { canonicalizeLocale, type Locale } from '@/common/locale';
import { createI18nextPreloaderFromLoaders } from '../i18next/preloaderFromLoaders';
import { preloaderForI18nScopes } from './scopedPreloader';
import { translationLoaders } from './translationLoaders';
import { I18nPreloader } from '../types';

/**
 * Shared preloader responsible for application-wide translation bundles.
 */
const commonI18nPreloader = createI18nextPreloaderFromLoaders(
  'common',
  translationLoaders,
);

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
 * Scope identifier list normalized as trimmed, unique, and non-empty ids.
 */
function normalizeScopeIds(
  scopeIds?: readonly string[] | null,
): readonly string[] | null {
  if (!scopeIds) {
    return null;
  }

  const seen = new Set<string>();
  const normalized: string[] = [];

  scopeIds.forEach((id) => {
    if (typeof id !== 'string') {
      return;
    }

    const value = id.trim();
    if (!value || seen.has(value)) {
      return;
    }

    seen.add(value);
    normalized.push(value);
  });

  return normalized.length > 0 ? normalized : null;
}

/**
 * Locale string resolved to canonical locale format.
 */
function resolveLocaleOrNull(input: string | null | undefined): Locale | null {
  if (!input) {
    return null;
  }

  return canonicalizeLocale(input);
}

/**
 * Development environment flag resolved from Vite import metadata.
 */
function isDevEnvironment(): boolean {
  const meta = import.meta as ImportMeta & {
    env?: { DEV?: boolean };
  };
  return Boolean(meta.env?.DEV);
}

/**
 * Scoped preloader resolved from normalized scope identifiers.
 */
function resolveScopedPreloader(
  scopeIds?: readonly string[] | null,
): I18nPreloader | null {
  const normalizedScopeIds = normalizeScopeIds(scopeIds);
  if (!normalizedScopeIds) {
    return null;
  }

  return preloaderForI18nScopes(normalizedScopeIds);
}

/**
 * Locale preload invocation guarded for optional preloader contracts.
 */
function preloadLocaleIfPossible(
  preloader: I18nPreloader,
  locale: Locale,
): Promise<void> {
  return preloader.preloadLocale?.(locale) ?? Promise.resolve();
}

/**
 * Concurrent preload tasks for a locale using common and scoped preloaders.
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
 * Bundle preload execution for one locale.
 */
async function preloadLocaleBundles(options: LocalePreloadOptions): Promise<void> {
  const tasks = buildLocalePreloadTasks(options);
  await Promise.all(tasks);
}

/**
 * Translation preload for the target locale and an optional fallback locale.
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
