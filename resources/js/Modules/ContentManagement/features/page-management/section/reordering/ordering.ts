/**
 * Returns a list of items sorted by a list of IDs.
 *
 * Any IDs not found in `items` are ignored.
 */
export function orderedFromIds<TItem extends { id: number }>(
  items: TItem[],
  orderedIds: Array<TItem['id']>,
): TItem[] {
  return orderedIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is TItem => Boolean(item));
}

/**
 * Returns a list of IDs where `itemId` has been swapped one position up/down.
 *
 * If the swap is not possible (item not found or would move out of bounds),
 * returns the original IDs order.
 */
export function swappedIds<TItem extends { id: number }>(
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
