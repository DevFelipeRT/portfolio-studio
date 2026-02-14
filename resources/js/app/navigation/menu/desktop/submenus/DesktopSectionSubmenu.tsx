import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import type { MouseEvent } from 'react';
import { buildSectionIdentity } from '../../../section-tracking/sectionIdentity';
import type { NavigationSectionItem } from '../../../types';
import { isSectionItem } from '../../../utils/guards';
import { isAnyNavigationChildActive } from '../../activeChildren';
import {
  desktopItemClass,
  desktopSubmenuContentClass,
  desktopTriggerClass,
  submenuLinkClass,
} from '../styles';

type DesktopSectionSubmenuProps = {
  item: NavigationSectionItem;
  hasSections: boolean;
  isSectionIdentityActive: (identity: string) => boolean;
  shouldRenderSectionChild: (node: NavigationSectionItem) => boolean;
  onSectionNavigate: (
    event: MouseEvent<HTMLElement>,
    node: NavigationSectionItem,
    identity: string,
  ) => void;
};

export function DesktopSectionSubmenu({
  item,
  hasSections,
  isSectionIdentityActive,
  shouldRenderSectionChild,
  onSectionNavigate,
}: DesktopSectionSubmenuProps) {
  const children = item.children ?? [];
  const sectionChildren = children.filter(isSectionItem);
  const visibleChildren = sectionChildren.filter(shouldRenderSectionChild);

  const anyActiveChild = isAnyNavigationChildActive(
    item.id,
    sectionChildren,
    hasSections,
    isSectionIdentityActive,
  );

  const isActiveRoot =
    (hasSections && isSectionIdentityActive(item.id)) || anyActiveChild;

  const renderSectionChild = (child: NavigationSectionItem) => {
    const identity = buildSectionIdentity(item.id, child.id);
    const isActiveChild = hasSections && isSectionIdentityActive(identity);

    return (
      <li key={identity}>
        <NavigationMenuLink asChild className={submenuLinkClass(isActiveChild)}>
          <button
            type="button"
            onClick={(event) => onSectionNavigate(event, child, identity)}
          >
            {child.label}
          </button>
        </NavigationMenuLink>
      </li>
    );
  };

  return (
    <NavigationMenuItem className={desktopItemClass(isActiveRoot)}>
      <NavigationMenuTrigger
        className={desktopTriggerClass(isActiveRoot)}
        onPointerDown={(event) => event.preventDefault()}
        onClick={(event) => onSectionNavigate(event, item, item.id)}
      >
        {item.label}
      </NavigationMenuTrigger>

      <NavigationMenuContent className={desktopSubmenuContentClass}>
        <ul className="grid gap-2">
          {visibleChildren.map(renderSectionChild)}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
