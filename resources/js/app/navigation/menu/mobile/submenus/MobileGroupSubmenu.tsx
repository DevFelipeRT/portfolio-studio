import { Button } from '@/components/ui/button';
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
  mobileButtonClass,
  mobileSubmenuChildrenClass,
  mobileSubmenuContainerClass,
  mobileTriggerClass,
  mobileWrapperClass,
} from '../styles';

type MobileGroupSubmenuProps = {
  item: NavigationGroupItem | NavigationLinkItem;
  hasSections: boolean;
  isSectionIdentityActive: (identity: string) => boolean;
  shouldRenderSectionChild: (node: NavigationSectionItem) => boolean;
  onSectionNavigate: (
    event: MouseEvent<HTMLElement>,
    node: NavigationSectionItem,
    identity: string,
  ) => void;
  onClose?: () => void;
};

export function MobileGroupSubmenu({
  item,
  hasSections,
  isSectionIdentityActive,
  shouldRenderSectionChild,
  onSectionNavigate,
  onClose,
}: MobileGroupSubmenuProps) {
  const children = item.children ?? [];
  if (children.length === 0) {
    return null;
  }

  const isActiveRoot = isAnyNavigationChildActive(
    item.id,
    children,
    hasSections,
    isSectionIdentityActive,
  );

  const renderLinkChild = (child: NavigationLinkItem) => {
    const isActive = !!child.isActive;

    return (
      <div key={child.id} className={mobileWrapperClass(isActive)}>
        <Link
          href={child.href}
          className={mobileButtonClass(isActive)}
          onClick={onClose}
        >
          {child.label}
        </Link>
      </div>
    );
  };

  const renderSectionChild = (child: NavigationSectionItem) => {
    if (!shouldRenderSectionChild(child)) {
      return null;
    }

    const identity = buildSectionIdentity(item.id, child.id);
    const isActive = hasSections && isSectionIdentityActive(identity);

    return (
      <div key={identity} className={mobileWrapperClass(isActive)}>
        <Button
          type="button"
          variant="ghost"
          className={mobileButtonClass(isActive)}
          onClick={(event) => {
            onSectionNavigate(event, child, identity);
            onClose?.();
          }}
        >
          {child.label}
        </Button>
      </div>
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
    <div className={mobileSubmenuContainerClass}>
      {'href' in item ? (
        <Link
          href={item.href}
          className={mobileTriggerClass(isActiveRoot)}
          onClick={onClose}
        >
          {item.label}
        </Link>
      ) : (
        <div className={mobileTriggerClass(isActiveRoot)}>{item.label}</div>
      )}
      <div className={mobileSubmenuChildrenClass}>
        {children.map(renderChild)}
      </div>
    </div>
  );
}
