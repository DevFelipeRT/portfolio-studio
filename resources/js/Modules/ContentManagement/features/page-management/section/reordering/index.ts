/**
 * Public API for section reordering.
 *
 * Pure helpers live in `ordering.ts`; side-effects live in `useReorderSections.ts`.
 */
export { orderedFromIds, swappedIds } from './ordering';
export { useReorderSections } from './useReorderSections';
