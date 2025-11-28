// resources/js/config/navigation.ts

export type NavigationConfigChild = {
    id: string;
    routeName: string;
    translationKey: string;
    fallbackLabel: string;
};

export type NavigationConfigItem = {
    id: string;
    kind: 'link';
    routeName: string;
    translationKey: string;
    fallbackLabel: string;
    children?: NavigationConfigChild[];
};

export type HomeNavigationConfigChild = {
    id: string;
    translationKey: string;
    fallbackLabel: string;
    targetId?: string;
    scrollToTop?: boolean;
};

export type HomeNavigationConfigItem = {
    id: string;
    kind: 'section';
    translationKey: string;
    fallbackLabel: string;
    targetId?: string;
    scrollToTop?: boolean;
    children?: HomeNavigationConfigChild[];
};

export const navigationConfig: NavigationConfigItem[] = [
    {
        id: 'home',
        kind: 'link',
        routeName: 'home',
        translationKey: 'header.navigation.home',
        fallbackLabel: 'Home',
    },
    {
        id: 'dashboard',
        kind: 'link',
        routeName: 'dashboard',
        translationKey: 'header.navigation.dashboard',
        fallbackLabel: 'Dashboard',
    },
    {
        id: 'messages',
        kind: 'link',
        routeName: 'messages.index',
        translationKey: 'header.navigation.inbox',
        fallbackLabel: 'Inbox',
    },
    {
        id: 'portfolio',
        kind: 'link',
        routeName: 'projects.index',
        translationKey: 'header.navigation.portfolio',
        fallbackLabel: 'Portfolio',
        children: [
            {
                id: 'projects',
                routeName: 'projects.index',
                translationKey: 'header.navigation.portfolioProjects',
                fallbackLabel: 'Projects',
            },
            {
                id: 'experiences',
                routeName: 'experiences.index',
                translationKey: 'header.navigation.portfolioExperiences',
                fallbackLabel: 'Experiences',
            },
            {
                id: 'courses',
                routeName: 'courses.index',
                translationKey: 'header.navigation.portfolioCourses',
                fallbackLabel: 'Courses',
            },
            {
                id: 'technologies',
                routeName: 'technologies.index',
                translationKey: 'header.navigation.portfolioTechnologies',
                fallbackLabel: 'Technologies',
            },
            {
                id: 'initiatives',
                routeName: 'initiatives.index',
                translationKey: 'header.navigation.portfolioInitiatives',
                fallbackLabel: 'Initiatives',
            },
        ],
    },
];

export const homeNavigationConfig: HomeNavigationConfigItem[] = [
    {
        id: 'home',
        kind: 'section',
        translationKey: 'header.navigation.home',
        fallbackLabel: 'Home',
        scrollToTop: true,
    },
    {
        id: 'highlights',
        kind: 'section',
        translationKey: 'header.navigation.highlights',
        fallbackLabel: 'Highlights',
        targetId: 'highlights',
    },
    {
        id: 'tech-stack',
        kind: 'section',
        translationKey: 'header.navigation.stack',
        fallbackLabel: 'Stack',
        targetId: 'tech-stack',
    },
    {
        id: 'projects',
        kind: 'section',
        translationKey: 'header.navigation.projects',
        fallbackLabel: 'Projects',
        targetId: 'projects',
    },
    {
        id: 'initiatives',
        kind: 'section',
        translationKey: 'header.navigation.initiatives',
        fallbackLabel: 'Initiatives',
        targetId: 'initiatives',
    },
    {
        id: 'experience',
        kind: 'section',
        translationKey: 'header.navigation.experience',
        fallbackLabel: 'Carrer',
        targetId: 'experience',
    },
    {
        id: 'education',
        kind: 'section',
        translationKey: 'header.navigation.education',
        fallbackLabel: 'Education',
        targetId: 'education',
    },
    {
        id: 'contact',
        kind: 'section',
        translationKey: 'header.navigation.contact',
        fallbackLabel: 'Contact',
        targetId: 'contact',
    },
];
