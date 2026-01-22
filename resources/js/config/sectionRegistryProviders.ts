import { coursesSectionRegistryProvider } from '@/Modules/Courses/sectionRegistryProvider';
import { contentManagementSectionRegistryProvider } from '@/Modules/ContentManagement/sectionRegistryProvider';
import { experiencesSectionRegistryProvider } from '@/Modules/Experiences/sectionRegistryProvider';
import { initiativesSectionRegistryProvider } from '@/Modules/Initiatives/sectionRegistryProvider';
import { projectsSectionRegistryProvider } from '@/Modules/Projects/sectionRegistryProvider';
import { skillsSectionRegistryProvider } from '@/Modules/Skills/sectionRegistryProvider';

export const sectionRegistryProviders = [
    contentManagementSectionRegistryProvider,
    projectsSectionRegistryProvider,
    initiativesSectionRegistryProvider,
    coursesSectionRegistryProvider,
    experiencesSectionRegistryProvider,
    skillsSectionRegistryProvider,
];
