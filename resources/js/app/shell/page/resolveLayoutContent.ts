import type { ComponentType } from 'react';
import { createElement, type ReactNode } from 'react';
import type { AppPageProps } from '../types';

/**
 * The layout-resolution helper that applies the project page-layout convention
 * to an already rendered page subtree.
 */
export function resolveLayoutContent(
  layout: unknown,
  page: ReactNode,
  props: AppPageProps,
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
