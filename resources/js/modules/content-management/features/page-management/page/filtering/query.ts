import type { PageListFilters } from './types';
import { DEFAULT_PAGE_LIST_FILTERS } from './normalize';

/**
 * Builds a query-string friendly params object from page listing filters.
 *
 * Behavior:
 * - Omits `status` when it matches the default (`'all'`).
 * - Omits `search` when it is empty after `trim()`.
 */
export function buildPageListQueryParams(
    filters: PageListFilters,
): Record<string, string> {
    const params: Record<string, string> = {};
    const trimmedSearch = filters.search.trim();

    if (filters.status !== DEFAULT_PAGE_LIST_FILTERS.status) {
        params.status = filters.status;
    }

    if (trimmedSearch !== '') {
        params.search = trimmedSearch;
    }

    return params;
}
