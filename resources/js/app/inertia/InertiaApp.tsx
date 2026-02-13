import { createInertiaApp } from '@inertiajs/react';
import { createInertiaPageResolver, resolveInitialPageForCSR } from './page';
import type { InertiaPageProps } from './types';
import {
  getInertiaPageRegistry,
  inertiaTitle,
  initializeInertiaRuntimeState,
  renderInertiaApp,
} from './utils';

const useScriptElementForInitialPage = true;

export function bootInertiaApp(): void {
  const initialPage = useScriptElementForInitialPage
    ? resolveInitialPageForCSR()
    : undefined;

  // Initializes derived metadata (e.g. title tokens) from the initial page props.
  if (initialPage?.props) {
    initializeInertiaRuntimeState(initialPage.props as InertiaPageProps);
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
