import {
  type PageRenderingContext,
  type PageRenderingContextContributor,
  type PageRenderingContextNamespaces,
} from './pageRenderingContext';

function normalizeNamespace(value: string): string {
  return value.trim();
}

/**
 * Builds a read-only rendering context from optional base namespaces and
 * a list of domain contributors.
 */
export function buildPageRenderingContext(
  contributors: PageRenderingContextContributor[],
  baseNamespaces: PageRenderingContextNamespaces = {},
): PageRenderingContext {
  const merged: PageRenderingContextNamespaces = { ...baseNamespaces };

  for (const contributor of contributors) {
    const namespace = normalizeNamespace(contributor.namespace);

    if (!namespace) {
      throw new Error('Page rendering context namespace must not be empty.');
    }

    if (Object.prototype.hasOwnProperty.call(merged, namespace)) {
      throw new Error(
        `Duplicate page rendering context namespace found: ${namespace}`,
      );
    }

    merged[namespace] = contributor.provide();
  }

  return {
    namespaces: Object.freeze(merged),
  };
}
