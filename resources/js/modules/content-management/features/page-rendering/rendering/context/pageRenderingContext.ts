/**
 * Value exposed by one page rendering context namespace.
 */
export type PageRenderingContextValue = unknown;

/**
 * Namespaced map for page rendering runtime data.
 */
export type PageRenderingContextNamespaces = Record<
  string,
  PageRenderingContextValue
>;

/**
 * Read-only runtime context object provided to page rendering.
 */
export interface PageRenderingContext {
  readonly namespaces: Readonly<PageRenderingContextNamespaces>;
}

/**
 * Contributor contract used by domains to expose runtime context values
 * without coupling provider code to specific modules.
 */
export interface PageRenderingContextContributor {
  readonly namespace: string;
  provide(): PageRenderingContextValue;
}

/**
 * Returns the default page rendering context object.
 */
export function createDefaultPageRenderingContext(): PageRenderingContext {
  return {
    namespaces: Object.freeze({}),
  };
}

/**
 * Reads one namespace value from the rendering context.
 */
export function getPageRenderingContextValue<TValue = unknown>(
  context: PageRenderingContext,
  namespace: string,
): TValue | undefined {
  return context.namespaces[namespace] as TValue | undefined;
}
