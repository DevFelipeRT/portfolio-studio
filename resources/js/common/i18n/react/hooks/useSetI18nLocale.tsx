'use client';

import type {
  InertiaPageComponent,
  InertiaPageProps,
  PageModule,
} from '@/app/inertia/types';
import { resolveInertiaLocalizationContext } from '@/app/inertia';
import { pageRegistry } from '@/app/pages/pageRegistryProvider';
import type {
  UseSetLocaleOptions as BaseUseSetLocaleOptions,
  SetLocaleHandler,
} from '@/common/locale';
import {
  canonicalizeLocale,
  useSetLocale as useBaseSetLocale,
  type Locale,
} from '@/common/locale';
import {
  useCurrentPage,
  usePageComponentName,
} from '@/common/page-runtime';
import { useCallback } from 'react';
import {
  preloadI18nBundles,
  preloaderForI18nScopes,
} from '../../preloading';
import { setI18nRuntimeLocale } from '../../i18next';

export type UseSetLocaleOptions = BaseUseSetLocaleOptions;
export type { SetLocaleHandler } from '@/common/locale';

/**
 * Requests a locale change through the i18n context, persists the resolved
 * locale, and optionally schedules a page reload.
 */
export function useSetI18nLocale(
  options?: UseSetLocaleOptions,
): SetLocaleHandler {
  const page = useCurrentPage();
  const componentName = usePageComponentName();

  const preloadCurrentPageLocale = useCallback(
    async (resolvedLocale: string): Promise<void> => {
      const normalizedComponentName = componentName.trim();

      if (!normalizedComponentName) {
        return;
      }

      const loader = pageRegistry[normalizedComponentName];
      if (!loader) {
        return;
      }

      const loadedModule = (await loader()) as PageModule;
      const currentPage = loadedModule.default as InertiaPageComponent;
      const currentPageProps = (page.props ?? {}) as InertiaPageProps;

      const staticIds = currentPage.i18n ?? [];
      const dynamicIds = currentPage.getI18nScope?.(currentPageProps) ?? [];
      const scopedIds = [...staticIds, ...dynamicIds];
      const localizationContext =
        resolveInertiaLocalizationContext(currentPageProps);

      if (scopedIds.length === 0) {
        return;
      }

      const locale = resolvedLocale as Locale;
      const fallbackLocale = canonicalizeLocale(localizationContext.fallbackLocale ?? '');

      await preloadI18nBundles({
        locale,
        fallbackLocale,
        scopeIds: scopedIds,
        includeCommon: false,
      });
    },
    [componentName, page.props],
  );

  return useBaseSetLocale({
    ...options,
    preloadLocale: useCallback(
      async (resolvedLocale: string): Promise<void> => {
        const locale = resolvedLocale as Locale;
        const currentPageProps = (page.props ?? {}) as InertiaPageProps;
        const localizationContext =
          resolveInertiaLocalizationContext(currentPageProps);
        const fallbackLocale = canonicalizeLocale(
          localizationContext.fallbackLocale ?? '',
        );
        const layoutsPreloader = preloaderForI18nScopes(['layouts']);
        await Promise.all([
          preloadI18nBundles({
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
