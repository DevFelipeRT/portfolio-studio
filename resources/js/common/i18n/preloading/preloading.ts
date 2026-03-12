import type { Locale } from '@/common/locale';
import { createI18nRegistry } from '../registry';
import { createI18nextPreloaderFromLoaders } from '../i18next/preloaderFromLoaders';
import type { I18nPreloader, TranslationModuleLoaders } from '../types';
import { translationModuleLoaders } from './translationModuleLoaders';

const commonI18nPreloader = createI18nextPreloaderFromLoaders(
  'common',
  translationModuleLoaders,
);

export function createScopedI18nPreloader(
  scopeId: string,
  loaders: TranslationModuleLoaders,
): I18nPreloader {
  return createI18nextPreloaderFromLoaders(scopeId, loaders);
}

export function preloaderForI18nScopes(
  scopeIds?: readonly string[] | null,
): I18nPreloader {
  return createI18nRegistry().preloaderFor(scopeIds);
}

export async function preloadI18nScopes(options: {
  locale: Locale;
  fallbackLocale?: Locale | null;
  scopeIds?: readonly string[] | null;
  includeCommon?: boolean;
}): Promise<void> {
  const {
    locale,
    fallbackLocale = null,
    scopeIds = null,
    includeCommon = true,
  } = options;

  const tasks: Promise<void>[] = [];
  if (includeCommon) {
    tasks.push(
      commonI18nPreloader.preloadLocale?.(locale) ?? Promise.resolve(),
    );
  }

  if (scopeIds && scopeIds.length > 0) {
    const scopedPreloader = preloaderForI18nScopes(scopeIds);
    tasks.push(scopedPreloader.preloadLocale?.(locale) ?? Promise.resolve());
  }

  await Promise.all(tasks);

  if (fallbackLocale && fallbackLocale !== locale) {
    const fallbackTasks: Promise<void>[] = [];
    if (includeCommon) {
      fallbackTasks.push(
        commonI18nPreloader.preloadLocale?.(fallbackLocale) ??
          Promise.resolve(),
      );
    }
    if (scopeIds && scopeIds.length > 0) {
      const scopedPreloader = preloaderForI18nScopes(scopeIds);
      fallbackTasks.push(
        scopedPreloader.preloadLocale?.(fallbackLocale) ?? Promise.resolve(),
      );
    }
    await Promise.all(fallbackTasks);
  }
}

export async function preloadCommonI18n(
  locale: Locale,
  fallbackLocale?: Locale | null,
): Promise<void> {
  await preloadI18nScopes({
    locale,
    fallbackLocale,
    includeCommon: true,
  });
}

export const translatorProvider = commonI18nPreloader;
