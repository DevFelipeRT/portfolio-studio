// resources/js/Navigation/ui/MobileNavigationMenu.tsx
'use client';

import { Button } from '@/Components/Ui/button';
import { Link } from '@inertiajs/react';
import type { MouseEvent } from 'react';
import type { NavigationItem, NavigationSectionItem } from '../types';
import { isGroupItem, isLinkItem, isSectionItem } from '../utils/guards';
import { buildSectionIdentity } from '../utils/identity';
import {
  mobileButtonClass,
  mobileTriggerClass,
  mobileWrapperClass,
} from './styles';

export type MobileNavigationMenuProps = {
  items: NavigationItem[];
  hasSections: boolean;
  isSectionIdentityActive: (identity: string) => boolean;
  shouldRenderSectionNode: (node: NavigationSectionItem) => boolean;
  shouldRenderSectionChild: (node: NavigationSectionItem) => boolean;
  onSectionNavigate: (
    event: MouseEvent<HTMLElement>,
    node: NavigationSectionItem,
    identity: string,
  ) => void;
  onClose?: () => void;
};

function isAnyChildActive(
  parentId: string,
  children: NavigationItem[] | undefined,
  hasSections: boolean,
  isSectionIdentityActive: (identity: string) => boolean,
): boolean {
  if (!children || children.length === 0) {
    return false;
  }

  return children.some((child) => {
    if (isLinkItem(child)) {
      return !!child.isActive;
    }

    if (isSectionItem(child)) {
      const identity = buildSectionIdentity(parentId, child.id);
      return hasSections && isSectionIdentityActive(identity);
    }

    return false;
  });
}

export function MobileNavigationMenu({
  items,
  hasSections,
  isSectionIdentityActive,
  shouldRenderSectionNode,
  shouldRenderSectionChild,
  onSectionNavigate,
  onClose,
}: MobileNavigationMenuProps) {
  return (
    <div className="flex flex-col gap-2 px-6">
      {items.map((item) => {
        const hasChildren = !!item.children && item.children.length > 0;

        if (isLinkItem(item)) {
          if (!hasChildren) {
            const isActive = !!item.isActive;

            return (
              <div key={item.id} className={mobileWrapperClass(isActive)}>
                <Link
                  href={item.href}
                  className={mobileButtonClass(isActive)}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              </div>
            );
          }

          const isActiveRoot =
            !!item.isActive ||
            isAnyChildActive(
              item.id,
              item.children,
              hasSections,
              isSectionIdentityActive,
            );

          return (
            <div key={item.id} className="flex flex-col gap-1 pl-3">
              <div className={mobileTriggerClass(isActiveRoot)}>
                {item.label}
              </div>

              <div className="flex flex-col gap-1 pl-2">
                <div className={mobileWrapperClass(!!item.isActive)}>
                  <Link
                    href={item.href}
                    className={mobileButtonClass(!!item.isActive)}
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                </div>

                {item.children!.map((child) => {
                  if (isLinkItem(child)) {
                    const isActiveChild = !!child.isActive;

                    return (
                      <div
                        key={child.id}
                        className={mobileWrapperClass(isActiveChild)}
                      >
                        <Link
                          href={child.href}
                          className={mobileButtonClass(isActiveChild)}
                          onClick={onClose}
                        >
                          {child.label}
                        </Link>
                      </div>
                    );
                  }

                  if (isSectionItem(child)) {
                    if (!shouldRenderSectionChild(child)) {
                      return null;
                    }

                    const identity = buildSectionIdentity(item.id, child.id);

                    const isActiveChild =
                      hasSections && isSectionIdentityActive(identity);

                    return (
                      <div
                        key={identity}
                        className={mobileWrapperClass(isActiveChild)}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          className={mobileButtonClass(isActiveChild)}
                          onClick={(event) => {
                            onSectionNavigate(event, child, identity);
                            onClose?.();
                          }}
                        >
                          {child.label}
                        </Button>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          );
        }

        if (isGroupItem(item)) {
          if (!hasChildren) {
            return null;
          }

          const isActiveRoot = isAnyChildActive(
            item.id,
            item.children,
            hasSections,
            isSectionIdentityActive,
          );

          return (
            <div key={item.id} className="flex flex-col gap-1 pl-3">
              <div className={mobileTriggerClass(isActiveRoot)}>
                {item.label}
              </div>

              <div className="flex flex-col gap-1 pl-2">
                {item.children!.map((child) => {
                  if (isLinkItem(child)) {
                    const isActiveChild = !!child.isActive;

                    return (
                      <div
                        key={child.id}
                        className={mobileWrapperClass(isActiveChild)}
                      >
                        <Link
                          href={child.href}
                          className={mobileButtonClass(isActiveChild)}
                          onClick={onClose}
                        >
                          {child.label}
                        </Link>
                      </div>
                    );
                  }

                  if (isSectionItem(child)) {
                    if (!shouldRenderSectionChild(child)) {
                      return null;
                    }

                    const identity = buildSectionIdentity(item.id, child.id);

                    const isActiveChild =
                      hasSections && isSectionIdentityActive(identity);

                    return (
                      <div
                        key={identity}
                        className={mobileWrapperClass(isActiveChild)}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          className={mobileButtonClass(isActiveChild)}
                          onClick={(event) => {
                            onSectionNavigate(event, child, identity);
                            onClose?.();
                          }}
                        >
                          {child.label}
                        </Button>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          );
        }

        if (isSectionItem(item)) {
          if (!shouldRenderSectionNode(item)) {
            return null;
          }

          if (hasChildren) {
            const sectionChildren = item.children!.filter(isSectionItem);

            const visibleChildren = sectionChildren.filter(
              shouldRenderSectionChild,
            );

            if (visibleChildren.length === 0) {
              return null;
            }

            const isActiveRoot =
              (hasSections && isSectionIdentityActive(item.id)) ||
              isAnyChildActive(
                item.id,
                sectionChildren,
                hasSections,
                isSectionIdentityActive,
              );

            return (
              <div key={item.id} className="flex flex-col gap-1 pl-3">
                <div className={mobileTriggerClass(isActiveRoot)}>
                  {item.label}
                </div>

                <div className="flex flex-col gap-1 pl-2">
                  {item.scrollToTop || item.targetId ? (
                    <div
                      className={mobileWrapperClass(
                        hasSections && isSectionIdentityActive(item.id),
                      )}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        className={mobileButtonClass(
                          hasSections && isSectionIdentityActive(item.id),
                        )}
                        onClick={(event) => {
                          onSectionNavigate(event, item, item.id);
                          onClose?.();
                        }}
                      >
                        {item.label}
                      </Button>
                    </div>
                  ) : null}

                  {visibleChildren.map((child) => {
                    const identity = buildSectionIdentity(item.id, child.id);

                    const isActiveChild =
                      hasSections && isSectionIdentityActive(identity);

                    return (
                      <div
                        key={identity}
                        className={mobileWrapperClass(isActiveChild)}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          className={mobileButtonClass(isActiveChild)}
                          onClick={(event) => {
                            onSectionNavigate(event, child, identity);
                            onClose?.();
                          }}
                        >
                          {child.label}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          const isActiveSection =
            hasSections && isSectionIdentityActive(item.id);

          return (
            <div key={item.id} className={mobileWrapperClass(isActiveSection)}>
              <Button
                type="button"
                variant="ghost"
                className={mobileButtonClass(isActiveSection)}
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

        return null;
      })}
    </div>
  );
}
