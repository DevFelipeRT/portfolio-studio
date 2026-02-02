// resources/js/config/navigation.ts

import type { NavigationConfigNode } from '@/Navigation/configTypes';

export const navigationConfig = [
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
        id: 'contact-channels',
        kind: 'link',
        routeName: 'contact-channels.index',
        translationKey: 'header.navigation.portfolioContactChannels',
        fallbackLabel: 'Contact channels',
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
        id: 'initiatives',
        kind: 'link',
        routeName: 'initiatives.index',
        translationKey: 'header.navigation.portfolioInitiatives',
        fallbackLabel: 'Initiatives',
      },
    ],
  },
  {
    id: 'website',
    kind: 'group',
    translationKey: 'header.navigation.website',
    fallbackLabel: 'Portfolio',
    children: [
      {
        id: 'pages',
        kind: 'link',
        routeName: 'admin.content.pages.index',
        translationKey: 'header.navigation.websitePages',
        fallbackLabel: 'Pages',
      },
      {
        id: 'website-settings',
        kind: 'link',
        routeName: 'website-settings.edit',
        translationKey: 'header.navigation.websiteSettings',
        fallbackLabel: 'Website settings',
      },
    ],
  },
] satisfies NavigationConfigNode[];
