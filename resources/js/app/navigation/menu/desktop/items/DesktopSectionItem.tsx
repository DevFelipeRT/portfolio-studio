import { NavigationMenuItem } from '@/components/ui/navigation-menu';
import type { MouseEvent } from 'react';
import type { NavigationSectionItem } from '../../../types';
import { desktopItemClass, desktopTriggerClass } from '../styles';

type DesktopSectionItemProps = {
  item: NavigationSectionItem;
  hasSections: boolean;
  isSectionIdentityActive: (identity: string) => boolean;
  onSectionNavigate: (
    event: MouseEvent<HTMLElement>,
    node: NavigationSectionItem,
    identity: string,
  ) => void;
};

export function DesktopSectionItem({
  item,
  hasSections,
  isSectionIdentityActive,
  onSectionNavigate,
}: DesktopSectionItemProps) {
  const isActiveSection = hasSections && isSectionIdentityActive(item.id);

  return (
    <NavigationMenuItem className={desktopItemClass(isActiveSection)}>
      <button
        type="button"
        className={desktopTriggerClass(isActiveSection)}
        onClick={(event) => onSectionNavigate(event, item, item.id)}
      >
        {item.label}
      </button>
    </NavigationMenuItem>
  );
}
