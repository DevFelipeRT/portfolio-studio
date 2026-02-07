import { TechStackPrimarySection } from '@/Modules/Skills/ui/sections/TechStackPrimarySection';
import type { SectionComponentRegistry } from '@/Modules/ContentManagement/features/sections';

export const skillsSectionRegistryProvider = {
    getSectionRegistry(): SectionComponentRegistry {
        return {
            skills_primary: TechStackPrimarySection,
        };
    },
};
