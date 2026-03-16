import {
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { PageLink } from '@/common/page-runtime';
import type { NavigationLinkItem } from '../../../types';
import { desktopItemClass, desktopTriggerClass } from '../styles';

type DesktopLinkItemProps = {
  item: NavigationLinkItem;
};

export function DesktopLinkItem({ item }: DesktopLinkItemProps) {
  const isActive = !!item.isActive;

  return (
    <NavigationMenuItem className={desktopItemClass(isActive)}>
      <NavigationMenuLink asChild className={desktopTriggerClass(isActive)}>
        <PageLink href={item.href}>{item.label}</PageLink>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
