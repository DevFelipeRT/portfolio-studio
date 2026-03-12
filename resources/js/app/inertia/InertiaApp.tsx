import { createInertiaApp } from '@inertiajs/react';
import {
  createInertiaPageResolver,
  resolveInitialLocale,
  resolveInitialPageForCSR,
} from './page';
import type { InertiaPageProps } from './types';
import {
  getInertiaPageRegistry,
  inertiaTitle,
  initializeInertiaRuntimeState,
  renderInertiaApp,
} from './runtime';
import {
  initializeI18nRuntime,
  preloadI18nScopes,
} from '@/common/i18n';
import type { Locale } from '@/common/locale';

const useScriptElementForInitialPage = true;

async function preloadShellCatalogs(initialProps: InertiaPageProps): Promise<void> {
  const currentLocale = resolveInitialLocale(initialProps) ?? null;
  const localizationConfig = initialProps.localization || {};

  const { localeResolver, runtimeConfig } = await initializeI18nRuntime({
    supportedLocales: localizationConfig.supportedLocales,
    defaultLocale: currentLocale,
    fallbackLocale: localizationConfig.fallbackLocale,
  });

  const resolvedLocale = localeResolver.resolve(
    currentLocale ?? localeResolver.defaultLocale,
  ) as Locale;
  const resolvedFallbackLocale =
    typeof localizationConfig.fallbackLocale === 'string' &&
    localizationConfig.fallbackLocale.trim() !== ''
      ? (localeResolver.resolve(localizationConfig.fallbackLocale) as Locale)
      : runtimeConfig.fallbackLocale;

  await preloadI18nScopes({
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
    await preloadShellCatalogs(initialProps);
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
