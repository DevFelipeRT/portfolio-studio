import { createElement, type ReactElement, type ReactNode } from 'react';
import type { ComponentType } from 'react';
import { I18nProvider, createI18nEnvironment } from '@/Common/i18n';
import type { InertiaPageProps, PageModule, PageModuleLoader } from './types';
import { resolveInitialLocale } from './locale';

function isPageModule(value: unknown): value is PageModule {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const maybeDefault = (value as Record<string, unknown>).default;

  return typeof maybeDefault === 'function';
}

function resolveLayoutContent(
  layout: unknown,
  page: ReactElement<Record<string, unknown>>,
  props: InertiaPageProps,
): ReactNode {
  if (typeof layout === 'function') {
    return layout(page);
  }

  if (Array.isArray(layout)) {
    return layout
      .concat(page)
      .reverse()
      .reduce((children: ReactNode, Layout: unknown) => {
        if (typeof Layout !== 'function') {
          return children;
        }

        const LayoutComponent = Layout as ComponentType<Record<string, unknown>>;

        return createElement(
          LayoutComponent,
          props as Record<string, unknown>,
          children,
        );
      }, page);
  }

  return page;
}

export function createInertiaPageResolver(
  registry: Record<string, PageModuleLoader>,
) {
  /**
   * Resolves an Inertia component name to a React component using
   * the normalized page registry.
   *
   * Expected backend usage:
   *   Inertia::render('Dashboard', [...]);
   *   Inertia::render('Projects/Index', [...]);
   *   Inertia::render('ContentManagement/Pages/Admin/PageEdit', [...]);
   */
  return async (name: string) => {
    const loader = registry[name];

    if (!loader) {
      throw new Error(`Page not found in registry: ${name}`);
    }

    const loadedModule: unknown = await loader();

    if (!isPageModule(loadedModule)) {
      throw new Error(
        `Resolved module for "${name}" does not have a default export.`,
      );
    }

    const PageComponent = loadedModule.default;

    const WrappedPage = (props: Record<string, unknown>) => (
      <PageComponent {...props} />
    );

    WrappedPage.displayName = `I18n(${PageComponent.displayName ?? PageComponent.name ?? 'Page'})`;
    WrappedPage.layout = (page: ReactElement<Record<string, unknown>>) => {
      const props = (page.props ?? {}) as InertiaPageProps;
      const currentLocale = resolveInitialLocale(props) ?? null;
      const localizationConfig = props.localization || {};

      const { localeResolver, translationResolver } = createI18nEnvironment({
        supportedLocales: localizationConfig.supportedLocales,
        defaultLocale: currentLocale,
        fallbackLocale: localizationConfig.fallbackLocale,
      });

      const content = resolveLayoutContent(PageComponent.layout, page, props);

      return (
        <I18nProvider
          initialLocale={currentLocale}
          localeResolver={localeResolver}
          translationResolver={translationResolver}
        >
          {content}
        </I18nProvider>
      );
    };

    return WrappedPage;
  };
}

