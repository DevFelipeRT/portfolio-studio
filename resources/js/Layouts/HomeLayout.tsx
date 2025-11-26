import { ThemeProvider } from '@/Components/Theme/ThemeProvider';
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

    const navItems: NavigationItem[] = [
        {
            id: 'home',
            label: 'Home',
            kind: 'section',
            scrollToTop: true,
        },
        {
            id: 'highlights',
            label: 'Highlights',
            kind: 'section',
            targetId: 'highlights',
        },
        {
            id: 'tech-stack',
            label: 'Stack',
            kind: 'section',
            targetId: 'tech-stack',
        },
        {
            id: 'projects',
            label: 'Projects',
            kind: 'section',
            targetId: 'projects',
        },
        {
            id: 'experience',
            label: 'Carrer',
            kind: 'section',
            targetId: 'experience',
        },
        {
            id: 'education',
            label: 'Education',
            kind: 'section',
            targetId: 'education',
        },
        {
            id: 'contact',
            label: 'Contact',
            kind: 'section',
            targetId: 'contact',
        },
    ];

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
