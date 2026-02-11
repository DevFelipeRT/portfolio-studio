/**
 * Public API for section ordering (reordering).
 *
 * - `permutation.ts`: pure helpers to derive/apply a new order
 * - `constraints.ts`: pure domain constraints for allowed orders
 * - `useReorderSections.ts`: persistence side-effect (Inertia request)
 *
 * Notes:
 * - This module intentionally contains no UI and no heuristics for interpreting server props.
 * - Callers should decide how to present errors and how to reflect the updated server state.
 */
export { applyPermutation, swapAdjacent } from './permutation';
export { useReorderSections } from './useReorderSections';
export type {
  ReorderSectionsCallbacks,
  ReorderSectionsSuccessPayload,
} from './useReorderSections';
export type { SectionOrderValidationResult } from './constraints';
export { validateHeroFirstOrder } from './constraints';
