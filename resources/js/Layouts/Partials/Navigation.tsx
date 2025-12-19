// resources/js/Layouts/Partials/Navigation.tsx
'use client';

import { Button } from '@/Components/Ui/button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/Components/Ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/Components/Ui/sheet';
import { NavUser } from '@/Layouts/Partials/NavUser';
import { NAMESPACES } from '@/i18n/config/namespaces';
import { useTranslation } from '@/i18n/react/hooks/useTranslation';
import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { MouseEvent, useEffect, useMemo, useState } from 'react';

export type AuthUser = {
    name: string;
    email: string;
    avatar?: string | null;
};

export type NavigationLinkItem = {
    id: string;
    label: string;
    kind: 'link';
    href: string;
    isActive?: boolean;
    children?: NavigationItem[];
};

export type NavigationSectionItem = {
    id: string;
    label: string;
    kind: 'section';
    targetId?: string;
    scrollToTop?: boolean;
    children?: NavigationItem[];
};

export type NavigationGroupItem = {
    id: string;
    label: string;
    kind: 'group';
    children?: NavigationItem[];
};

export type NavigationItem =
    | NavigationLinkItem
    | NavigationSectionItem
    | NavigationGroupItem;

type NavigationProps = {
    items: NavigationItem[];
    user?: AuthUser | null;
};

type SectionPosition = {
    id: string;
    top: number;
};

type SectionTargetNode = {
    identity: string;
    node: NavigationSectionItem;
};

function isLinkItem(item: NavigationItem): item is NavigationLinkItem {
    return item.kind === 'link';
}

function isSectionItem(item: NavigationItem): item is NavigationSectionItem {
    return item.kind === 'section';
}

function isGroupItem(item: NavigationItem): item is NavigationGroupItem {
    return item.kind === 'group';
}

function getHeaderHeight(): number {
    if (typeof document === 'undefined') {
        return 0;
    }

    const header = document.getElementById('app-header');
    if (!header) {
        return 0;
    }

    return header.getBoundingClientRect().height;
}

function buildSectionIdentity(
    parentIdentity: string | null,
    id: string,
): string {
    if (!parentIdentity) {
        return id;
    }

    return `${parentIdentity}.${id}`;
}

function collectSectionTargets(
    items: NavigationItem[],
    parentIdentity: string | null = null,
    accumulator: SectionTargetNode[] = [],
): SectionTargetNode[] {
    items.forEach((item) => {
        const currentIdentity = buildSectionIdentity(parentIdentity, item.id);

        if (isSectionItem(item)) {
            accumulator.push({
                identity: currentIdentity,
                node: item,
            });
        }

        if (item.children && item.children.length > 0) {
            collectSectionTargets(item.children, currentIdentity, accumulator);
        }
    });

    return accumulator;
}

/**
 * Navigation renders a hybrid navigation bar that supports:
 * - Link items (routes).
 * - Section items (scroll to page sections).
 * - Group items (semantic groups for children).
 * All of them can be mixed and nested in a single configuration tree.
 */
export default function Navigation({ items, user }: NavigationProps) {
    if (!items || items.length === 0) {
        return null;
    }

    const { url } = usePage();

    const sectionTargets = useMemo(() => collectSectionTargets(items), [items]);

    const hasSections = sectionTargets.length > 0;

    const [activeSectionId, setActiveSectionId] = useState<string | null>(
        () => {
            if (sectionTargets.length === 0) {
                return null;
            }

            const topTarget = sectionTargets.find(
                (target) => target.node.scrollToTop,
            );

            if (topTarget) {
                return topTarget.identity;
            }

            const firstWithTarget = sectionTargets.find(
                (target) => !!target.node.targetId && !target.node.scrollToTop,
            );

            return firstWithTarget
                ? firstWithTarget.identity
                : sectionTargets[0].identity;
        },
    );

    const [renderableSectionTargets, setRenderableSectionTargets] = useState<
        string[] | null
    >(null);

    const [sectionPositions, setSectionPositions] = useState<SectionPosition[]>(
        [],
    );

    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const { translate: translateFromLayout } = useTranslation(
        NAMESPACES.layout,
    );
    const { translate: translateFromCommon } = useTranslation(
        NAMESPACES.common,
    );

    const primaryNavigationLabel = translateFromLayout(
        'header.navigation.primaryLabel',
        'Primary navigation',
    );

    const openNavigationLabel = translateFromCommon(
        'navigation.openMenu',
        'Open navigation menu',
    );

    const mobileNavigationTitle = translateFromLayout(
        'header.navigation.mobileTitle',
        'Navigation',
    );

    useEffect(() => {
        if (!hasSections) {
            setRenderableSectionTargets(null);
            setSectionPositions([]);
            return;
        }

        if (typeof document === 'undefined') {
            return;
        }

        const targets: string[] = [];

        sectionTargets.forEach((target) => {
            const node = target.node;

            if (node.scrollToTop) {
                return;
            }

            if (!node.targetId) {
                return;
            }

            const element = document.getElementById(node.targetId);
            if (element && !targets.includes(node.targetId)) {
                targets.push(node.targetId);
            }
        });

        setRenderableSectionTargets(targets);
    }, [hasSections, sectionTargets]);

    useEffect(() => {
        if (!hasSections) {
            setSectionPositions([]);
            return;
        }

        if (typeof window === 'undefined' || typeof document === 'undefined') {
            return;
        }

        function collectSectionPositions(): void {
            const headerHeight = getHeaderHeight();
            const positions: SectionPosition[] = [];

            sectionTargets.forEach((target) => {
                const node = target.node;

                if (node.scrollToTop) {
                    return;
                }

                if (!node.targetId) {
                    return;
                }

                if (
                    renderableSectionTargets !== null &&
                    !renderableSectionTargets.includes(node.targetId)
                ) {
                    return;
                }

                const element = document.getElementById(node.targetId);
                if (!element) {
                    return;
                }

                const rect = element.getBoundingClientRect();
                const top = window.scrollY + rect.top - headerHeight;

                positions.push({
                    id: target.identity,
                    top,
                });
            });

            positions.sort((first, second) => first.top - second.top);
            setSectionPositions(positions);
        }

        collectSectionPositions();

        window.addEventListener('resize', collectSectionPositions);

        return () => {
            window.removeEventListener('resize', collectSectionPositions);
        };
    }, [hasSections, sectionTargets, renderableSectionTargets]);

    useEffect(() => {
        if (!hasSections) {
            return;
        }

        if (typeof window === 'undefined') {
            return;
        }

        if (sectionPositions.length === 0 && sectionTargets.length === 0) {
            return;
        }

        function handleScroll(): void {
            const scrollY = window.scrollY;
            const headerHeight = getHeaderHeight();

            const viewportReference =
                scrollY + headerHeight + window.innerHeight * 0.25;

            let currentSectionId: string | null = null;

            for (let index = 0; index < sectionPositions.length; index += 1) {
                const section = sectionPositions[index];

                if (viewportReference >= section.top) {
                    currentSectionId = section.id;
                } else {
                    break;
                }
            }

            if (!currentSectionId) {
                const topTarget = sectionTargets.find(
                    (target) => target.node.scrollToTop,
                );

                if (topTarget) {
                    currentSectionId = topTarget.identity;
                } else if (sectionPositions.length > 0) {
                    currentSectionId = sectionPositions[0].id;
                } else if (sectionTargets.length > 0) {
                    currentSectionId = sectionTargets[0].identity;
                }
            }

            setActiveSectionId((previous) =>
                previous === currentSectionId ? previous : currentSectionId,
            );
        }

        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [hasSections, sectionPositions, sectionTargets]);

    useEffect(() => {
        setIsSheetOpen(false);
    }, [url]);

    function handleSectionNavigate(
        event: MouseEvent<HTMLButtonElement>,
        node: NavigationSectionItem,
        identity: string,
    ): void {
        event.preventDefault();

        if (typeof window === 'undefined') {
            return;
        }

        if (node.scrollToTop) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });

            window.history.replaceState(null, '', '#top');
            setActiveSectionId(identity);

            return;
        }

        if (!node.targetId) {
            return;
        }

        const targetElement = document.getElementById(node.targetId);
        if (!targetElement) {
            return;
        }

        const headerHeight = getHeaderHeight();
        const rect = targetElement.getBoundingClientRect();
        const targetScrollTop = window.scrollY + rect.top - headerHeight;

        window.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth',
        });

        window.history.replaceState(null, '', `#${node.targetId}`);
        setActiveSectionId(identity);
    }

    function shouldRenderSectionNode(node: NavigationSectionItem): boolean {
        const hasChildren = !!node.children && node.children.length > 0;

        if (!hasChildren) {
            if (node.scrollToTop) {
                return true;
            }

            if (!node.targetId) {
                return false;
            }

            if (renderableSectionTargets === null) {
                return true;
            }

            return renderableSectionTargets.includes(node.targetId);
        }

        const hasRenderableChild = node.children!.some((child) => {
            if (!isSectionItem(child)) {
                return false;
            }

            if (child.scrollToTop) {
                return true;
            }

            if (!child.targetId) {
                return false;
            }

            if (renderableSectionTargets === null) {
                return true;
            }

            return renderableSectionTargets.includes(child.targetId);
        });

        if (node.scrollToTop || node.targetId) {
            if (node.scrollToTop) {
                return true;
            }

            if (!node.targetId) {
                return hasRenderableChild;
            }

            if (renderableSectionTargets === null) {
                return true;
            }

            return renderableSectionTargets.includes(node.targetId);
        }

        return hasRenderableChild;
    }

    function shouldRenderSectionChild(node: NavigationSectionItem): boolean {
        if (node.scrollToTop) {
            return true;
        }

        if (!node.targetId) {
            return false;
        }

        if (renderableSectionTargets === null) {
            return true;
        }

        return renderableSectionTargets.includes(node.targetId);
    }

    function desktopItemClass(isActive: boolean | undefined): string {
        const base = 'border-l-3 md:border-l-0 md:border-b-3 transition';
        const active = 'border-primary';
        const inactive = 'border-transparent';
        return [base, isActive ? active : inactive].join(' ');
    }

    function desktopTriggerClass(isActive: boolean | undefined): string {
        const base = navigationMenuTriggerStyle();
        const active = 'text-accent-foreground';
        const inactive =
            'text-muted-foreground hover:text-foreground hover:bg-muted md:hover:bg-transparent';
        return [base, isActive ? active : inactive].join(' ');
    }

    function mobileWrapperClass(isActive: boolean | undefined): string {
        const base = 'w-full pl-2 transition-all';
        const active = 'border-l-3 md:border-l-0 md:border-b-3 border-primary';
        const inactive =
            'border-l-3 md:border-l-0 md:border-b-3 border-transparent';
        return [base, isActive ? active : inactive].join(' ');
    }

    function mobileButtonClass(isActive: boolean | undefined): string {
        const base =
            'w-full rounded-md px-3 py-2 text-sm font-medium transition transition-colors';
        const active = 'text-accent-foreground hover:bg-transparent';
        const inactive =
            'text-muted-foreground hover:text-foreground hover:bg-transparent hover:outline hover:outline-primary/80';
        return [base, isActive ? active : inactive].join(' ');
    }

    function submenuLinkClass(isActive: boolean | undefined): string {
        const base =
            'block rounded-md px-3 py-2 text-sm leading-tight transition transition-colors';
        const active = 'bg-primary text-primary-foreground';
        const inactive =
            'text-muted-foreground hover:bg-muted hover:text-foreground';
        return [base, isActive ? active : inactive].join(' ');
    }

    function isSectionIdentityActive(identity: string): boolean {
        return hasSections && activeSectionId === identity;
    }

    function hasActiveSectionDescendant(
        parentIdentity: string,
        children: NavigationItem[] | undefined,
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

    return (
        <nav
            className="flex grow items-center justify-center gap-3"
            aria-label={primaryNavigationLabel}
        >
            {/* Desktop navigation (>= md) */}
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
                                            className={desktopItemClass(
                                                isActive,
                                            )}
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
                                            const identity =
                                                buildSectionIdentity(
                                                    item.id,
                                                    child.id,
                                                );
                                            return isSectionIdentityActive(
                                                identity,
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
                                                                            handleSectionNavigate(
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
                                            const identity =
                                                buildSectionIdentity(
                                                    item.id,
                                                    child.id,
                                                );
                                            return isSectionIdentityActive(
                                                identity,
                                            );
                                        }

                                        return false;
                                    },
                                );

                                const isActiveRoot = anyActiveChild;

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
                                                                            handleSectionNavigate(
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

                                    const visibleChildren =
                                        sectionChildren.filter(
                                            shouldRenderSectionChild,
                                        );

                                    const anyActiveChild =
                                        hasActiveSectionDescendant(
                                            item.id,
                                            sectionChildren,
                                        );

                                    const isActiveRoot =
                                        isSectionIdentityActive(item.id) ||
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
                                                                        handleSectionNavigate(
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
                                                                isSectionIdentityActive(
                                                                    identity,
                                                                );

                                                            return (
                                                                <li
                                                                    key={
                                                                        identity
                                                                    }
                                                                >
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
                                                                                handleSectionNavigate(
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

                                const isActiveSection = isSectionIdentityActive(
                                    item.id,
                                );

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
                                                handleSectionNavigate(
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

            {/* Mobile navigation (Sheet) (< md) */}
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
                                                                href={
                                                                    child.href
                                                                }
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
                                                                    handleSectionNavigate(
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
                                                                href={
                                                                    child.href
                                                                }
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
                                                                    handleSectionNavigate(
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
                                            item.children!.filter(
                                                isSectionItem,
                                            );
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
                                                            isSectionIdentityActive(
                                                                item.id,
                                                            ),
                                                        )}
                                                    >
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            className={mobileButtonClass(
                                                                isSectionIdentityActive(
                                                                    item.id,
                                                                ),
                                                            )}
                                                            onClick={(
                                                                event,
                                                            ) => {
                                                                handleSectionNavigate(
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

                                                {visibleChildren.map(
                                                    (child) => {
                                                        const identity =
                                                            buildSectionIdentity(
                                                                item.id,
                                                                child.id,
                                                            );
                                                        const isActiveChild =
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
                                                                        handleSectionNavigate(
                                                                            event,
                                                                            child,
                                                                            identity,
                                                                        );
                                                                        setIsSheetOpen(
                                                                            false,
                                                                        );
                                                                    }}
                                                                >
                                                                    {
                                                                        child.label
                                                                    }
                                                                </Button>
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        );
                                    }

                                    const isActiveSection =
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
                                                    handleSectionNavigate(
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
        </nav>
    );
}
