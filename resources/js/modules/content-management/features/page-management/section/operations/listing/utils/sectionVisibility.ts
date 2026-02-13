import type { PageSectionDto } from '@/modules/content-management/types';

export type SectionVisibilityStatus =
  | 'inactive'
  | 'scheduled'
  | 'expired'
  | 'active';

/**
 * Derives a visibility status for a section based on `is_active` + visibility window.
 */
export function getSectionVisibilityStatus(
  section: PageSectionDto,
  now: Date = new Date(),
): SectionVisibilityStatus {
  if (!section.is_active) {
    return 'inactive';
  }

  const from = section.visible_from ? new Date(section.visible_from) : null;
  const until = section.visible_until ? new Date(section.visible_until) : null;

  if (from && from.getTime() > now.getTime()) {
    return 'scheduled';
  }

  if (until && until.getTime() < now.getTime()) {
    return 'expired';
  }

  return 'active';
}
