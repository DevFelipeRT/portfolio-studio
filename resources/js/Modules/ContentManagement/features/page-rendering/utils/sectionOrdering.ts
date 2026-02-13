import type { PageSectionDto } from '@/Modules/ContentManagement/types';
import { normalizeSlotKey } from '@/Modules/ContentManagement/utils/strings';

/**
 * Provides ordering utilities for content-managed page sections.
 *
 * The exported function returns a new array that is ordered by slot and then by
 * numeric position, so callers can build navigation and slot-based layouts from
 * a consistent section order.
 */
type SlotRank = 0 | 1 | 2 | 3 | 4;

/**
 * Numeric position used when a section does not have a finite numeric position.
 */
const FALLBACK_POSITION = Number.MAX_SAFE_INTEGER;

/**
 * Returns the slot rank used as the primary ordering key.
 *
 * - hero -> 0
 * - main -> 1
 * - secondary -> 2
 * - footer -> 3
 * - other/unknown -> 4
 */
function getSlotRank(section: PageSectionDto): SlotRank {
  const normalized = normalizeSlotKey(section.slot);

  if (normalized === 'hero') {
    return 0;
  }

  if (normalized === 'main') {
    return 1;
  }

  if (normalized === 'secondary') {
    return 2;
  }

  if (normalized === 'footer') {
    return 3;
  }

  return 4;
}

/**
 * Returns the numeric position sort key for a section.
 *
 * - Uses `section.position` when it is a finite number.
 * - Otherwise returns `FALLBACK_POSITION`.
 */
function getPositionSortKey(section: PageSectionDto): number {
  if (
    typeof section.position === 'number' &&
    Number.isFinite(section.position)
  ) {
    return section.position;
  }

  return FALLBACK_POSITION;
}

/**
 * Compares two sections by position and then by id.
 */
function compareByPositionThenId(left: PageSectionDto, right: PageSectionDto) {
  const leftPosition = getPositionSortKey(left);
  const rightPosition = getPositionSortKey(right);

  if (leftPosition !== rightPosition) {
    return leftPosition - rightPosition;
  }

  return left.id - right.id;
}

/**
 * Returns a new array ordered by slot rank and then by position.
 *
 * - Orders by slot rank (hero -> main -> secondary -> footer -> other).
 * - Within the same slot rank, orders by position and then id.
 * - Does not mutate the input array.
 */
export function orderSections(sections: PageSectionDto[]): PageSectionDto[] {
  return [...sections].sort((left, right) => {
    const leftRank = getSlotRank(left);
    const rightRank = getSlotRank(right);

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    return compareByPositionThenId(left, right);
  });
}
