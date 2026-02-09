/**
 * Page-list filtering constants.
 *
 * Notes:
 * - `'all'` is the UI sentinel meaning "no status filter".
 * - Options are intentionally UI-facing (labels) and should not be used as
 *   the source of truth for query serialization; use `buildPageListQueryParams`.
 */
export const PAGE_STATUS_FILTER_VALUES = [
    'all',
    'draft',
    'published',
    'archived',
] as const;

/**
 * Select-ready options for the status filter control.
 */
export const PAGE_STATUS_FILTER_OPTIONS: Array<{
    value: (typeof PAGE_STATUS_FILTER_VALUES)[number];
    label: string;
}> = [
    { value: 'all', label: 'All statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
];
