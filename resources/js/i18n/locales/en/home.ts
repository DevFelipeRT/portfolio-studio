// resources/js/i18n/locales/en/home.ts
import type { TranslationTree } from '../../core/types';

const home: TranslationTree = {
    meta: {
        title: 'Home',
    },
    landmarks: {
        main: 'Main content of the portfolio landing page',
    },
    hero: {
        sectionLabel:
            'Introduction and contact section of the portfolio landing page',
        eyebrow: 'Portfolio',
        title: 'Software developer focused on reliable web applications.',
        description:
            'I design and implement web applications with clear architecture, maintainable code and a strong focus on developer and user experience.',
        primaryCta: 'Contact me',
    },
    highlights: {
        sectionLabel: 'Key strengths and value propositions',
        header: {
            eyebrow: 'Highlights',
            title: 'How I like to approach software projects.',
            description:
                'These points summarize how I usually think about design, implementation and collaboration in real-world applications.',
        },
        items: {
            architecture: {
                title: 'Architecture and reliability',
                description:
                    'Emphasis on clear boundaries, predictable behavior and solutions that can evolve without losing stability.',
            },
            quality: {
                title: 'Code quality and maintainability',
                description:
                    'Focus on readable code, modular structure and practices that keep the codebase understandable over time.',
            },
            collaboration: {
                title: 'Collaboration and learning',
                description:
                    'Comfortable with reviews, feedback and shared ownership, always aiming for clear communication in the team.',
            },
        },
    },
    techStack: {
        sectionLabel: 'Technologies used across my projects',
        header: {
            eyebrow: 'Tech stack',
            title: 'Technologies I work with on a daily basis.',
            description:
                'A selection of tools and frameworks that I use to design, build and operate web applications.',
        },
    },
    projects: {
        sectionLabel: 'Highlighted portfolio projects',
        header: {
            eyebrow: 'Projects',
            title: 'Selected projects with technical focus.',
            description:
                'These projects illustrate how I approach architecture, domain modeling and user-facing implementation.',
        },
    },
    initiatives: {
        sectionLabel: 'Events, workshops and teaching initiatives',
        header: {
            eyebrow: 'Initiatives',
            title: 'Events, workshops and teaching initiatives.',
            description:
                'A selection of initiatives I have led or contributed to, including talks, workshops, courses and outreach activities.',
        },
    },
    experience: {
        sectionLabel: 'Professional experience timeline',
        header: {
            eyebrow: 'Career',
            title: 'Professional Experience',
            description:
                'A timeline of roles and responsibilities that shaped my professional journey.',
        },
        emptyMessage: 'No professional experience available to display yet.',
        presentLabel: 'Present',
    },
    education: {
        sectionLabel: 'Academic degree and technical courses',
        header: {
            eyebrow: 'Education',
            title: 'Academic Degree & Technical Courses',
            description:
                'Academic background and complementary technical courses that strengthen my profile as a software developer.',
        },
        emptyMessage: 'No education records available to display yet.',
        presentLabel: 'Present',
        badge: {
            notHighlighted: 'Not currently highlighted',
        },
    },
    contact: {
        sectionLabel: 'Contact and collaboration',
        header: {
            eyebrow: 'Contact',
            title: 'Let us talk about opportunities, projects, or collaboration.',
            description:
                'If you are looking for a developer to strengthen your team, support a specific project, or start a technical collaboration, use the form or the channels below to get in touch.',
        },
        form: {
            name: {
                label: 'Name',
                placeholder: 'Your name',
            },
            email: {
                label: 'Email',
                placeholder: 'you@example.com',
            },
            message: {
                label: 'Message',
                placeholder:
                    'Share what you have in mind and how I can help.',
            },
            submit: {
                default: 'Send message',
                processing: 'Sending…',
            },
        },
        sidebar: {
            heading: 'Other contact channels',
            description:
                'You can also contact me through your preferred channel using the links below to access my profiles and learn more about my work.',
        },
    },
};

export default home;
