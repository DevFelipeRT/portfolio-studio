import type { PAGE_STATUS_FILTER_VALUES } from './constants';

/**
 * The supported status filter values for page listings.
 *
 * `'all'` is a sentinel used by the UI to represent "no status filter".
 */
export type PageStatusFilter =
    (typeof PAGE_STATUS_FILTER_VALUES)[number];

/**
 * Filter state used by page listing screens.
 */
export interface PageListFilters {
    status: PageStatusFilter;
    search: string;
}
