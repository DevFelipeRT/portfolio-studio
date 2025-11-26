import { ThemeProvider } from '@/Components/Theme/ThemeProvider';
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

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage().props as SharedProps;

    const navItems: NavigationItem[] = [
        {
            id: 'home',
            label: 'Home',
            kind: 'link',
            href: route('home'),
            isActive: !!route().current('home'),
        },
        {
            id: 'dashboard',
            label: 'Dashboard',
            kind: 'link',
            href: route('dashboard'),
            isActive: !!route().current('dashboard'),
        },
        {
            id: 'messages',
            label: 'Messages',
            kind: 'link',
            href: route('messages.index'),
            isActive: !!route().current('messages.index'),
        },
        {
            id: 'portfolio',
            label: 'Portfolio',
            kind: 'link',
            href: route('projects.index'),
            isActive:
                !!route().current('projects.index') ||
                !!route().current('experiences.index') ||
                !!route().current('courses.index') ||
                !!route().current('technologies.index'),
            children: [
                {
                    id: 'projects',
                    label: 'Projects',
                    href: route('projects.index'),
                    isActive: !!route().current('projects.index'),
                },
                {
                    id: 'experiences',
                    label: 'Experiences',
                    href: route('experiences.index'),
                    isActive: !!route().current('experiences.index'),
                },
                {
                    id: 'courses',
                    label: 'Courses',
                    href: route('courses.index'),
                    isActive: !!route().current('courses.index'),
                },
                {
                    id: 'technologies',
                    label: 'Technologies',
                    href: route('technologies.index'),
                    isActive: !!route().current('technologies.index'),
                },
            ],
        },
    ];

    return (
        <ThemeProvider
            defaultTheme="system"
            storageKey="vite-ui-theme"
        >
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
