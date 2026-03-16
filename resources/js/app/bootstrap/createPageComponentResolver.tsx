import { decoratePageComponent } from '@/app/shell';
import type { PageModule, PageModuleLoader } from '@/app/shell';

/**
 * The runtime shape expected from lazily imported page modules.
 */
function isPageModule(value: unknown): value is PageModule {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const maybeDefault = (value as Record<string, unknown>).default;

  if (typeof maybeDefault === 'function') {
    return true;
  }

  return (
    !!maybeDefault &&
    typeof maybeDefault === 'object' &&
    '$$typeof' in (maybeDefault as Record<string, unknown>)
  );
}

/**
 * The page-component resolver used by the browser bootstrap layer to map
 * backend page keys to lazily loaded and shell-decorated React components.
 */
export function createPageComponentResolver(
  registry: Record<string, PageModuleLoader>,
) {
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
