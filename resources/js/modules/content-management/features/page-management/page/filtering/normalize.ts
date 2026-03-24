import {
    PAGE_LOCALE_FILTER_ALL,
    PAGE_SORTABLE_COLUMNS,
    PAGE_STATUS_FILTER_VALUES,
} from './constants';
import type {
    PageListFilters,
    PageLocaleFilter,
    PageListSortKey,
    PageStatusFilter,
} from './types';

/**
 * Default filter values for page listings.
 *
 * Treat this as the canonical "reset" payload for the UI.
 */
export const DEFAULT_PAGE_LIST_FILTERS: PageListFilters = {
    perPage: 15,
    status: 'all',
    locale: PAGE_LOCALE_FILTER_ALL,
    search: '',
    sort: 'name',
    direction: 'asc',
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

function coercePerPage(value: unknown): number {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
        return DEFAULT_PAGE_LIST_FILTERS.perPage;
    }

    return value;
}

function coerceSearchFilter(value: unknown): string {
    if (typeof value !== 'string') {
        return DEFAULT_PAGE_LIST_FILTERS.search;
    }

    return value;
}

function coerceLocaleFilter(value: unknown): PageLocaleFilter {
    if (typeof value !== 'string') {
        return DEFAULT_PAGE_LIST_FILTERS.locale;
    }

    const trimmed = value.trim();

    return trimmed === '' ? DEFAULT_PAGE_LIST_FILTERS.locale : trimmed;
}

function coerceSortFilter(value: unknown): PageListSortKey | null {
    if (typeof value !== 'string') {
        return DEFAULT_PAGE_LIST_FILTERS.sort;
    }

    const trimmed = value.trim();

    if (trimmed === '') {
        return DEFAULT_PAGE_LIST_FILTERS.sort;
    }

    if (
        (PAGE_SORTABLE_COLUMNS as readonly string[]).includes(trimmed)
    ) {
        return trimmed as PageListSortKey;
    }

    return DEFAULT_PAGE_LIST_FILTERS.sort;
}

function coerceSortDirection(
    value: unknown,
    sort: PageListSortKey | null,
): PageListFilters['direction'] {
    if (sort === null) {
        return null;
    }

    if (typeof value !== 'string') {
        return DEFAULT_PAGE_LIST_FILTERS.direction;
    }

    const trimmed = value.trim();

    if (trimmed === 'asc' || trimmed === 'desc') {
        return trimmed;
    }

    return 'asc';
}

/**
 * Normalizes an untyped filter payload into a valid `PageListFilters`.
 *
 * This is useful when consuming filter values from sources like:
 * - `Record<string, unknown>` view-model props
 * - parsed query params
 */
export function normalizePageListFilters(input: {
    per_page?: unknown;
    status?: unknown;
    locale?: unknown;
    search?: unknown;
    sort?: unknown;
    direction?: unknown;
}): PageListFilters {
    const sort = coerceSortFilter(input.sort);

    return {
        perPage: coercePerPage(input.per_page),
        status: coerceStatusFilter(input.status),
        locale: coerceLocaleFilter(input.locale),
        search: coerceSearchFilter(input.search),
        sort,
        direction: coerceSortDirection(input.direction, sort),
    };
}
