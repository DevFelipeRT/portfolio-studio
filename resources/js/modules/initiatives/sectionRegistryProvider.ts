import { InitiativeHighlightListSection } from '@/modules/initiatives/ui/sections/InitiativeHighlightListSection';
import type { SectionComponentRegistry } from '@/modules/content-management/features/page-rendering';

export const initiativesSectionRegistryProvider = {
    i18n: ['initiatives'],
    getSectionRegistry(): SectionComponentRegistry {
        return {
            initiative_highlight_list: InitiativeHighlightListSection,
        };
    },
};
