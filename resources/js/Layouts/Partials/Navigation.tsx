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
import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { MouseEvent, useEffect, useState } from 'react';

import { NAMESPACES } from '@/i18n/config/namespaces';
import { useTranslation } from '@/i18n/react/useTranslation';

export type AuthUser = {
    name: string;
    email: string;
    avatar?: string | null;
};

type NestedNavigationLink = {
    id: string;
    label: string;
    href: string;
    isActive?: boolean;
};

type NavigationLinkItem = {
    id: string;
    label: string;
    kind: 'link';
    href: string;
    isActive?: boolean;
    children?: NestedNavigationLink[];
};

type NavigationSectionItem = {
    id: string;
    label: string;
    kind: 'section';
    targetId?: string;
    scrollToTop?: boolean;
};

export type NavigationItem = NavigationLinkItem | NavigationSectionItem;

type NavigationProps = {
    items: NavigationItem[];
    user?: AuthUser | null;
};

type SectionPosition = {
    id: string;
    top: number;
};

function isLinkItem(item: NavigationItem): item is NavigationLinkItem {
    return item.kind === 'link';
}

function isSectionItem(item: NavigationItem): item is NavigationSectionItem {
    return item.kind === 'section';
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

/**
 * Navigation renders the primary navigation with grouped links and section anchors.
 */
export default function Navigation({ items, user }: NavigationProps) {
    if (!items || items.length === 0) {
        return null;
    }

    const { url } = usePage();
    const hasSections = items.some(isSectionItem);

    const [activeSectionId, setActiveSectionId] = useState<string | null>(
        () => {
            const firstSection = items.find(isSectionItem);
            return firstSection ? firstSection.id : null;
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

        items.forEach((item) => {
            if (isSectionItem(item) && !item.scrollToTop && item.targetId) {
                const element = document.getElementById(item.targetId);
                if (element) {
                    targets.push(item.targetId);
                }
            }
        });

        setRenderableSectionTargets(targets);
    }, [items, hasSections]);

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

            items.forEach((item) => {
                if (
                    isSectionItem(item) &&
                    !item.scrollToTop &&
                    item.targetId &&
                    (renderableSectionTargets === null ||
                        renderableSectionTargets.includes(item.targetId))
                ) {
                    const element = document.getElementById(item.targetId);
                    if (!element) {
                        return;
                    }

                    const rect = element.getBoundingClientRect();
                    const top = window.scrollY + rect.top - headerHeight;

                    positions.push({
                        id: item.id,
                        top,
                    });
                }
            });

            positions.sort((first, second) => first.top - second.top);
            setSectionPositions(positions);
        }

        collectSectionPositions();

        window.addEventListener('resize', collectSectionPositions);

        return () => {
            window.removeEventListener('resize', collectSectionPositions);
        };
    }, [items, hasSections, renderableSectionTargets]);

    useEffect(() => {
        if (!hasSections) {
            return;
        }

        if (typeof window === 'undefined') {
            return;
        }

        if (sectionPositions.length === 0) {
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
                const topItem = items.find(
                    (item) => isSectionItem(item) && item.scrollToTop,
                );

                if (topItem && isSectionItem(topItem)) {
                    currentSectionId = topItem.id;
                } else {
                    currentSectionId = sectionPositions[0].id;
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
    }, [hasSections, items, sectionPositions]);

    useEffect(() => {
        setIsSheetOpen(false);
    }, [url]);

    function handleSectionNavigate(
        event: MouseEvent<HTMLButtonElement>,
        item: NavigationSectionItem,
    ): void {
        event.preventDefault();

        if (typeof window === 'undefined') {
            return;
        }

        if (item.scrollToTop) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });

            window.history.replaceState(null, '', '#top');
            setActiveSectionId(item.id);

            return;
        }

        if (!item.targetId) {
            return;
        }

        const targetElement = document.getElementById(item.targetId);
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

        window.history.replaceState(null, '', `#${item.targetId}`);
        setActiveSectionId(item.id);
    }

    function shouldRenderSection(item: NavigationSectionItem): boolean {
        if (item.scrollToTop) {
            return true;
        }

        if (!item.targetId) {
            return false;
        }

        if (renderableSectionTargets === null) {
            return true;
        }

        return renderableSectionTargets.includes(item.targetId);
    }

    function desktopItemClass(isActive: boolean | undefined): string {
        const base = 'border-l-3 md:border-l-0 md:border-b-3';
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
        const base = 'w-full pl-2';
        const active = 'border-l-3 md:border-l-0 md:border-b-3 border-primary';
        const inactive =
            'border-l-3 md:border-l-0 md:border-b-3 border-transparent';
        return [base, isActive ? active : inactive].join(' ');
    }

    function mobileButtonClass(isActive: boolean | undefined): string {
        const base =
            'w-full rounded-md px-3 py-2 text-sm font-medium transition-colors';
        const active = 'text-accent-foreground hover:bg-transparent';
        const inactive =
            'text-muted-foreground hover:text-foreground hover:bg-transparent hover:outline hover:outline-primary/80';
        return [base, isActive ? active : inactive].join(' ');
    }

    function submenuLinkClass(isActive: boolean | undefined): string {
        const base =
            'block rounded-md px-3 py-2 text-sm leading-tight transition-colors';
        const active = 'bg-primary text-accent';
        const inactive =
            'text-muted-foreground hover:bg-muted hover:text-foreground';
        return [base, isActive ? active : inactive].join(' ');
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
                            if (isLinkItem(item)) {
                                const hasChildren =
                                    item.children && item.children.length > 0;

                                const isActive =
                                    !!item.isActive ||
                                    (hasChildren
                                        ? item.children!.some(
                                              (child) => child.isActive,
                                          )
                                        : false);

                                if (hasChildren) {
                                    return (
                                        <NavigationMenuItem
                                            key={item.id}
                                            className={desktopItemClass(
                                                isActive,
                                            )}
                                        >
                                            <NavigationMenuTrigger
                                                className={desktopTriggerClass(
                                                    isActive,
                                                )}
                                            >
                                                {item.label}
                                            </NavigationMenuTrigger>

                                            <NavigationMenuContent className="bg-popover rounded-md border p-2 shadow-lg">
                                                <ul className="grid w-[200px] gap-2">
                                                    {item.children!.map(
                                                        (child) => (
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
                                                        ),
                                                    )}
                                                </ul>
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>
                                    );
                                }

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

                            if (!shouldRenderSection(item)) {
                                return null;
                            }

                            const isActiveSection =
                                hasSections && activeSectionId === item.id;

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
                                            handleSectionNavigate(event, item)
                                        }
                                    >
                                        {item.label}
                                    </button>
                                </NavigationMenuItem>
                            );
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
                                if (isLinkItem(item)) {
                                    const hasChildren =
                                        item.children &&
                                        item.children.length > 0;

                                    if (hasChildren) {
                                        return (
                                            <div
                                                key={item.id}
                                                className="flex flex-col gap-1"
                                            >
                                                <div className="text-muted-foreground px-3 pt-2 text-xs font-semibold tracking-wide uppercase">
                                                    {item.label}
                                                </div>
                                                {item.children!.map((child) => (
                                                    <div
                                                        key={child.id}
                                                        className={mobileWrapperClass(
                                                            !!child.isActive,
                                                        )}
                                                    >
                                                        <Link
                                                            href={child.href}
                                                            className={mobileButtonClass(
                                                                !!child.isActive,
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
                                                ))}
                                            </div>
                                        );
                                    }

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

                                if (!shouldRenderSection(item)) {
                                    return null;
                                }

                                const isActiveSection =
                                    hasSections && activeSectionId === item.id;

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
                                                );
                                                setIsSheetOpen(false);
                                            }}
                                        >
                                            {item.label}
                                        </Button>
                                    </div>
                                );
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
