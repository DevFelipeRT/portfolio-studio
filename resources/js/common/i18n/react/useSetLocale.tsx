'use client';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { useSetLocale as useBaseSetLocale, type Locale } from '@/common/locale';
import { createI18nRegistry } from '../registry';
import { translatorProvider } from '../environment';
import { pageRegistry } from '@/app/pages/pageRegistryProvider';
import type { InertiaPageComponent, InertiaPageProps, PageModule } from '@/app/inertia/types';
import type {
  SetLocaleHandler,
  UseSetLocaleOptions as BaseUseSetLocaleOptions,
} from '@/common/locale';

export type UseSetLocaleOptions = BaseUseSetLocaleOptions;
export type { SetLocaleHandler } from '@/common/locale';

/**
 * Requests a locale change through the i18n context, persists the resolved
 * locale, and optionally schedules a page reload.
 */
export function useSetLocale(options?: UseSetLocaleOptions): SetLocaleHandler {
  const { i18n } = useTranslation();
  const page = usePage();
  const layoutsPreloader = createI18nRegistry().preloaderFor(['layouts']);

  const preloadCurrentPageLocale = useCallback(
    async (resolvedLocale: string): Promise<void> => {
      const componentName =
        typeof page.component === 'string' ? page.component.trim() : '';

      if (!componentName) {
        return;
      }

      const loader = pageRegistry[componentName];
      if (!loader) {
        return;
      }

      const loadedModule = (await loader()) as PageModule;
      const currentPage = loadedModule.default as InertiaPageComponent;
      const currentPageProps = (page.props ?? {}) as InertiaPageProps;

      const staticIds = currentPage.i18n ?? [];
      const dynamicIds = currentPage.getI18nScope?.(currentPageProps) ?? [];
      const scopedIds = [...staticIds, ...dynamicIds];

      if (scopedIds.length === 0) {
        return;
      }

      const scopePreloader = createI18nRegistry().preloaderFor(scopedIds);
      const locale = resolvedLocale as Locale;
      const fallbackLocale =
        typeof currentPageProps.localization?.fallbackLocale === 'string' &&
        currentPageProps.localization.fallbackLocale.trim() !== ''
          ? (currentPageProps.localization.fallbackLocale.trim() as Locale)
          : null;

      await scopePreloader.preloadLocale?.(locale);
      if (fallbackLocale && fallbackLocale !== locale) {
        await scopePreloader.preloadLocale?.(fallbackLocale);
      }
    },
    [page.component, page.props],
  );

  return useBaseSetLocale({
    ...options,
    preloadLocale: useCallback(
      async (resolvedLocale: string): Promise<void> => {
        const locale = resolvedLocale as Locale;
        await Promise.all([
          translatorProvider.preloadLocale?.(locale),
          layoutsPreloader.preloadLocale?.(locale),
          preloadCurrentPageLocale(resolvedLocale),
        ]);
      },
      [layoutsPreloader, preloadCurrentPageLocale],
    ),
    applyResolvedLocale: useCallback(
      async (resolvedLocale: string): Promise<void> => {
        await i18n.changeLanguage(resolvedLocale);
      },
      [i18n],
    ),
  });
}
