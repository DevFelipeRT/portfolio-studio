import type { PageModule, PageModuleLoader } from '../types';
import { decoratePageComponent } from './PageComponent';

function isPageModule(value: unknown): value is PageModule {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const maybeDefault = (value as Record<string, unknown>).default;

  if (typeof maybeDefault === 'function') {
    return true;
  }

  // React "exotic" components (memo/forwardRef) are objects with a $$typeof marker.
  return (
    !!maybeDefault &&
    typeof maybeDefault === 'object' &&
    '$$typeof' in (maybeDefault as Record<string, unknown>)
  );
}

export function createInertiaPageResolver(
  registry: Record<string, PageModuleLoader>,
) {
  /**
   * Resolves an Inertia component name to a React page component by looking up
   * a matching loader in the registry and importing the module.
   *
   * The backend is expected to render component names that match registry keys,
   * e.g. `Inertia::render('dashboard/admin/Dashboard')`.
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

    return decoratePageComponent(loadedModule.default);
  };
}
