import {
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { Link } from '@inertiajs/react';
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
        <Link href={item.href}>{item.label}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
