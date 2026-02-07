import type { NavigationItem, SectionTargetNode } from '../types';
import { isSectionItem } from './guards';
import { buildSectionIdentity } from './identity';

export function collectSectionTargets(
  items: NavigationItem[],
  parentIdentity: string | null = null,
  accumulator: SectionTargetNode[] = [],
): SectionTargetNode[] {
  items.forEach((item) => {
    const currentIdentity = buildSectionIdentity(parentIdentity, item.id);

    if (isSectionItem(item)) {
      accumulator.push({
        identity: currentIdentity,
        node: item,
      });
    }

    if (item.children && item.children.length > 0) {
      collectSectionTargets(item.children, currentIdentity, accumulator);
    }
  });

  return accumulator;
}
