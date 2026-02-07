import { coursesSectionRegistryProvider } from '@/Modules/Courses/sectionRegistryProvider';
import { contactChannelsSectionRegistryProvider } from '@/Modules/ContactChannels/sectionRegistryProvider';
import { contentManagementSectionRegistryProvider } from '@/Modules/ContentManagement/features/page-rendering/registry/sectionRegistryProvider';
import { experiencesSectionRegistryProvider } from '@/Modules/Experiences/sectionRegistryProvider';
import { initiativesSectionRegistryProvider } from '@/Modules/Initiatives/sectionRegistryProvider';
import { projectsSectionRegistryProvider } from '@/Modules/Projects/sectionRegistryProvider';
import { skillsSectionRegistryProvider } from '@/Modules/Skills/sectionRegistryProvider';

export const sectionRegistryProviders = [
    contentManagementSectionRegistryProvider,
    contactChannelsSectionRegistryProvider,
    projectsSectionRegistryProvider,
    initiativesSectionRegistryProvider,
    coursesSectionRegistryProvider,
    experiencesSectionRegistryProvider,
    skillsSectionRegistryProvider,
];
