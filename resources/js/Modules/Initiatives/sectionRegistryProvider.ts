import { InitiativeHighlightListSection } from '@/Modules/Initiatives/ui/sections/InitiativeHighlightListSection';
import type { SectionComponentRegistry } from '@/Modules/ContentManagement/core/sections/sectionRegistry';

export const initiativesSectionRegistryProvider = {
    getSectionRegistry(): SectionComponentRegistry {
        return {
            initiative_highlight_list: InitiativeHighlightListSection,
        };
    },
};
