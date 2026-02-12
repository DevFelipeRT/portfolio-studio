import type { NavigationItem, NavigationSectionItem } from '@/app/navigation';
import {
  getSectionNavigationGroup,
  getSectionNavigationLabel,
} from '@/Modules/ContentManagement/features/page-management/section/navigation';
import type { PageSectionDto } from '@/Modules/ContentManagement/types';
import type { StringNormalizer } from '../../types/strings';

function buildGroupId(label: string): string {
  const safe = label
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  return `group-${safe || 'default'}`;
}

export function buildNavigationItemsFromSections(
  sections: PageSectionDto[],
  normalizer: StringNormalizer,
): NavigationItem[] {
  const items: NavigationItem[] = [];
  const groups = new Map<string, NavigationItem>();

  sections.forEach((section) => {
    const label = getSectionNavigationLabel(section, normalizer);
    const group = getSectionNavigationGroup(section, normalizer);
    const targetId = normalizer.normalize(section.anchor);

    if (!label || !targetId) {
      return;
    }

    const node: NavigationSectionItem = {
      id: `section-${section.id}`,
      label,
      kind: 'section',
      targetId,
    };

    if (!group) {
      items.push(node);
      return;
    }

    const groupKey = group.toLowerCase();
    const existingGroup = groups.get(groupKey);

    if (!existingGroup) {
      const groupNode: NavigationItem = {
        id: buildGroupId(group),
        label: group,
        kind: 'group',
        children: [node],
      };

      groups.set(groupKey, groupNode);
      items.push(groupNode);
      return;
    }

    if (existingGroup.kind === 'group') {
      existingGroup.children = existingGroup.children
        ? [...existingGroup.children, node]
        : [node];
    }
  });

  return items;
}
