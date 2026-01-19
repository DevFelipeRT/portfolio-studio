// resources/js/Navigation/ui/NavigationDesktopMenu.tsx
'use client';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/Components/Ui/navigation-menu';
import { Link } from '@inertiajs/react';
import type { MouseEvent } from 'react';
import {
    desktopItemClass,
    desktopTriggerClass,
    submenuLinkClass,
} from '../styles';
import type {
    NavigationItem,
    NavigationSectionItem,
    SectionTargetNode,
} from '../types';
import { isGroupItem, isLinkItem, isSectionItem } from '../utils/guards';
import { buildSectionIdentity } from '../utils/identity';

export type NavigationDesktopMenuProps = {
    items: NavigationItem[];
    hasSections: boolean;
    sectionTargets: SectionTargetNode[];
    isSectionIdentityActive: (identity: string) => boolean;
    shouldRenderSectionNode: (node: NavigationSectionItem) => boolean;
    shouldRenderSectionChild: (node: NavigationSectionItem) => boolean;
    onSectionNavigate: (
        event: MouseEvent<HTMLElement>,
        node: NavigationSectionItem,
        identity: string,
    ) => void;
};

function hasActiveSectionDescendant(
    parentIdentity: string,
    children: NavigationItem[] | undefined,
    isSectionIdentityActive: (identity: string) => boolean,
): boolean {
    if (!children || children.length === 0) {
        return false;
    }

    return children.some((child) => {
        if (!isSectionItem(child)) {
            return false;
        }

        const identity = buildSectionIdentity(parentIdentity, child.id);
        return isSectionIdentityActive(identity);
    });
}

export function NavigationDesktopMenu({
    items,
    hasSections,
    isSectionIdentityActive,
    shouldRenderSectionNode,
    shouldRenderSectionChild,
    onSectionNavigate,
}: NavigationDesktopMenuProps) {
    return (
        <div className="hidden items-center md:flex">
            <NavigationMenu>
                <NavigationMenuList>
                    {items.map((item) => {
                        const hasChildren =
                            !!item.children && item.children.length > 0;

                        if (isLinkItem(item)) {
                            if (!hasChildren) {
                                const isActive = !!item.isActive;

                                return (
                                    <NavigationMenuItem
                                        key={item.id}
                                        className={desktopItemClass(isActive)}
                                    >
                                        <NavigationMenuLink
                                            asChild
                                            className={desktopTriggerClass(
                                                isActive,
                                            )}
                                        >
                                            <Link href={item.href}>
                                                {item.label}
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                );
                            }

                            const anyActiveChild = item.children!.some(
                                (child) => {
                                    if (isLinkItem(child)) {
                                        return !!child.isActive;
                                    }

                                    if (isSectionItem(child)) {
                                        const identity = buildSectionIdentity(
                                            item.id,
                                            child.id,
                                        );
                                        return (
                                            hasSections &&
                                            isSectionIdentityActive(identity)
                                        );
                                    }

                                    return false;
                                },
                            );

                            const isActiveRoot =
                                !!item.isActive || anyActiveChild;

                            return (
                                <NavigationMenuItem
                                    key={item.id}
                                    className={desktopItemClass(isActiveRoot)}
                                >
                                    <NavigationMenuTrigger
                                        className={desktopTriggerClass(
                                            isActiveRoot,
                                        )}
                                    >
                                        {item.label}
                                    </NavigationMenuTrigger>

                                    <NavigationMenuContent className="bg-popover rounded-md border p-2 shadow-lg">
                                        <ul className="grid w-[220px] gap-2">
                                            <li key={`${item.id}.__self`}>
                                                <NavigationMenuLink
                                                    asChild
                                                    className={submenuLinkClass(
                                                        !!item.isActive,
                                                    )}
                                                >
                                                    <Link href={item.href}>
                                                        {item.label}
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>

                                            {item.children!.map((child) => {
                                                if (isLinkItem(child)) {
                                                    return (
                                                        <li key={child.id}>
                                                            <NavigationMenuLink
                                                                asChild
                                                                className={submenuLinkClass(
                                                                    !!child.isActive,
                                                                )}
                                                            >
                                                                <Link
                                                                    href={
                                                                        child.href
                                                                    }
                                                                >
                                                                    {
                                                                        child.label
                                                                    }
                                                                </Link>
                                                            </NavigationMenuLink>
                                                        </li>
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
                                                        <li key={identity}>
                                                            <NavigationMenuLink
                                                                asChild
                                                                className={submenuLinkClass(
                                                                    isActiveChild,
                                                                )}
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={(
                                                                        event,
                                                                    ) =>
                                                                        onSectionNavigate(
                                                                            event,
                                                                            child,
                                                                            identity,
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        child.label
                                                                    }
                                                                </button>
                                                            </NavigationMenuLink>
                                                        </li>
                                                    );
                                                }

                                                return null;
                                            })}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            );
                        }

                        if (isGroupItem(item)) {
                            if (!hasChildren) {
                                return null;
                            }

                            const anyActiveChild = item.children!.some(
                                (child) => {
                                    if (isLinkItem(child)) {
                                        return !!child.isActive;
                                    }

                                    if (isSectionItem(child)) {
                                        const identity = buildSectionIdentity(
                                            item.id,
                                            child.id,
                                        );
                                        return (
                                            hasSections &&
                                            isSectionIdentityActive(identity)
                                        );
                                    }

                                    return false;
                                },
                            );

                            return (
                                <NavigationMenuItem
                                    key={item.id}
                                    className={desktopItemClass(anyActiveChild)}
                                >
                                    <NavigationMenuTrigger
                                        className={desktopTriggerClass(
                                            anyActiveChild,
                                        )}
                                    >
                                        {item.label}
                                    </NavigationMenuTrigger>

                                    <NavigationMenuContent className="bg-popover rounded-md border p-2 shadow-lg">
                                        <ul className="grid w-[220px] gap-2">
                                            {item.children!.map((child) => {
                                                if (isLinkItem(child)) {
                                                    return (
                                                        <li key={child.id}>
                                                            <NavigationMenuLink
                                                                asChild
                                                                className={submenuLinkClass(
                                                                    !!child.isActive,
                                                                )}
                                                            >
                                                                <Link
                                                                    href={
                                                                        child.href
                                                                    }
                                                                >
                                                                    {
                                                                        child.label
                                                                    }
                                                                </Link>
                                                            </NavigationMenuLink>
                                                        </li>
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
                                                        <li key={identity}>
                                                            <NavigationMenuLink
                                                                asChild
                                                                className={submenuLinkClass(
                                                                    isActiveChild,
                                                                )}
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={(
                                                                        event,
                                                                    ) =>
                                                                        onSectionNavigate(
                                                                            event,
                                                                            child,
                                                                            identity,
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        child.label
                                                                    }
                                                                </button>
                                                            </NavigationMenuLink>
                                                        </li>
                                                    );
                                                }

                                                return null;
                                            })}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            );
                        }

                        if (isSectionItem(item)) {
                            if (!shouldRenderSectionNode(item)) {
                                return null;
                            }

                            if (hasChildren) {
                                const sectionChildren =
                                    item.children!.filter(isSectionItem);

                                const visibleChildren = sectionChildren.filter(
                                    shouldRenderSectionChild,
                                );

                                const anyActiveChild =
                                    hasActiveSectionDescendant(
                                        item.id,
                                        sectionChildren,
                                        isSectionIdentityActive,
                                    );

                                const isActiveRoot =
                                    (hasSections &&
                                        isSectionIdentityActive(item.id)) ||
                                    anyActiveChild;

                                return (
                                    <NavigationMenuItem
                                        key={item.id}
                                        className={desktopItemClass(
                                            isActiveRoot,
                                        )}
                                    >
                                        <NavigationMenuTrigger
                                            className={desktopTriggerClass(
                                                isActiveRoot,
                                            )}
                                        >
                                            {item.label}
                                        </NavigationMenuTrigger>

                                        <NavigationMenuContent className="bg-popover rounded-md border p-2 shadow-lg">
                                            <ul className="grid w-[220px] gap-2">
                                                {item.scrollToTop ||
                                                item.targetId ? (
                                                    <li
                                                        key={`${item.id}.__self`}
                                                    >
                                                        <NavigationMenuLink
                                                            asChild
                                                            className={submenuLinkClass(
                                                                hasSections &&
                                                                    isSectionIdentityActive(
                                                                        item.id,
                                                                    ),
                                                            )}
                                                        >
                                                            <button
                                                                type="button"
                                                                onClick={(
                                                                    event,
                                                                ) =>
                                                                    onSectionNavigate(
                                                                        event,
                                                                        item,
                                                                        item.id,
                                                                    )
                                                                }
                                                            >
                                                                {item.label}
                                                            </button>
                                                        </NavigationMenuLink>
                                                    </li>
                                                ) : null}

                                                {visibleChildren.map(
                                                    (child) => {
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
                                                            <li key={identity}>
                                                                <NavigationMenuLink
                                                                    asChild
                                                                    className={submenuLinkClass(
                                                                        isActiveChild,
                                                                    )}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={(
                                                                            event,
                                                                        ) =>
                                                                            onSectionNavigate(
                                                                                event,
                                                                                child,
                                                                                identity,
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            child.label
                                                                        }
                                                                    </button>
                                                                </NavigationMenuLink>
                                                            </li>
                                                        );
                                                    },
                                                )}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                );
                            }

                            const isActiveSection =
                                hasSections && isSectionIdentityActive(item.id);

                            return (
                                <NavigationMenuItem
                                    key={item.id}
                                    className={desktopItemClass(
                                        isActiveSection,
                                    )}
                                >
                                    <button
                                        type="button"
                                        className={desktopTriggerClass(
                                            isActiveSection,
                                        )}
                                        onClick={(event) =>
                                            onSectionNavigate(
                                                event,
                                                item,
                                                item.id,
                                            )
                                        }
                                    >
                                        {item.label}
                                    </button>
                                </NavigationMenuItem>
                            );
                        }

                        return null;
                    })}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}
