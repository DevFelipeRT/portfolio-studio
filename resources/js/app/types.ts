/**
 * Generic lazy module loader used by page registries.
 *
 * Keep this in `app/` so manifests can share a stable, framework-agnostic
 * contract for lazy-loading page modules.
 */
export type PageModuleLoader = () => Promise<unknown>;

export type PageRegistry = Record<string, PageModuleLoader>;
