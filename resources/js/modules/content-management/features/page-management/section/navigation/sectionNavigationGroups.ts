import type { PageSectionDto } from '@/modules/content-management/types';
import type { StringNormalizer } from '@/modules/content-management/types/strings';
import { getSectionNavigationGroup } from './sectionNavigation';

export function collectSectionNavigationGroups(
  sections: PageSectionDto[],
  normalizer: StringNormalizer,
): string[] {
  const unique = new Set<string>();

  sections.forEach((section) => {
    const group = getSectionNavigationGroup(section, normalizer);
    if (group) {
      unique.add(group);
    }
  });

  return Array.from(unique).sort((a, b) => a.localeCompare(b));
}
