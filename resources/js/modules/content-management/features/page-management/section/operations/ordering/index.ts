/**
 * Public API for section ordering (reordering).
 *
 * - `permutation.ts`: pure helpers to derive/apply a new order
 * - `constraints.ts`: pure domain constraints for allowed orders
 *
 * Notes:
 * - This module intentionally contains no UI and no heuristics for interpreting server props.
 * - Callers should decide how to present errors and how to reflect the updated server state.
 */
export type {
  ReorderSectionsCallbacks,
  ReorderSectionsSuccessPayload,
} from '../../hooks/useReorderSections';
export { validateHeroFirstOrder } from './constraints';
export type { SectionOrderValidationResult } from './constraints';
export { applyPermutation, swapAdjacent } from './permutation';
