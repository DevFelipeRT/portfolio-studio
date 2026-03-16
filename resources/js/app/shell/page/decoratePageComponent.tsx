import type { ReactElement } from 'react';
import type { AppPageComponent, AppPageProps } from '../types';
import { resolveLayoutContent } from './resolveLayoutContent';
import { resolvePageI18nContent } from './resolvePageI18nContent';
import { wrapWithShellProviders } from './wrapWithShellProviders';

/**
 * The shell page decorator that applies layout composition and i18n/provider
 * wrapping to lazily loaded page components.
 */
export function decoratePageComponent(
  Component: AppPageComponent,
): AppPageComponent {
  const WrappedPage = (props: Record<string, unknown>) => (
    <Component {...props} />
  );

  WrappedPage.displayName = `Shell(${Component.displayName ?? Component.name ?? 'Page'})`;
  WrappedPage.layout = (page: ReactElement<Record<string, unknown>>) => {
    const props = (page.props ?? {}) as AppPageProps;
    const { content: pageContent, scopeIds } = resolvePageI18nContent(
      Component,
      page,
      props,
    );
    const content = resolveLayoutContent(Component.layout, pageContent, props);

    return wrapWithShellProviders(props, content, { scopeIds });
  };

  return WrappedPage;
}
