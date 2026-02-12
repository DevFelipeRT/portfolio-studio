import type { NavigationItem } from '@/app/navigation';
import type { PageSectionDto } from '@/Modules/ContentManagement/types';
import type { StringNormalizer } from '@/Modules/ContentManagement/types/strings';
import { orderSections } from '../sectionOrdering';
import { resolveSectionNavigationNode } from './navigationNodeResolver';
import { createNavigationTree } from '@/app/navigation/tree';

/**
 * Builds the navigation tree used by the page renderer.
 *
 * - Orders sections (slot rank -> position -> id) to keep navigation stable.
 * - Resolves each section into a navigation node (label + anchor target).
 * - Emits either a top-level section item or a grouped section item.
 */
export function buildNavigationItems(
  sections: PageSectionDto[],
  normalizer: StringNormalizer,
): NavigationItem[] {
  const tree = createNavigationTree();

  for (const section of orderSections(sections)) {
    const resolved = resolveSectionNavigationNode(section, normalizer);

    if (!resolved) {
      continue;
    }

    const item = resolved.node;
    const groupLabel = resolved.group;

    if (!groupLabel) {
      tree.appendItem(item);
      continue;
    }

    tree.appendItemToGroup(groupLabel, item);
  }

  return tree.items;
}
