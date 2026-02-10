/**
 * Public API for section ordering (reordering).
 *
 * - `permutation.ts`: pure helpers to derive/apply a new order
 * - `constraints.ts`: pure domain constraints for allowed orders
 * - `useReorderSections.ts`: side-effect to persist the order (Inertia request)
 */
export { applyPermutation, swapAdjacent } from './permutation';
export { useReorderSections } from './useReorderSections';
export type { SectionOrderValidationResult } from './constraints';
export { validateHeroFirstOrder } from './constraints';
