import { PageLink } from '@/common/page-runtime';
import type { NavigationLinkItem } from '../../../types';
import { mobileButtonClass, mobileWrapperClass } from '../styles';

type MobileLinkItemProps = {
  item: NavigationLinkItem;
  onClose?: () => void;
};

export function MobileLinkItem({ item, onClose }: MobileLinkItemProps) {
  const isActive = !!item.isActive;

  return (
    <div className={mobileWrapperClass(isActive)}>
      <PageLink
        href={item.href}
        className={mobileButtonClass(isActive)}
        onClick={onClose}
      >
        {item.label}
      </PageLink>
    </div>
  );
}
