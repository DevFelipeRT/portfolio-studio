/**
 * Applies a permutation (an ordered list of ids) to a list of items.
 *
 * Notes:
 * - Any ids not found in `items` are ignored.
 * - Any items not referenced by `permutation` are omitted from the result.
 */
export function applyPermutation<TItem extends { id: number }>(
  items: TItem[],
  permutation: Array<TItem['id']>,
): TItem[] {
  return permutation
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is TItem => Boolean(item));
}

/**
 * Returns the next permutation (ordered ids) after swapping `itemId` with its adjacent neighbor.
 *
 * If the swap is not possible (item not found or would move out of bounds), returns the
 * current permutation derived from `items`.
 */
export function swapAdjacent<TItem extends { id: number }>(
  items: TItem[],
  itemId: TItem['id'],
  direction: 'up' | 'down',
): Array<TItem['id']> {
  const index = items.findIndex((item) => item.id === itemId);

  if (index === -1) {
    return items.map((item) => item.id);
  }

  const targetIndex = direction === 'up' ? index - 1 : index + 1;

  if (targetIndex < 0 || targetIndex >= items.length) {
    return items.map((item) => item.id);
  }

  const swapped = [...items];
  const temp = swapped[index];
  swapped[index] = swapped[targetIndex];
  swapped[targetIndex] = temp;

  return swapped.map((item) => item.id);
}
