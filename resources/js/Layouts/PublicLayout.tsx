// resources/js/Layouts/PublicLayout.tsx

import { ThemeProvider } from '@/Layouts/Partials/Theme/ThemeProvider';
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

export default function PublicLayout({
    children,
    navigationItems,
}: PublicLayoutProps) {
    const { auth } = usePage().props as SharedProps;

    const navItems: NavigationItem[] = navigationItems ?? [];

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
