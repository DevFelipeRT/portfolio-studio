// resources/js/config/navigation.ts

export type NavigationConfigKind = 'link' | 'section' | 'group';

export type NavigationConfigBaseNode = {
    id: string;
    kind: NavigationConfigKind;
    translationKey: string;
    fallbackLabel: string;
    children?: NavigationConfigNode[];
};

export type NavigationConfigLinkNode = NavigationConfigBaseNode & {
    kind: 'link';
    routeName: string;
};

export type NavigationConfigSectionNode = NavigationConfigBaseNode & {
    kind: 'section';
    targetId?: string;
    scrollToTop?: boolean;
};

export type NavigationConfigGroupNode = NavigationConfigBaseNode & {
    kind: 'group';
};

export type NavigationConfigNode =
    | NavigationConfigLinkNode
    | NavigationConfigSectionNode
    | NavigationConfigGroupNode;

export const navigationConfig: NavigationConfigNode[] = [
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
        kind: 'group',
        translationKey: 'header.navigation.portfolio',
        fallbackLabel: 'Portfolio',
        children: [
            {
                id: 'pages',
                kind: 'link',
                routeName: 'admin.content.pages.index',
                translationKey: 'header.navigation.portfolioPages',
                fallbackLabel: 'Pages',
            },
            {
                id: 'images',
                kind: 'link',
                routeName: 'images.index',
                translationKey: 'header.navigation.portfolioImages',
                fallbackLabel: 'Images',
            },
            {
                id: 'projects',
                kind: 'link',
                routeName: 'projects.index',
                translationKey: 'header.navigation.portfolioProjects',
                fallbackLabel: 'Projects',
            },
            {
                id: 'experiences',
                kind: 'link',
                routeName: 'experiences.index',
                translationKey: 'header.navigation.portfolioExperiences',
                fallbackLabel: 'Experiences',
            },
            {
                id: 'courses',
                kind: 'link',
                routeName: 'courses.index',
                translationKey: 'header.navigation.portfolioCourses',
                fallbackLabel: 'Courses',
            },
            {
                id: 'skills',
                kind: 'link',
                routeName: 'skills.index',
                translationKey: 'header.navigation.portfolioTechnologies',
                fallbackLabel: 'Skills',
            },
            {
                id: 'skill-categories',
                kind: 'link',
                routeName: 'skill-categories.index',
                translationKey: 'header.navigation.portfolioSkillCategories',
                fallbackLabel: 'Skill categories',
            },
            {
                id: 'initiatives',
                kind: 'link',
                routeName: 'initiatives.index',
                translationKey: 'header.navigation.portfolioInitiatives',
                fallbackLabel: 'Initiatives',
            },
        ],
    },
];

export const publicNavigationConfig: NavigationConfigNode[] = [
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
        id: 'about',
        kind: 'section',
        translationKey: 'header.navigation.about',
        fallbackLabel: 'About me',
        children: [
            {
                id: 'tech-stack',
                kind: 'section',
                translationKey: 'header.navigation.stack',
                fallbackLabel: 'Stack',
                targetId: 'tech-stack',
            },
            {
                id: 'experience',
                kind: 'section',
                translationKey: 'header.navigation.experience',
                fallbackLabel: 'Career',
                targetId: 'experience',
            },
            {
                id: 'education',
                kind: 'section',
                translationKey: 'header.navigation.education',
                fallbackLabel: 'Education',
                targetId: 'education',
            },
        ],
    },
    {
        id: 'contact',
        kind: 'section',
        translationKey: 'header.navigation.contact',
        fallbackLabel: 'Contact',
        targetId: 'contact',
    },
];
