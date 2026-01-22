import { TechStackPrimarySection } from '@/Modules/Skills/ui/sections/TechStackPrimarySection';
import type { SectionComponentRegistry } from '@/Modules/ContentManagement/core/sections/sectionRegistry';

export const skillsSectionRegistryProvider = {
    getSectionRegistry(): SectionComponentRegistry {
        return {
            skills_primary: TechStackPrimarySection,
        };
    },
};
