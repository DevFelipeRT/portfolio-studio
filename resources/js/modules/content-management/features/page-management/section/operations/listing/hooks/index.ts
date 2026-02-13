/**
 * Public hooks API for the sections listing feature.
 *
 * Notes:
 * - `useSectionListController` is the main entry-point: it manages optimistic reorder,
 *   persistence, and the "locked while saving" state.
 * - Internal helpers live under `hooks/internal/` and are intentionally not exported.
 */
export { useSectionListController } from './useSectionListController';
export { useSortableSectionRow } from './useSortableSectionRow';
