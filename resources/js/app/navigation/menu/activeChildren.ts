import { buildSectionIdentity } from '../section-tracking/sectionIdentity';
import type { NavigationItem } from '../types';
import { isLinkItem, isSectionItem } from '../utils/guards';

export function isAnyNavigationChildActive(
  parentId: string,
  children: NavigationItem[] | undefined,
  hasSections: boolean,
  isSectionIdentityActive: (identity: string) => boolean,
): boolean {
  if (!children || children.length === 0) {
    return false;
  }

  return children.some((child) => {
    if (isLinkItem(child)) {
      return !!child.isActive;
    }

    if (isSectionItem(child)) {
      const identity = buildSectionIdentity(parentId, child.id);
      return hasSections && isSectionIdentityActive(identity);
    }

    return false;
  });
}
