import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Link } from '@inertiajs/react';
import type { MouseEvent } from 'react';
import { buildSectionIdentity } from '../../../section-tracking/sectionIdentity';
import type {
  NavigationGroupItem,
  NavigationItem,
  NavigationLinkItem,
  NavigationSectionItem,
} from '../../../types';
import { isLinkItem, isSectionItem } from '../../../utils/guards';
import { isAnyNavigationChildActive } from '../../activeChildren';
import {
  desktopItemClass,
  desktopSubmenuContentClass,
  desktopTriggerClass,
  submenuLinkClass,
} from '../styles';

type DesktopGroupSubmenuProps = {
  item: NavigationGroupItem | NavigationLinkItem;
  hasSections: boolean;
  isSectionIdentityActive: (identity: string) => boolean;
  shouldRenderSectionChild: (node: NavigationSectionItem) => boolean;
  onSectionNavigate: (
    event: MouseEvent<HTMLElement>,
    node: NavigationSectionItem,
    identity: string,
  ) => void;
};

export function DesktopGroupSubmenu({
  item,
  hasSections,
  isSectionIdentityActive,
  shouldRenderSectionChild,
  onSectionNavigate,
}: DesktopGroupSubmenuProps) {
  const children = item.children ?? [];

  const anyActiveChild = isAnyNavigationChildActive(
    item.id,
    children,
    hasSections,
    isSectionIdentityActive,
  );

  const renderLinkChild = (child: NavigationLinkItem) => {
    const isActiveChild = !!child.isActive;

    return (
      <li key={child.id}>
        <NavigationMenuLink asChild className={submenuLinkClass(isActiveChild)}>
          <Link href={child.href}>{child.label}</Link>
        </NavigationMenuLink>
      </li>
    );
  };

  const renderSectionChild = (child: NavigationSectionItem) => {
    if (!shouldRenderSectionChild(child)) {
      return null;
    }

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

  const renderChild = (child: NavigationItem) => {
    if (isLinkItem(child)) {
      return renderLinkChild(child);
    }

    if (isSectionItem(child)) {
      return renderSectionChild(child);
    }

    return null;
  };

  return (
    <NavigationMenuItem className={desktopItemClass(anyActiveChild)}>
      <NavigationMenuTrigger
        className={desktopTriggerClass(anyActiveChild)}
        onPointerDown={(event) => event.preventDefault()}
        onClick={(event) => event.preventDefault()}
      >
        {item.label}
      </NavigationMenuTrigger>

      <NavigationMenuContent className={desktopSubmenuContentClass}>
        <ul className="grid gap-2">{children.map(renderChild)}</ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
