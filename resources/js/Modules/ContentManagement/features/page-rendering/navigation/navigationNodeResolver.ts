import type { NavigationSectionItem } from '@/app/navigation';
import {
  getSectionNavigationGroup,
  getSectionNavigationLabel,
} from '@/Modules/ContentManagement/features/page-management/section/navigation';
import type { PageSectionDto } from '@/Modules/ContentManagement/types';
import type { StringNormalizer } from '@/Modules/ContentManagement/types/strings';

export type SectionNavigationNode = {
  node: NavigationSectionItem;
  group: string | null;
};

export function resolveSectionNavigationNode(
  section: PageSectionDto,
  normalizer: StringNormalizer,
): SectionNavigationNode | null {
  const label = getSectionNavigationLabel(section, normalizer);
  const targetId = normalizer.normalize(section.anchor);

  if (!label || !targetId) {
    return null;
  }

  return {
    node: {
      id: `section-${section.id}`,
      label,
      kind: 'section',
      targetId,
    },
    group: getSectionNavigationGroup(section, normalizer),
  };
}
