import { mergePageRegistries } from './registryHelpers';

import { authPages } from './auth/pages';
import { contactChannelsPages } from './contact-channels/pages';
import { contentManagementPages } from './content-management/pages';
import { coursesPages } from './courses/pages';
import { dashboardPages } from './dashboard/pages';
import { experiencesPages } from './experiences/pages';
import { imagesPages } from './images/pages';
import { initiativesPages } from './initiatives/pages';
import { messagesPages } from './messages/pages';
import { profilePages } from './profile/pages';
import { projectsPages } from './projects/pages';
import { skillsPages } from './skills/pages';
import { websiteSettingsPages } from './website-settings/pages';

export const pageRegistry = mergePageRegistries(
  authPages,
  contactChannelsPages,
  contentManagementPages,
  coursesPages,
  dashboardPages,
  experiencesPages,
  imagesPages,
  initiativesPages,
  messagesPages,
  profilePages,
  projectsPages,
  skillsPages,
  websiteSettingsPages,
);

