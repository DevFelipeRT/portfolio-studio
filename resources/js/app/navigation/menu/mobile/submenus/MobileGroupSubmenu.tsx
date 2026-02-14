import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
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

  const isActiveRoot = isAnyNavigationChildActive(
    item.id,
    children,
    hasSections,
    isSectionIdentityActive,
  );

  const [isOpen, setIsOpen] = useState(isActiveRoot);

  useEffect(() => {
    if (isActiveRoot) {
      setIsOpen(true);
    }
  }, [isActiveRoot]);

  const isHighlighted = isActiveRoot || isOpen;

  if (children.length === 0) {
    return null;
  }

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
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={mobileSubmenuContainerClass}
    >
      {'href' in item ? (
        <div className="flex w-full items-stretch">
          <Link
            href={item.href}
            className={[
              mobileTriggerClass(isHighlighted),
              'inline-flex flex-1 items-center justify-start',
            ].join(' ')}
            onClick={onClose}
          >
            {item.label}
          </Link>

          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className={[
                mobileTriggerClass(isHighlighted),
                'group w-10 shrink-0 px-0 justify-center',
              ].join(' ')}
              aria-label={`Toggle ${item.label} submenu`}
            >
              <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
        </div>
      ) : (
        <CollapsibleTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className={[
              mobileTriggerClass(isHighlighted),
              'group flex items-center justify-between gap-2',
            ].join(' ')}
          >
            <span className="truncate">{item.label}</span>
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
      )}

      <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
        <div className={mobileSubmenuChildrenClass}>
          {children.map(renderChild)}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
