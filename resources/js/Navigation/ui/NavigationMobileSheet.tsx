// resources/js/Navigation/ui/NavigationMobileSheet.tsx
'use client';

import { Button } from '@/Components/Ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/Components/Ui/sheet';
import { NavUser } from '@/Layouts/Partials/NavUser';
import { Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import type { MouseEvent } from 'react';
import { mobileButtonClass, mobileWrapperClass } from '../styles';
import type { AuthUser, NavigationItem, NavigationSectionItem } from '../types';
import { isGroupItem, isLinkItem, isSectionItem } from '../utils/guards';
import { buildSectionIdentity } from '../utils/identity';

export type NavigationMobileSheetProps = {
    items: NavigationItem[];
    user?: AuthUser | null;
    isSheetOpen: boolean;
    setIsSheetOpen: (value: boolean) => void;
    openNavigationLabel: string;
    mobileNavigationTitle: string;
    hasSections: boolean;
    isSectionIdentityActive: (identity: string) => boolean;
    shouldRenderSectionNode: (node: NavigationSectionItem) => boolean;
    shouldRenderSectionChild: (node: NavigationSectionItem) => boolean;
    onSectionNavigate: (
        event: MouseEvent<HTMLElement>,
        node: NavigationSectionItem,
        identity: string,
    ) => void;
};

export function NavigationMobileSheet({
    items,
    user,
    isSheetOpen,
    setIsSheetOpen,
    openNavigationLabel,
    mobileNavigationTitle,
    hasSections,
    isSectionIdentityActive,
    shouldRenderSectionNode,
    shouldRenderSectionChild,
    onSectionNavigate,
}: NavigationMobileSheetProps) {
    return (
        <div className="flex items-center md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="data-[state=open]:bg-accent rounded-md data-[state=closed]:ring-0"
                        aria-label={openNavigationLabel}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>

                <SheetContent
                    side="left"
                    className="bg-background/80 supports-backdrop-filter:bg-background/60 flex w-64 flex-col gap-4 backdrop-blur-sm"
                >
                    <SheetHeader className="pl-2 sm:text-center">
                        <SheetTitle className="ml-0.5 px-3 py-2">
                            {mobileNavigationTitle}
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex flex-col gap-2 pt-2">
                        {items.map((item) => {
                            const hasChildren =
                                !!item.children && item.children.length > 0;

                            if (isLinkItem(item)) {
                                if (!hasChildren) {
                                    const isActive = !!item.isActive;

                                    return (
                                        <div
                                            key={item.id}
                                            className={mobileWrapperClass(
                                                isActive,
                                            )}
                                        >
                                            <Link
                                                href={item.href}
                                                className={mobileButtonClass(
                                                    isActive,
                                                )}
                                                onClick={() =>
                                                    setIsSheetOpen(false)
                                                }
                                            >
                                                {item.label}
                                            </Link>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={item.id}
                                        className="flex flex-col gap-1"
                                    >
                                        <div className="text-muted-foreground px-3 pt-2 text-xs font-semibold tracking-wide uppercase">
                                            {item.label}
                                        </div>

                                        <div
                                            className={mobileWrapperClass(
                                                !!item.isActive,
                                            )}
                                        >
                                            <Link
                                                href={item.href}
                                                className={mobileButtonClass(
                                                    !!item.isActive,
                                                )}
                                                onClick={() =>
                                                    setIsSheetOpen(false)
                                                }
                                            >
                                                {item.label}
                                            </Link>
                                        </div>

                                        {item.children!.map((child) => {
                                            if (isLinkItem(child)) {
                                                const isActiveChild =
                                                    !!child.isActive;

                                                return (
                                                    <div
                                                        key={child.id}
                                                        className={mobileWrapperClass(
                                                            isActiveChild,
                                                        )}
                                                    >
                                                        <Link
                                                            href={child.href}
                                                            className={mobileButtonClass(
                                                                isActiveChild,
                                                            )}
                                                            onClick={() =>
                                                                setIsSheetOpen(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    </div>
                                                );
                                            }

                                            if (isSectionItem(child)) {
                                                if (
                                                    !shouldRenderSectionChild(
                                                        child,
                                                    )
                                                ) {
                                                    return null;
                                                }

                                                const identity =
                                                    buildSectionIdentity(
                                                        item.id,
                                                        child.id,
                                                    );

                                                const isActiveChild =
                                                    hasSections &&
                                                    isSectionIdentityActive(
                                                        identity,
                                                    );

                                                return (
                                                    <div
                                                        key={identity}
                                                        className={mobileWrapperClass(
                                                            isActiveChild,
                                                        )}
                                                    >
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            className={mobileButtonClass(
                                                                isActiveChild,
                                                            )}
                                                            onClick={(
                                                                event,
                                                            ) => {
                                                                onSectionNavigate(
                                                                    event,
                                                                    child,
                                                                    identity,
                                                                );
                                                                setIsSheetOpen(
                                                                    false,
                                                                );
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
                                );
                            }

                            if (isGroupItem(item)) {
                                if (!hasChildren) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={item.id}
                                        className="flex flex-col gap-1"
                                    >
                                        <div className="text-muted-foreground px-3 pt-2 text-xs font-semibold tracking-wide uppercase">
                                            {item.label}
                                        </div>

                                        {item.children!.map((child) => {
                                            if (isLinkItem(child)) {
                                                const isActiveChild =
                                                    !!child.isActive;

                                                return (
                                                    <div
                                                        key={child.id}
                                                        className={mobileWrapperClass(
                                                            isActiveChild,
                                                        )}
                                                    >
                                                        <Link
                                                            href={child.href}
                                                            className={mobileButtonClass(
                                                                isActiveChild,
                                                            )}
                                                            onClick={() =>
                                                                setIsSheetOpen(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    </div>
                                                );
                                            }

                                            if (isSectionItem(child)) {
                                                if (
                                                    !shouldRenderSectionChild(
                                                        child,
                                                    )
                                                ) {
                                                    return null;
                                                }

                                                const identity =
                                                    buildSectionIdentity(
                                                        item.id,
                                                        child.id,
                                                    );

                                                const isActiveChild =
                                                    hasSections &&
                                                    isSectionIdentityActive(
                                                        identity,
                                                    );

                                                return (
                                                    <div
                                                        key={identity}
                                                        className={mobileWrapperClass(
                                                            isActiveChild,
                                                        )}
                                                    >
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            className={mobileButtonClass(
                                                                isActiveChild,
                                                            )}
                                                            onClick={(
                                                                event,
                                                            ) => {
                                                                onSectionNavigate(
                                                                    event,
                                                                    child,
                                                                    identity,
                                                                );
                                                                setIsSheetOpen(
                                                                    false,
                                                                );
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
                                );
                            }

                            if (isSectionItem(item)) {
                                if (!shouldRenderSectionNode(item)) {
                                    return null;
                                }

                                if (hasChildren) {
                                    const sectionChildren =
                                        item.children!.filter(isSectionItem);

                                    const visibleChildren =
                                        sectionChildren.filter(
                                            shouldRenderSectionChild,
                                        );

                                    if (visibleChildren.length === 0) {
                                        return null;
                                    }

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex flex-col gap-1"
                                        >
                                            <div className="text-muted-foreground px-3 pt-2 text-xs font-semibold tracking-wide uppercase">
                                                {item.label}
                                            </div>

                                            {item.scrollToTop ||
                                            item.targetId ? (
                                                <div
                                                    className={mobileWrapperClass(
                                                        hasSections &&
                                                            isSectionIdentityActive(
                                                                item.id,
                                                            ),
                                                    )}
                                                >
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        className={mobileButtonClass(
                                                            hasSections &&
                                                                isSectionIdentityActive(
                                                                    item.id,
                                                                ),
                                                        )}
                                                        onClick={(event) => {
                                                            onSectionNavigate(
                                                                event,
                                                                item,
                                                                item.id,
                                                            );
                                                            setIsSheetOpen(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        {item.label}
                                                    </Button>
                                                </div>
                                            ) : null}

                                            {visibleChildren.map((child) => {
                                                const identity =
                                                    buildSectionIdentity(
                                                        item.id,
                                                        child.id,
                                                    );

                                                const isActiveChild =
                                                    hasSections &&
                                                    isSectionIdentityActive(
                                                        identity,
                                                    );

                                                return (
                                                    <div
                                                        key={identity}
                                                        className={mobileWrapperClass(
                                                            isActiveChild,
                                                        )}
                                                    >
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            className={mobileButtonClass(
                                                                isActiveChild,
                                                            )}
                                                            onClick={(
                                                                event,
                                                            ) => {
                                                                onSectionNavigate(
                                                                    event,
                                                                    child,
                                                                    identity,
                                                                );
                                                                setIsSheetOpen(
                                                                    false,
                                                                );
                                                            }}
                                                        >
                                                            {child.label}
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                }

                                const isActiveSection =
                                    hasSections &&
                                    isSectionIdentityActive(item.id);

                                return (
                                    <div
                                        key={item.id}
                                        className={mobileWrapperClass(
                                            isActiveSection,
                                        )}
                                    >
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className={mobileButtonClass(
                                                isActiveSection,
                                            )}
                                            onClick={(event) => {
                                                onSectionNavigate(
                                                    event,
                                                    item,
                                                    item.id,
                                                );
                                                setIsSheetOpen(false);
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

                    {user && (
                        <div className="border-border mt-auto border-t pt-4 md:hidden">
                            <NavUser user={user} variant="full" />
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
