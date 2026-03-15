import { createInertiaApp } from '@inertiajs/react';
import {
  createInertiaPageResolver,
  resolveInitialPageForCSR,
} from './page';
import type { InertiaPageProps } from './types';
import {
  getInertiaPageRegistry,
  inertiaTitle,
  initializeInertiaRuntimeState,
  resolveInertiaLocalizationContext,
  renderInertiaApp,
} from './runtime';
import {
  createInitializedI18nRuntime,
  preloadI18nBundles,
} from '@/common/i18n';
import type { Locale } from '@/common/locale';

const useScriptElementForInitialPage = true;

async function preloadShellBundles(initialProps: InertiaPageProps): Promise<void> {
  const localizationContext = resolveInertiaLocalizationContext(initialProps);
  const currentLocale = localizationContext.currentLocale;

  const { localeResolver, runtimeConfig } = await createInitializedI18nRuntime({
    supportedLocales: localizationContext.supportedLocales,
    defaultLocale: currentLocale,
    fallbackLocale: localizationContext.fallbackLocale,
  });

  const resolvedLocale = localeResolver.resolve(
    currentLocale ?? localeResolver.defaultLocale,
  ) as Locale;
  const resolvedFallbackLocale =
    localizationContext.fallbackLocale
      ? (localeResolver.resolve(localizationContext.fallbackLocale) as Locale)
      : runtimeConfig.fallbackLocale;

  await preloadI18nBundles({
    locale: resolvedLocale,
    fallbackLocale: resolvedFallbackLocale,
    scopeIds: ['layouts'],
    includeCommon: true,
  });
}

export async function bootInertiaApp(): Promise<void> {
  const initialPage = useScriptElementForInitialPage
    ? resolveInitialPageForCSR()
    : undefined;

  // Initializes derived metadata (e.g. title tokens) from the initial page props.
  if (initialPage?.props) {
    const initialProps = initialPage.props as InertiaPageProps;
    initializeInertiaRuntimeState(initialProps);
    await preloadShellBundles(initialProps);
  }

  createInertiaApp({
    page: initialPage,
    title: inertiaTitle,
    resolve: createInertiaPageResolver(getInertiaPageRegistry()),
    setup: ({ el, App, props }) => renderInertiaApp(el, App, props),
    progress: {
      color: '#4B5563',
    },
  });
}
