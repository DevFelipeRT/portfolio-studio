import type { TableSortDirection } from '@/common/table';
import type { PAGE_STATUS_FILTER_VALUES } from './constants';
import type { PAGE_SORTABLE_COLUMNS } from './constants';

/**
 * The supported status filter values for page listings.
 *
 * `'all'` is a sentinel used by the UI to represent "no status filter".
 */
export type PageStatusFilter =
    (typeof PAGE_STATUS_FILTER_VALUES)[number];

export type PageLocaleFilter = string;

export type PageListSortKey =
    (typeof PAGE_SORTABLE_COLUMNS)[number];

/**
 * Filter state used by page listing screens.
 */
export interface PageListFilters {
    perPage: number;
    status: PageStatusFilter;
    locale: PageLocaleFilter;
    search: string;
    sort: PageListSortKey | null;
    direction: TableSortDirection | null;
}
