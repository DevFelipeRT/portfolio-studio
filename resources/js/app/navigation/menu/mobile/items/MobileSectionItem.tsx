import { Button } from '@/components/ui/button';
import type { MouseEvent } from 'react';
import type { NavigationSectionItem } from '../../../types';
import { mobileButtonClass, mobileWrapperClass } from '../styles';

type MobileSectionItemProps = {
  item: NavigationSectionItem;
  hasSections: boolean;
  isSectionIdentityActive: (identity: string) => boolean;
  onSectionNavigate: (
    event: MouseEvent<HTMLElement>,
    node: NavigationSectionItem,
    identity: string,
  ) => void;
  onClose?: () => void;
};

export function MobileSectionItem({
  item,
  hasSections,
  isSectionIdentityActive,
  onSectionNavigate,
  onClose,
}: MobileSectionItemProps) {
  const isActive = hasSections && isSectionIdentityActive(item.id);

  return (
    <div className={mobileWrapperClass(isActive)}>
      <Button
        type="button"
        variant="ghost"
        className={mobileButtonClass(isActive)}
        onClick={(event) => {
          onSectionNavigate(event, item, item.id);
          onClose?.();
        }}
      >
        {item.label}
      </Button>
    </div>
  );
}
