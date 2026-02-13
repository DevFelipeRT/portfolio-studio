import { PAGE_STATUS_FILTER_VALUES } from './constants';
import type { PageListFilters, PageStatusFilter } from './types';

/**
 * Default filter values for page listings.
 *
 * Treat this as the canonical "reset" payload for the UI.
 */
export const DEFAULT_PAGE_LIST_FILTERS: PageListFilters = {
    status: 'all',
    search: '',
};

function coerceStatusFilter(value: unknown): PageStatusFilter {
    if (typeof value !== 'string') {
        return DEFAULT_PAGE_LIST_FILTERS.status;
    }

    const trimmed = value.trim();

    if (trimmed === '') {
        return DEFAULT_PAGE_LIST_FILTERS.status;
    }

    if (
        (PAGE_STATUS_FILTER_VALUES as readonly string[]).includes(
            trimmed,
        )
    ) {
        return trimmed as PageStatusFilter;
    }

    return DEFAULT_PAGE_LIST_FILTERS.status;
}

function coerceSearchFilter(value: unknown): string {
    if (typeof value !== 'string') {
        return DEFAULT_PAGE_LIST_FILTERS.search;
    }

    return value;
}

/**
 * Normalizes an untyped filter payload into a valid `PageListFilters`.
 *
 * This is useful when consuming filter values from sources like:
 * - `Record<string, unknown>` view-model props
 * - parsed query params
 */
export function normalizePageListFilters(input: {
    status?: unknown;
    search?: unknown;
}): PageListFilters {
    return {
        status: coerceStatusFilter(input.status),
        search: coerceSearchFilter(input.search),
    };
}
