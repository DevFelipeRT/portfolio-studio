import '../css/app.css';
import './bootstrap';

import { createInertiaApp, usePage } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { I18nProvider, createI18nEnvironment } from './Common/i18n';
import { useMemo } from 'react';

let currentTitleTemplate: string | null = null;
let currentSiteName: Record<string, string> | null = null;
let currentDefaultMetaTitle: Record<string, string> | null = null;
let currentOwnerName: string | null = null;
let propsCache: InertiaPageProps = {};

/**
 * Base shape for the initial Inertia page props.
 */
interface InertiaPageProps extends Record<string, unknown> {
  locale?: string;
  localization?: {
    currentLocale?: string;
    supportedLocales?: string[];
    defaultLocale?: string;
    fallbackLocale?: string;
    cookieName?: string;
    apiEndpoint?: string;
    persistClientCookie?: boolean;
  };
  websiteSettings?: {
    siteName?: Record<string, string> | null;
    ownerName?: string | null;
    metaTitleTemplate?: string | null;
    defaultMetaTitle?: Record<string, string> | null;
  };
}

/**
 * Resolves the initial locale based on the page props hierarchy.
 */
function resolveInitialLocale(props: InertiaPageProps): string | undefined {
  if (props.locale?.trim()) {
    return props.locale;
  }

  if (props.localization?.currentLocale?.trim()) {
    return props.localization.currentLocale;
  }

  return props.localization?.defaultLocale;
}

function resolveLocalizedValue(
  map: Record<string, string> | null,
  locale: string,
): string | null {
  if (!map) {
    return null;
  }

  if (locale && map[locale]) {
    return map[locale];
  }

  const fallbackLocale = propsCache.localization?.fallbackLocale ?? '';
  if (fallbackLocale && map[fallbackLocale]) {
    return map[fallbackLocale];
  }

  return Object.values(map)[0] ?? null;
}

// Application-level pages: resources/js/Pages/**/*.tsx
const appPageFiles = import.meta.glob('./Pages/**/*.tsx');

// Module-level pages: resources/js/Modules/**/Pages/**/*.tsx
const modulePageFiles = import.meta.glob('./Modules/**/Pages/**/*.tsx');

type PageModuleLoader = () => Promise<unknown>;

/**
 * Registry of all Inertia pages keyed by their logical component name.
 */
const pageRegistry: Record<string, PageModuleLoader> = {};

/**
 * Registers pages from a file map into the global page registry.
 *
 * Example mappings:
 *   "./Pages/Dashboard.tsx"                         → "Dashboard"
 *   "./Pages/Projects/Index.tsx"                    → "Projects/Index"
 *   "./Modules/ContentManagement/Pages/Admin/X.tsx" → "ContentManagement/Pages/Admin/X"
 */
function registerPages(
  files: Record<string, PageModuleLoader>,
  prefix: string,
): void {
  Object.entries(files).forEach(([path, loader]) => {
    if (!path.startsWith(prefix)) {
      return;
    }

    const withoutPrefix = path.slice(prefix.length);
    const withoutExtension = withoutPrefix.replace(/\.tsx$/, '');

    const componentName = withoutExtension;

    pageRegistry[componentName] = loader;
  });
}

registerPages(appPageFiles, './Pages/');
registerPages(modulePageFiles, './Modules/');

createInertiaApp({
  title: (title) => {
    const locale = resolveInitialLocale(propsCache) ?? '';
    const pageTitle = typeof title === 'string' ? title.trim() : '';
    const template = currentTitleTemplate?.trim() || '{page_title}';
    const siteName = resolveLocalizedValue(currentSiteName, locale);
    const defaultMetaTitle = resolveLocalizedValue(
      currentDefaultMetaTitle,
      locale,
    );

    const effectivePageTitle = pageTitle || defaultMetaTitle || siteName || '';

    const rendered = template
      .replaceAll('{page_title}', effectivePageTitle)
      .replaceAll('{owner}', currentOwnerName ?? '')
      .replaceAll('{site}', siteName ?? '')
      .replaceAll('{locale}', locale);

    const cleaned = rendered
      .split('|')
      .map((part) => part.trim())
      .filter(Boolean)
      .join(' | ');

    return cleaned || effectivePageTitle;
  },

  /**
   * Resolves an Inertia component name to a React component using
   * the normalized page registry.
   *
   * Expected backend usage:
   *   Inertia::render('Dashboard', [...]);
   *   Inertia::render('Projects/Index', [...]);
   *   Inertia::render('ContentManagement/Pages/Admin/PageEdit', [...]);
   */
  resolve: async (name) => {
    const loader = pageRegistry[name];

    if (!loader) {
      throw new Error(`Page not found in registry: ${name}`);
    }

    const pageModule: any = await loader();

    if (!pageModule?.default) {
      throw new Error(
        `Resolved module for "${name}" does not have a default export.`,
      );
    }

    const PageComponent = pageModule.default;

    const WrappedPage = (props: Record<string, unknown>) => {
      const page = usePage().props as InertiaPageProps;
      const currentLocale = resolveInitialLocale(page) ?? null;
      const localizationConfig = page.localization || {};

      const { localeResolver, translationResolver } = useMemo(
        () =>
          createI18nEnvironment({
            supportedLocales: localizationConfig.supportedLocales,
            defaultLocale: currentLocale,
            fallbackLocale: localizationConfig.fallbackLocale,
          }),
        [
          currentLocale,
          localizationConfig.supportedLocales,
          localizationConfig.fallbackLocale,
        ],
      );

      return (
        <I18nProvider
          initialLocale={currentLocale}
          localeResolver={localeResolver}
          translationResolver={translationResolver}
        >
          <PageComponent {...props} />
        </I18nProvider>
      );
    };

    WrappedPage.displayName = `I18n(${PageComponent.displayName ?? PageComponent.name ?? 'Page'})`;
    WrappedPage.layout = PageComponent.layout;

    return WrappedPage;
  },

  setup({ el, App, props }) {
    const initialProps = props.initialPage.props as InertiaPageProps;
    propsCache = initialProps;

    if (initialProps.websiteSettings?.metaTitleTemplate) {
      currentTitleTemplate = initialProps.websiteSettings.metaTitleTemplate;
    }
    if (initialProps.websiteSettings?.siteName) {
      currentSiteName = initialProps.websiteSettings.siteName;
    }
    if (initialProps.websiteSettings?.defaultMetaTitle) {
      currentDefaultMetaTitle = initialProps.websiteSettings.defaultMetaTitle;
    }
    if (initialProps.websiteSettings?.ownerName) {
      currentOwnerName = initialProps.websiteSettings.ownerName;
    }

    const root = createRoot(el);

    root.render(
      <App {...props} />,
    );
  },

  progress: {
    color: '#4B5563',
  },
});
