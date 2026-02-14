import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
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

  const isActiveRoot =
    (hasSections && isSectionIdentityActive(item.id)) ||
    isAnyNavigationChildActive(
      item.id,
      sectionChildren,
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

  if (visibleChildren.length === 0) {
    return null;
  }

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
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={mobileSubmenuContainerClass}
    >
      <div className="flex w-full items-stretch">
        <Button
          type="button"
          variant="ghost"
          className={[
            mobileTriggerClass(isHighlighted),
            'flex-1 inline-flex items-center justify-start',
          ].join(' ')}
          onClick={(event) => {
            onSectionNavigate(event, item, item.id);
            onClose?.();
          }}
        >
          {item.label}
        </Button>

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

      <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
        <div className={mobileSubmenuChildrenClass}>
          {visibleChildren.map(renderSectionChild)}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
