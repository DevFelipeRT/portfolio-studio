import type { MouseEvent } from 'react';
import type { NavigationItem, NavigationSectionItem } from '../../types';
import { isGroupItem, isLinkItem, isSectionItem } from '../../utils/guards';
import { shouldRenderSectionChild, shouldRenderSectionNode } from '../rules';
import { MobileLinkItem } from './items/MobileLinkItem';
import { MobileSectionItem } from './items/MobileSectionItem';
import { MobileGroupSubmenu } from './submenus/MobileGroupSubmenu';
import { MobileSectionSubmenu } from './submenus/MobileSectionSubmenu';

export type MobileNavigationMenuProps = {
  items: NavigationItem[];
  hasSections: boolean;
  isSectionIdentityActive: (identity: string) => boolean;
  renderableSectionTargets: string[] | null;
  onSectionNavigate: (
    event: MouseEvent<HTMLElement>,
    node: NavigationSectionItem,
    identity: string,
  ) => void;
  onClose?: () => void;
};

export function MobileNavigationMenu({
  items,
  hasSections,
  isSectionIdentityActive,
  renderableSectionTargets,
  onSectionNavigate,
  onClose,
}: MobileNavigationMenuProps) {
  const shouldRenderSectionNodeBound = (node: NavigationSectionItem): boolean =>
    shouldRenderSectionNode(node, renderableSectionTargets);

  const shouldRenderSectionChildBound = (
    node: NavigationSectionItem,
  ): boolean => shouldRenderSectionChild(node, renderableSectionTargets);

  const renderItem = (item: NavigationItem) => {
    const hasChildren = !!item.children && item.children.length > 0;

    if (isLinkItem(item)) {
      if (!hasChildren) {
        return <MobileLinkItem key={item.id} item={item} onClose={onClose} />;
      }

      return (
        <MobileGroupSubmenu
          key={item.id}
          item={item}
          hasSections={hasSections}
          isSectionIdentityActive={isSectionIdentityActive}
          shouldRenderSectionChild={shouldRenderSectionChildBound}
          onSectionNavigate={onSectionNavigate}
          onClose={onClose}
        />
      );
    }

    if (isGroupItem(item)) {
      return (
        <MobileGroupSubmenu
          key={item.id}
          item={item}
          hasSections={hasSections}
          isSectionIdentityActive={isSectionIdentityActive}
          shouldRenderSectionChild={shouldRenderSectionChildBound}
          onSectionNavigate={onSectionNavigate}
          onClose={onClose}
        />
      );
    }

    if (isSectionItem(item)) {
      if (!shouldRenderSectionNodeBound(item)) {
        return null;
      }

      if (!hasChildren) {
        return (
          <MobileSectionItem
            key={item.id}
            item={item}
            hasSections={hasSections}
            isSectionIdentityActive={isSectionIdentityActive}
            onSectionNavigate={onSectionNavigate}
            onClose={onClose}
          />
        );
      }

      return (
        <MobileSectionSubmenu
          key={item.id}
          item={item}
          hasSections={hasSections}
          isSectionIdentityActive={isSectionIdentityActive}
          shouldRenderSectionChild={shouldRenderSectionChildBound}
          onSectionNavigate={onSectionNavigate}
          onClose={onClose}
        />
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-2 px-6">{items.map(renderItem)}</div>
  );
}
