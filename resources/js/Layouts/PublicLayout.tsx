// resources/js/Layouts/PublicLayout.tsx

import { ThemeProvider } from '@/Components/Theme/ThemeProvider';
import {
    publicNavigationConfig,
    type NavigationConfigNode,
} from '@/config/navigation';
import { useTranslation } from '@/i18n';
import { Navigation, type AuthUser, type NavigationItem } from '@/Navigation';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import Footer from './Partials/Footer';
import Header from './Partials/Header';

type SharedProps = {
    auth: {
        user: AuthUser | null;
    };
};

type PublicLayoutProps = PropsWithChildren<{
    navigationItems?: NavigationItem[];
}>;

function mapConfigToNavigationItems(
    items: NavigationConfigNode[],
    translate: (key: string, fallback: string) => string,
): NavigationItem[] {
    return items.map<NavigationItem>((item) => {
        const base = {
            id: item.id,
            label: translate(item.translationKey, item.fallbackLabel),
        };

        if (item.kind === 'link') {
            const href = route(item.routeName);
            const isActive =
                !!route().current(item.routeName) ||
                !!item.children?.some(
                    (child) =>
                        child.kind === 'link' &&
                        route().current(child.routeName),
                );

            const children = item.children
                ? mapConfigToNavigationItems(item.children, translate)
                : undefined;

            return {
                ...base,
                kind: 'link',
                href,
                isActive,
                children,
            };
        }

        if (item.kind === 'section') {
            const children = item.children
                ? mapConfigToNavigationItems(item.children, translate)
                : undefined;

            return {
                ...base,
                kind: 'section',
                targetId: item.targetId,
                scrollToTop: item.scrollToTop,
                children,
            };
        }

        const children = item.children
            ? mapConfigToNavigationItems(item.children, translate)
            : undefined;

        return {
            ...base,
            kind: 'group',
            children,
        };
    });
}

export default function PublicLayout({
    children,
    navigationItems,
}: PublicLayoutProps) {
    const { auth } = usePage().props as SharedProps;
    const { translate } = useTranslation('layout');

    const navItems: NavigationItem[] =
        navigationItems ??
        mapConfigToNavigationItems(
            publicNavigationConfig,
            (key, fallback) => translate(key, fallback),
        );

    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <div className="text-foreground flex min-h-dvh w-full flex-col">
                <Header>
                    <Navigation items={navItems} user={auth.user} />
                </Header>

                <main className="w-full grow">
                    <div className="mx-auto max-w-7xl grow px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>

                <Footer />
            </div>
        </ThemeProvider>
    );
}
