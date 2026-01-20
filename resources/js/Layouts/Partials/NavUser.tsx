'use client';

import { Link, usePage } from '@inertiajs/react';
import { CircleUser, LayoutGrid, LogOut, MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/Components/Ui/avatar';
import { Button } from '@/Components/Ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/Ui/dropdown-menu';
import { NAMESPACES } from '@/i18n/config/namespaces';
import { useTranslation } from '@/i18n/react/hooks/useTranslation';

type NavUserProps = {
    user: {
        name: string;
        email: string;
        avatar?: string | null;
    };
    /**
     * Visual variant:
     * - "icon": avatar-only trigger (desktop header).
     * - "full": avatar + identity (mobile sheet/sidebar).
     */
    variant?: 'icon' | 'full';
};

/**
 * Resets body pointer events in case any overlay leaves it in a blocked state.
 *
 * This is a defensive safeguard against known issues where Radix-based
 * overlays may leave the body with pointer-events set to "none"
 * after navigation or complex overlay interactions.
 */
function resetBodyPointerEvents(): void {
    if (typeof document === 'undefined') {
        return;
    }

    const bodyStyle = document.body.style;

    if (bodyStyle.pointerEvents === 'none') {
        bodyStyle.pointerEvents = '';
    }
}

/**
 * User menu component for authenticated navigation.
 *
 * Renders a dropdown with user identity and account actions.
 * It includes defensive cleanup to ensure the document body
 * does not remain with pointer-events disabled after menu use
 * or route changes, which is important when used inside
 * modal-like components such as Sheet or Sidebar.
 */
export function NavUser({ user, variant = 'full' }: NavUserProps) {
    const { url } = usePage();
    const [isOpen, setIsOpen] = useState(false);

    const { translate } = useTranslation(NAMESPACES.layout);

    const openUserMenuLabel = translate('userMenu.openLabel', 'Open user menu');
    const dashboardLabel = translate('userMenu.dashboard', 'Dashboard');
    const profileLabel = translate('userMenu.profile', 'Profile');
    const logoutLabel = translate('userMenu.logout', 'Log out');

    const userInitials = user.name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase())
        .join('')
        .slice(0, 2);

    useEffect(() => {
        setIsOpen(false);
        resetBodyPointerEvents();
    }, [url]);

    const avatar = (
        <Avatar
            className={
                variant === 'icon'
                    ? 'h-8 w-8 rounded-full grayscale'
                    : 'h-8 w-8 rounded-lg grayscale'
            }
        >
            <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
            <AvatarFallback
                className={variant === 'icon' ? 'rounded-full' : 'rounded-lg'}
            >
                {userInitials}
            </AvatarFallback>
        </Avatar>
    );

    function handleItemSelect(): void {
        setIsOpen(false);
        resetBodyPointerEvents();
    }

    function handleOpenChange(nextOpen: boolean): void {
        setIsOpen(nextOpen);

        if (!nextOpen) {
            resetBodyPointerEvents();
        }
    }

    return (
        <DropdownMenu
            modal={false}
            open={isOpen}
            onOpenChange={handleOpenChange}
        >
            <DropdownMenuTrigger asChild>
                {variant === 'icon' ? (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="hover:border-ring border-border rounded-full border-5"
                        aria-label={openUserMenuLabel}
                        aria-haspopup="menu"
                        aria-expanded={isOpen}
                    >
                        {avatar}
                    </Button>
                ) : (
                    <Button
                        type="button"
                        variant="ghost"
                        className="hover:bg-muted flex w-full max-w-xs items-center gap-3 rounded-lg px-3 py-6 text-left text-sm"
                        aria-haspopup="menu"
                        aria-expanded={isOpen}
                    >
                        {avatar}

                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">
                                {user.name}
                            </span>
                            <span className="text-muted-foreground truncate text-xs">
                                {user.email}
                            </span>
                        </div>

                        <MoreVertical className="text-muted-foreground ml-auto h-4 w-4" />
                    </Button>
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-fit rounded-lg ml-2"
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage
                                src={user.avatar ?? undefined}
                                alt={user.name}
                            />
                            <AvatarFallback className="rounded-lg">
                                {userInitials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">
                                {user.name}
                            </span>
                            <span className="text-muted-foreground truncate text-xs">
                                {user.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    {route().current('home') && (
                        <DropdownMenuItem asChild onSelect={handleItemSelect}>
                            <Link
                                href={route('dashboard')}
                                className="flex w-full items-center"
                            >
                                <LayoutGrid className="mr-2 h-4 w-4" />
                                <span>{dashboardLabel}</span>
                            </Link>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem asChild onSelect={handleItemSelect}>
                        <Link
                            href={route('profile.edit')}
                            className="flex w-full items-center"
                        >
                            <CircleUser className="mr-2 h-4 w-4" />
                            <span>{profileLabel}</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild onSelect={handleItemSelect}>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex w-full items-center"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{logoutLabel}</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
