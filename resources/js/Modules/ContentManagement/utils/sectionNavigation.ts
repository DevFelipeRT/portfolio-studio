import type { NavigationItem, NavigationSectionItem } from '@/Navigation';
import type { PageSectionDto } from '@/Modules/ContentManagement/types';

type SectionNavigationMetadata = {
    label: string | null;
    group: string | null;
    targetId: string | null;
};

function normalizeString(value: unknown): string | null {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();

    return trimmed.length > 0 ? trimmed : null;
}

function resolveSectionNavigationMetadata(
    section: PageSectionDto,
): SectionNavigationMetadata {
    const data = section.data ?? {};
    const label = normalizeString(section.navigation_label);

    return {
        label: label ?? normalizeString(data.navigation_label),
        group: normalizeString(data.navigation_group),
        targetId: normalizeString(section.anchor),
    };
}

export function getSectionNavigationLabel(
    section: PageSectionDto,
): string | null {
    return resolveSectionNavigationMetadata(section).label;
}

export function getSectionNavigationGroup(
    section: PageSectionDto,
): string | null {
    return resolveSectionNavigationMetadata(section).group;
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
): NavigationItem[] {
    const items: NavigationItem[] = [];
    const groups = new Map<string, NavigationItem>();

    sections.forEach((section) => {
        const { label, group, targetId } =
            resolveSectionNavigationMetadata(section);

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
