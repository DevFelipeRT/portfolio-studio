import { createElement, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import type { InertiaPageProps } from '../types';
import { initializeInertiaRuntimeState } from './runtimeState';

type InertiaSetupProps = {
  initialPage?: {
    props?: unknown;
  };
} & Record<string, unknown>;

/**
 * Mounts the Inertia React application and initializes runtime state from the
 * initial page props.
 */
export function renderInertiaApp(
  el: Element,
  App: unknown,
  props: unknown,
): void {
  const appProps = (props ?? {}) as InertiaSetupProps;
  const initialProps = (appProps.initialPage?.props ?? {}) as InertiaPageProps;
  initializeInertiaRuntimeState(initialProps);

  const root = createRoot(el);
  const AppComponent = App as ComponentType<Record<string, unknown>>;
  root.render(createElement(AppComponent, appProps));
}
