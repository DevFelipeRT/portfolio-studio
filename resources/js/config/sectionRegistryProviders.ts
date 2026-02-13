import { coursesSectionRegistryProvider } from '@/modules/courses/sectionRegistryProvider';
import { contactChannelsSectionRegistryProvider } from '@/modules/contact-channels/sectionRegistryProvider';
import { contentManagementSectionRegistryProvider } from '@/modules/content-management/features/page-rendering/template/registry/componentRegistryProvider';
import { experiencesSectionRegistryProvider } from '@/modules/experiences/sectionRegistryProvider';
import { initiativesSectionRegistryProvider } from '@/modules/initiatives/sectionRegistryProvider';
import { projectsSectionRegistryProvider } from '@/modules/projects/sectionRegistryProvider';
import { skillsSectionRegistryProvider } from '@/modules/skills/sectionRegistryProvider';

export const sectionRegistryProviders = [
    contentManagementSectionRegistryProvider,
    contactChannelsSectionRegistryProvider,
    projectsSectionRegistryProvider,
    initiativesSectionRegistryProvider,
    coursesSectionRegistryProvider,
    experiencesSectionRegistryProvider,
    skillsSectionRegistryProvider,
];
