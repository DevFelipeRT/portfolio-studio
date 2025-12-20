import type { TranslationTree } from '../../core/types';

const layout: TranslationTree = {
    header: {
        landmarkLabel: 'Application header',
        brand: {
            title: 'Felipe Ruiz Terrazas',
            tagline: 'Full-stack developer',
            homeLabel: 'Go to home page',
        },
        navigation: {
            home: 'Home',
            experience: 'Experience',
            projects: 'Projects',
            education: 'Education',
            contact: 'Contact',
            primaryLabel: 'Primary navigation',
            mobileTitle: 'Navigation',
            dashboard: 'Dashboard',
            inbox: 'Inbox',
            portfolio: 'Portfolio',
            portfolioProjects: 'Projects',
            portfolioImages: 'Images',
            portfolioExperiences: 'Experiences',
            portfolioCourses: 'Courses',
            portfolioTechnologies: 'Technologies',
            portfolioInitiatives: 'Initiatives',
            highlights: 'Highlights',
            stack: 'Stack',
            initiatives: 'Initiatives',
        },
    },

    userMenu: {
        openLabel: 'Open user menu',
        dashboard: 'Dashboard',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Log out',
    },

    footer: {
        madeBy: 'Made by Felipe Ruiz Terrazas.',
        rights: 'All rights reserved.',
        links: {
            github: 'GitHub',
            linkedin: 'LinkedIn',
            email: 'E-mail',
        },
    },
};

export default layout;
