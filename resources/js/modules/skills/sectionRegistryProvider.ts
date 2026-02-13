import { TechStackPrimarySection } from '@/modules/skills/ui/sections/TechStackPrimarySection';
import type { SectionComponentRegistry } from '@/modules/content-management/features/page-rendering';

export const skillsSectionRegistryProvider = {
    getSectionRegistry(): SectionComponentRegistry {
        return {
            skills_primary: TechStackPrimarySection,
        };
    },
};
