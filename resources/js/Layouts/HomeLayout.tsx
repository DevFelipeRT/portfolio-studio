// resources/js/Layouts/HomeLayout.tsx

import { ThemeProvider } from '@/Components/Theme/ThemeProvider';
import { homeNavigationConfig } from '@/config/navigation';
import { useTranslation } from '@/i18n';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import Footer from './Partials/Footer';
import Header from './Partials/Header';
import Navigation, { AuthUser, NavigationItem } from './Partials/Navigation';

type SharedProps = {
    auth: {
        user: AuthUser | null;
    };
};

export default function HomeLayout({ children }: PropsWithChildren) {
    const { auth } = usePage().props as SharedProps;
    const { translate } = useTranslation('layout');

    const navItems: NavigationItem[] = homeNavigationConfig.map(
        (item): NavigationItem => ({
            id: item.id,
            label: translate(item.translationKey, item.fallbackLabel),
            kind: item.kind,
            targetId: item.targetId,
            scrollToTop: item.scrollToTop,
            // children propositalmente omitido aqui,
            // pois NavigationSectionItem não o suporta ainda.
        }),
    );

    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <div className="text-foreground flex min-h-dvh w-full flex-col">
                <Header>
                    <Navigation items={navItems} user={auth.user} />
                </Header>

                <main className="w-full grow">
                    <div className="mx-auto max-w-7xl grow px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                        {children}
                    </div>
                </main>

                <Footer />
            </div>
        </ThemeProvider>
    );
}
