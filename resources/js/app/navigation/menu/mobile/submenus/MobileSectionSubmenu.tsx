import { Button } from '@/components/ui/button';
import type { MouseEvent } from 'react';
import { buildSectionIdentity } from '../../../section-tracking/sectionIdentity';
import type { NavigationSectionItem } from '../../../types';
import { isSectionItem } from '../../../utils/guards';
import { isAnyNavigationChildActive } from '../../activeChildren';
import {
  mobileButtonClass,
  mobileSubmenuChildrenClass,
  mobileSubmenuContainerClass,
  mobileTriggerClass,
  mobileWrapperClass,
} from '../styles';

type MobileSectionSubmenuProps = {
  item: NavigationSectionItem;
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

export function MobileSectionSubmenu({
  item,
  hasSections,
  isSectionIdentityActive,
  shouldRenderSectionChild,
  onSectionNavigate,
  onClose,
}: MobileSectionSubmenuProps) {
  const children = item.children ?? [];
  const sectionChildren = children.filter(isSectionItem);
  const visibleChildren = sectionChildren.filter(shouldRenderSectionChild);

  if (visibleChildren.length === 0) {
    return null;
  }

  const isActiveRoot =
    (hasSections && isSectionIdentityActive(item.id)) ||
    isAnyNavigationChildActive(
      item.id,
      sectionChildren,
      hasSections,
      isSectionIdentityActive,
    );

  const renderSectionChild = (child: NavigationSectionItem) => {
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

  return (
    <div className={mobileSubmenuContainerClass}>
      <Button
        type="button"
        variant="ghost"
        className={mobileTriggerClass(isActiveRoot)}
        onClick={(event) => {
          onSectionNavigate(event, item, item.id);
          onClose?.();
        }}
      >
        {item.label}
      </Button>

      <div className={mobileSubmenuChildrenClass}>
        {visibleChildren.map(renderSectionChild)}
      </div>
    </div>
  );
}
