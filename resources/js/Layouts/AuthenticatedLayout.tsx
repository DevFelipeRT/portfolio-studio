// resources/js/Layouts/AuthenticatedLayout.tsx

import { ThemeProvider } from '@/Components/Theme/ThemeProvider';
import {
    navigationConfig,
    type NavigationConfigItem,
} from '@/config/navigation';
import { useTranslation } from '@/i18n';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';
import Footer from './Partials/Footer';
import Header from './Partials/Header';
import Navigation, { AuthUser, NavigationItem } from './Partials/Navigation';

type SharedProps = {
    auth: {
        user: AuthUser | null;
    };
};

function mapConfigToNavigationItems(
    items: NavigationConfigItem[],
    translate: (key: string, fallback: string) => string,
): NavigationItem[] {
    return items.map<NavigationItem>((item) => {
        const href = route(item.routeName);
        const isActive =
            !!route().current(item.routeName) ||
            !!item.children?.some((child) => route().current(child.routeName));

        const children = item.children
            ? item.children.map((child) => ({
                  id: child.id,
                  label: translate(child.translationKey, child.fallbackLabel),
                  href: route(child.routeName),
                  isActive: !!route().current(child.routeName),
              }))
            : undefined;

        return {
            id: item.id,
            label: translate(item.translationKey, item.fallbackLabel),
            kind: item.kind,
            href,
            isActive,
            children,
        };
    });
}

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage().props as SharedProps;
    const { translate } = useTranslation('layout');

    const navItems: NavigationItem[] = mapConfigToNavigationItems(
        navigationConfig,
        (key, fallback) => translate(key, fallback),
    );

    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <div className="text-foreground flex min-h-dvh w-full flex-col">
                <Header>
                    <Navigation items={navItems} user={auth.user} />
                </Header>

                <main className="w-full grow py-4 sm:py-6">
                    {header && (
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    )}

                    <div className="mx-auto max-w-7xl grow px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>

                <Footer />
            </div>
        </ThemeProvider>
    );
}
