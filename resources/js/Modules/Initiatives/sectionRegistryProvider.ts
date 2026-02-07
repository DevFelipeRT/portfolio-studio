import { InitiativeHighlightListSection } from '@/Modules/Initiatives/ui/sections/InitiativeHighlightListSection';
import type { SectionComponentRegistry } from '@/Modules/ContentManagement/features/sections';

export const initiativesSectionRegistryProvider = {
    getSectionRegistry(): SectionComponentRegistry {
        return {
            initiative_highlight_list: InitiativeHighlightListSection,
        };
    },
};
