'use client';

import ApplicationLogo from '@/Layouts/ApplicationLogo/ApplicationLogo';
import { LanguageSwitcher } from '@/Components/LanguageSwitcher';
import { ModeToggle } from '@/Components/Theme/ModeToggle';
import { NavUser } from '@/Layouts/Partials/NavUser';
import { useTranslation } from '@/i18n';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

type AuthUser = {
    name: string;
    email: string;
    avatar?: string | null;
};

type SharedProps = {
    auth: {
        user: AuthUser | null;
    };
};

/**
 * Application header for the authenticated layout.
 *
 * Uses a height scale aligned with modern navigation bars:
 * - 56px (h-14) on smaller viewports.
 * - 64px (h-16) on medium and desktop viewports.
 * - 80px (h-20) on very large viewports (3xl and above).
 * The header is sticky at the top to remain persistent while scrolling.
 */
export default function Header({ children }: PropsWithChildren) {
    const { auth } = usePage().props as SharedProps;
    const user = auth.user;

    const { translate } = useTranslation('layout');

    const headerLabel = translate('header.landmarkLabel', 'Application header');

    const homeLabel = translate('header.brand.homeLabel', 'Go to home page');

    return (
        <header
            id="app-header"
            className="border-border bg-popover/80 supports-[backdrop-filter]:bg-popover/60 sticky top-0 z-40 border-b backdrop-blur"
            aria-label={headerLabel}
        >
            <div className="3xl:h-20 mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
                {/* Brand area */}
                <div className="order-1 flex flex-1 items-center gap-3">
                    <Link
                        href="/"
                        className="flex items-center gap-3"
                        aria-label={homeLabel}
                    >
                        <ApplicationLogo className="fill-current" />
                    </Link>
                </div>

                {/* Navigation */}
                <div
                    className="order-3 flex items-center justify-center gap-4 md:order-2 md:flex-[2]"
                    role="navigation"
                    aria-label={translate(
                        'header.navigation.primaryLabel',
                        'Primary navigation',
                    )}
                >
                    {children}
                </div>

                {/* Mode toggle + user menu (desktop) */}
                <div className="order-2 flex flex-1 items-center justify-end gap-3 md:order-3">
                    <ModeToggle />
                    <LanguageSwitcher />
                    {user && (
                        <div className="hidden md:flex">
                            <NavUser user={user} variant="icon" />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
