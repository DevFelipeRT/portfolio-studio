import {
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import type { MouseEvent } from 'react';
import type {
  NavigationItem,
  NavigationSectionItem,
  SectionTargetNode,
} from '../../types';
import { isGroupItem, isLinkItem, isSectionItem } from '../../utils/guards';
import { shouldRenderSectionChild, shouldRenderSectionNode } from '../rules';
import { DesktopLinkItem } from './items/DesktopLinkItem';
import { DesktopSectionItem } from './items/DesktopSectionItem';
import { DesktopGroupSubmenu } from './submenus/DesktopGroupSubmenu';
import { DesktopSectionSubmenu } from './submenus/DesktopSectionSubmenu';

export type DesktopNavigationMenuProps = {
  items: NavigationItem[];
  hasSections: boolean;
  sectionTargets: SectionTargetNode[];
  isSectionIdentityActive: (identity: string) => boolean;
  renderableSectionTargets: string[] | null;
  onSectionNavigate: (
    event: MouseEvent<HTMLElement>,
    node: NavigationSectionItem,
    identity: string,
  ) => void;
};

export function DesktopNavigationMenu({
  items,
  hasSections,
  isSectionIdentityActive,
  renderableSectionTargets,
  onSectionNavigate,
}: DesktopNavigationMenuProps) {
  const shouldRenderSectionNodeBound = (node: NavigationSectionItem): boolean =>
    shouldRenderSectionNode(node, renderableSectionTargets);

  const shouldRenderSectionChildBound = (
    node: NavigationSectionItem,
  ): boolean => shouldRenderSectionChild(node, renderableSectionTargets);

  const renderLink = (item: Extract<NavigationItem, { kind: 'link' }>) => {
    const hasChildren = !!item.children && item.children.length > 0;

    if (!hasChildren) {
      return <DesktopLinkItem key={item.id} item={item} />;
    }

    return (
      <DesktopGroupSubmenu
        key={item.id}
        item={item}
        hasSections={hasSections}
        isSectionIdentityActive={isSectionIdentityActive}
        shouldRenderSectionChild={shouldRenderSectionChildBound}
        onSectionNavigate={onSectionNavigate}
      />
    );
  };

  const renderGroup = (item: Extract<NavigationItem, { kind: 'group' }>) => {
    const hasChildren = !!item.children && item.children.length > 0;

    if (!hasChildren) {
      return null;
    }

    return (
      <DesktopGroupSubmenu
        key={item.id}
        item={item}
        hasSections={hasSections}
        isSectionIdentityActive={isSectionIdentityActive}
        shouldRenderSectionChild={shouldRenderSectionChildBound}
        onSectionNavigate={onSectionNavigate}
      />
    );
  };

  const renderSection = (item: NavigationSectionItem) => {
    if (!shouldRenderSectionNodeBound(item)) {
      return null;
    }

    const hasChildren = !!item.children && item.children.length > 0;

    if (!hasChildren) {
      return (
        <DesktopSectionItem
          key={item.id}
          item={item}
          hasSections={hasSections}
          isSectionIdentityActive={isSectionIdentityActive}
          onSectionNavigate={onSectionNavigate}
        />
      );
    }

    return (
      <DesktopSectionSubmenu
        key={item.id}
        item={item}
        hasSections={hasSections}
        isSectionIdentityActive={isSectionIdentityActive}
        shouldRenderSectionChild={shouldRenderSectionChildBound}
        onSectionNavigate={onSectionNavigate}
      />
    );
  };

  const renderItem = (item: NavigationItem) => {
    if (isLinkItem(item)) {
      return renderLink(item);
    }

    if (isGroupItem(item)) {
      return renderGroup(item);
    }

    if (isSectionItem(item)) {
      return renderSection(item);
    }

    return null;
  };

  return (
    <div className="hidden items-center md:flex">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>{items.map(renderItem)}</NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
