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
} from './utils';
import { createI18nEnvironment, createI18nRegistry } from '@/common/i18n';
import type { Locale } from '@/common/locale';
import { ensureI18nextInitialized } from '@/common/i18n/i18next/i18next';

const useScriptElementForInitialPage = true;

async function preloadShellCatalogs(initialProps: InertiaPageProps): Promise<void> {
  const currentLocale = resolveInitialLocale(initialProps) ?? null;
  const localizationConfig = initialProps.localization || {};

  const { localeResolver, translatorProvider } = createI18nEnvironment({
    supportedLocales: localizationConfig.supportedLocales,
    defaultLocale: currentLocale,
    fallbackLocale: localizationConfig.fallbackLocale,
  });

  const resolvedLocale = localeResolver.resolve(
    currentLocale ?? localeResolver.defaultLocale,
  );
  const resolvedFallbackLocale = localeResolver.resolve(
    (localizationConfig.fallbackLocale ?? resolvedLocale) as Locale,
  );

  await ensureI18nextInitialized({
    locale: resolvedLocale,
    fallbackLocale: resolvedFallbackLocale,
    supportedLocales: localeResolver.supportedLocales,
  });

  const layoutsPreloader = createI18nRegistry().preloaderFor(['layouts']);

  await Promise.all([
    translatorProvider.preloadLocale?.(resolvedLocale),
    layoutsPreloader.preloadLocale?.(resolvedLocale as Locale),
  ]);

  const rawFallback = localizationConfig.fallbackLocale;
  if (typeof rawFallback === 'string' && rawFallback.trim() !== '') {
    const fallbackLocale = localeResolver.resolve(rawFallback as Locale);
    if (fallbackLocale !== resolvedLocale) {
      await Promise.all([
        translatorProvider.preloadLocale?.(fallbackLocale),
        layoutsPreloader.preloadLocale?.(fallbackLocale),
      ]);
    }
  }
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
