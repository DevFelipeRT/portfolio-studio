'use client';

import type {
  InertiaPageComponent,
  InertiaPageProps,
  PageModule,
} from '@/app/inertia/types';
import { pageRegistry } from '@/app/pages/pageRegistryProvider';
import type {
  UseSetLocaleOptions as BaseUseSetLocaleOptions,
  SetLocaleHandler,
} from '@/common/locale';
import { useSetLocale as useBaseSetLocale, type Locale } from '@/common/locale';
import { usePage } from '@inertiajs/react';
import { useCallback } from 'react';
import {
  preloaderForI18nScopes,
  preloadI18nScopes,
} from '../../preloading/preloading';
import { setI18nRuntimeLocale } from '../../runtime';

export type UseSetLocaleOptions = BaseUseSetLocaleOptions;
export type { SetLocaleHandler } from '@/common/locale';

/**
 * Requests a locale change through the i18n context, persists the resolved
 * locale, and optionally schedules a page reload.
 */
export function useSetI18nLocale(
  options?: UseSetLocaleOptions,
): SetLocaleHandler {
  const page = usePage();

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

      const locale = resolvedLocale as Locale;
      const fallbackLocale =
        typeof currentPageProps.localization?.fallbackLocale === 'string' &&
        currentPageProps.localization.fallbackLocale.trim() !== ''
          ? (currentPageProps.localization.fallbackLocale.trim() as Locale)
          : null;

      await preloadI18nScopes({
        locale,
        fallbackLocale,
        scopeIds: scopedIds,
        includeCommon: false,
      });
    },
    [page.component, page.props],
  );

  return useBaseSetLocale({
    ...options,
    preloadLocale: useCallback(
      async (resolvedLocale: string): Promise<void> => {
        const locale = resolvedLocale as Locale;
        const currentPageProps = (page.props ?? {}) as InertiaPageProps;
        const fallbackLocale =
          typeof currentPageProps.localization?.fallbackLocale === 'string' &&
          currentPageProps.localization.fallbackLocale.trim() !== ''
            ? (currentPageProps.localization.fallbackLocale.trim() as Locale)
            : null;
        const layoutsPreloader = preloaderForI18nScopes(['layouts']);
        await Promise.all([
          preloadI18nScopes({
            locale,
            fallbackLocale,
            includeCommon: true,
          }),
          layoutsPreloader.preloadLocale?.(locale) ?? Promise.resolve(),
          fallbackLocale && fallbackLocale !== locale
            ? (layoutsPreloader.preloadLocale?.(fallbackLocale) ??
              Promise.resolve())
            : Promise.resolve(),
          preloadCurrentPageLocale(resolvedLocale),
        ]);
      },
      [page.props, preloadCurrentPageLocale],
    ),
    applyResolvedLocale: useCallback(
      async (resolvedLocale: string): Promise<void> => {
        await setI18nRuntimeLocale(resolvedLocale);
      },
      [],
    ),
  });
}
