import type { NavigationItem, NavigationSectionItem } from '@/app/navigation';
import type { StringNormalizer } from './ports/stringNormalizer';
import type { PageSectionDto } from '@/Modules/ContentManagement/types';

type SectionNavigationMetadata = {
  label: string | null;
  group: string | null;
  targetId: string | null;
};

function resolveSectionNavigationMetadata(
  section: PageSectionDto,
  normalizer: StringNormalizer,
): SectionNavigationMetadata {
  const data = section.data ?? {};
  const label = normalizer.normalize(section.navigation_label);

  return {
    label: label ?? normalizer.normalize(data.navigation_label),
    group: normalizer.normalize(data.navigation_group),
    targetId: normalizer.normalize(section.anchor),
  };
}

export function getSectionNavigationLabel(
  section: PageSectionDto,
  normalizer: StringNormalizer,
): string | null {
  return resolveSectionNavigationMetadata(section, normalizer).label;
}

export function getSectionNavigationGroup(
  section: PageSectionDto,
  normalizer: StringNormalizer,
): string | null {
  return resolveSectionNavigationMetadata(section, normalizer).group;
}

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
    const { label, group, targetId } = resolveSectionNavigationMetadata(
      section,
      normalizer,
    );

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
