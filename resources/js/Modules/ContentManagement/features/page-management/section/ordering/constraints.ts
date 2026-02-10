import type { PageSectionDto } from '@/Modules/ContentManagement/types';
import { normalizeSlotKey } from '@/Modules/ContentManagement/shared/strings';

export type SectionOrderValidationResult =
  | { ok: true }
  | { ok: false; code: 'HERO_ORDER'; message: string };

/**
 * Enforces the "hero first" constraint:
 * all hero sections must appear before any non-hero section.
 */
export function validateHeroFirstOrder(
  orderedSections: PageSectionDto[],
): SectionOrderValidationResult {
  let seenNonHero = false;

  for (const section of orderedSections) {
    const isHero = normalizeSlotKey(section.slot) === 'hero';

    if (!isHero) {
      seenNonHero = true;
      continue;
    }

    if (seenNonHero) {
      return {
        ok: false,
        code: 'HERO_ORDER',
        message:
          'Hero sections must be positioned first with no other slots before or between them.',
      };
    }
  }

  return { ok: true };
}
