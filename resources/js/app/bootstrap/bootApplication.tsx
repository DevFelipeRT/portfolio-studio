import { createInertiaApp } from '@inertiajs/react';
import { createElement, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import {
  getPageRegistry,
  initializeShell,
  resolveDocumentTitle,
  type AppPageProps,
} from '@/app/shell';
import { createPageComponentResolver } from './createPageComponentResolver';
import { readInitialPage } from './readInitialPage';

/**
 * The current browser bootstrap strategy that reads the initial page payload
 * from the HTML shell during CSR startup.
 */
const useScriptElementForInitialPage = true;

/**
 * The subset of Inertia setup props consumed by the bootstrap mount flow.
 */
type InertiaSetupProps = {
  initialPage?: {
    props?: unknown;
  };
} & Record<string, unknown>;

/**
 * The React mount bridge used by the bootstrap layer after Inertia has created
 * the application component tree.
 */
function renderApplication(el: Element, App: unknown, props: unknown): void {
  const appProps = (props ?? {}) as InertiaSetupProps;
  const root = createRoot(el);
  const AppComponent = App as ComponentType<Record<string, unknown>>;
  root.render(createElement(AppComponent, appProps));
}

/**
 * The browser entry orchestration for the application, including shell
 * initialization, Inertia app creation, and root mounting.
 */
export async function bootApplication(): Promise<void> {
  const initialPage = useScriptElementForInitialPage
    ? readInitialPage()
    : undefined;

  if (initialPage?.props) {
    await initializeShell(initialPage.props as AppPageProps);
  }

  createInertiaApp({
    page: initialPage,
    title: resolveDocumentTitle,
    resolve: createPageComponentResolver(getPageRegistry()),
    setup: ({ el, App, props }) => renderApplication(el, App, props),
    progress: {
      color: '#4B5563',
    },
  });
}
