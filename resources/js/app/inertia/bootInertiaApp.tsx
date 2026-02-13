import { createInertiaApp } from '@inertiajs/react';
import { resolveInitialPageForCSR } from './initialPage';
import { pageRegistry } from './pages';
import { createInertiaPageResolver } from './resolve';
import { inertiaTitle } from './title';
import { renderInertiaApp } from './setup';

const useScriptElementForInitialPage = true;

export function bootInertiaApp(): void {
  createInertiaApp({
    page: useScriptElementForInitialPage ? resolveInitialPageForCSR() : undefined,
    title: inertiaTitle,
    resolve: createInertiaPageResolver(pageRegistry),
    setup: ({ el, App, props }) => renderInertiaApp(el, App, props),
    progress: {
      color: '#4B5563',
    },
  });
}
