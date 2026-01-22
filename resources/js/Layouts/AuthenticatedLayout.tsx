// resources/js/Layouts/AuthenticatedLayout.tsx

import { ThemeProvider } from '@/Layouts/Partials/Theme/ThemeProvider';
import { Alert, AlertDescription, AlertTitle } from '@/Components/Ui/alert';
import { Toaster } from '@/Components/Ui/sonner';
import { navigationConfig } from '@/config/navigation';
import { useTranslation } from '@/i18n';
import type { NavigationConfigNode } from '@/Navigation/configTypes';
import { Navigation, type AuthUser, type NavigationItem } from '@/Navigation';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import Footer from './Partials/Footer';
import Header from './Partials/Header';

type SharedProps = {
    auth: {
        user: AuthUser | null;
    };
    errors: Record<string, string>;
    status?: string | null;
};

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

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, errors, status } = usePage().props as SharedProps;
    const { translate } = useTranslation('layout');

    const navItems: NavigationItem[] = mapConfigToNavigationItems(
        navigationConfig,
        (key, fallback) => translate(key, fallback),
    );

    const hasErrors = !!errors && Object.keys(errors).length > 0;

    useEffect(() => {
        if (!status) {
            return;
        }

        if (status.endsWith('.failed') || status.endsWith('_failed')) {
            return;
        }

        const messageKey = `flash.${status}`;
        const message = translate(messageKey, status);

        toast.success(message);
    }, [status, translate]);

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
                        {hasErrors && (
                            <div className="mb-4">
                                <Alert variant="destructive">
                                    <AlertTitle>
                                        {translate(
                                            'validation.title',
                                            'There were some problems with your submission.',
                                        )}
                                    </AlertTitle>
                                    <AlertDescription>
                                        <ul className="list-disc space-y-1 pl-5 text-sm">
                                            {Object.entries(errors).map(
                                                ([field, message]) => (
                                                    <li key={field}>
                                                        {message}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}

                        {children}
                    </div>
                </main>

                <Footer />

                <Toaster richColors closeButton />
            </div>
        </ThemeProvider>
    );
}
