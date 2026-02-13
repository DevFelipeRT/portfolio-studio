import type { ReactElement } from 'react';
import type { InertiaPageComponent, InertiaPageProps } from '../types';
import { resolveLayoutContent } from './utils/layout';
import { wrapWithI18nProvider } from './utils/WithI18nProvider';

/**
 * Creates a decorated Inertia page component that preserves the original page
 * and applies the project-wide layout and i18n conventions.
 */
export function decoratePageComponent(
  Component: InertiaPageComponent,
): InertiaPageComponent {
  const WrappedPage = (props: Record<string, unknown>) => (
    <Component {...props} />
  );

  WrappedPage.displayName = `I18n(${Component.displayName ?? Component.name ?? 'Page'})`;
  WrappedPage.layout = (page: ReactElement<Record<string, unknown>>) => {
    const props = (page.props ?? {}) as InertiaPageProps;
    const content = resolveLayoutContent(Component.layout, page, props);
    return wrapWithI18nProvider(props, content);
  };

  return WrappedPage;
}
