import {
    serializeTableQueryParams,
    setTablePerPageInQueryParams,
    setTableSortInQueryParams,
} from '@/common/table';

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
    return setTablePerPageInQueryParams(
        setTableSortInQueryParams(serializeTableQueryParams({
            status:
                filters.status !== DEFAULT_PAGE_LIST_FILTERS.status
                    ? filters.status
                    : null,
            locale:
                filters.locale !== DEFAULT_PAGE_LIST_FILTERS.locale
                    ? filters.locale
                    : null,
            search: filters.search,
        }), {
            column: filters.sort,
            direction: filters.direction,
        }),
        filters.perPage !== DEFAULT_PAGE_LIST_FILTERS.perPage
            ? filters.perPage
            : null,
    );
}
