import type { ComponentType } from 'react';
import { createElement, type ReactElement, type ReactNode } from 'react';
import type { InertiaPageProps } from '../../types';

/**
 * Applies an Inertia page component's `layout` convention to a page element.
 */
export function resolveLayoutContent(
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

        const LayoutComponent = Layout as ComponentType<
          Record<string, unknown>
        >;

        return createElement(
          LayoutComponent,
          props as Record<string, unknown>,
          children,
        );
      }, page);
  }

  return page;
}
