// resources/js/config/navigation.ts

import type { NavigationConfigNode } from '@/app/navigation/types';

export const navigationConfig = [
  {
    id: 'home',
    kind: 'link',
    routeName: 'home',
    translationKey: 'home',
    fallbackLabel: 'Home',
  },
  {
    id: 'dashboard',
    kind: 'link',
    routeName: 'dashboard',
    translationKey: 'dashboard',
    fallbackLabel: 'Dashboard',
  },
  {
    id: 'messages',
    kind: 'link',
    routeName: 'messages.index',
    translationKey: 'inbox',
    fallbackLabel: 'Inbox',
  },
  {
    id: 'portfolio',
    kind: 'group',
    translationKey: 'portfolio',
    fallbackLabel: 'Portfolio',
    children: [
      {
        id: 'contact-channels',
        kind: 'link',
        routeName: 'contact-channels.index',
        translationKey: 'portfolioContactChannels',
        fallbackLabel: 'Contact channels',
      },
      {
        id: 'images',
        kind: 'link',
        routeName: 'images.index',
        translationKey: 'portfolioImages',
        fallbackLabel: 'Images',
      },
      {
        id: 'projects',
        kind: 'link',
        routeName: 'projects.index',
        translationKey: 'portfolioProjects',
        fallbackLabel: 'Projects',
      },
      {
        id: 'experiences',
        kind: 'link',
        routeName: 'experiences.index',
        translationKey: 'portfolioExperiences',
        fallbackLabel: 'Experiences',
      },
      {
        id: 'courses',
        kind: 'link',
        routeName: 'courses.index',
        translationKey: 'portfolioCourses',
        fallbackLabel: 'Courses',
      },
      {
        id: 'skills',
        kind: 'link',
        routeName: 'skills.index',
        translationKey: 'portfolioTechnologies',
        fallbackLabel: 'Skills',
      },
      {
        id: 'initiatives',
        kind: 'link',
        routeName: 'initiatives.index',
        translationKey: 'portfolioInitiatives',
        fallbackLabel: 'Initiatives',
      },
    ],
  },
  {
    id: 'website',
    kind: 'group',
    translationKey: 'website',
    fallbackLabel: 'Portfolio',
    children: [
      {
        id: 'pages',
        kind: 'link',
        routeName: 'admin.content.pages.index',
        translationKey: 'websitePages',
        fallbackLabel: 'Pages',
      },
      {
        id: 'website-settings',
        kind: 'link',
        routeName: 'website-settings.edit',
        translationKey: 'websiteSettings',
        fallbackLabel: 'Website settings',
      },
    ],
  },
] satisfies NavigationConfigNode[];
