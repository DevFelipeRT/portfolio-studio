import { CardsGridSection } from '@/Modules/ContentManagement/ui/sections/CardsGridSection';
import { HeroPrimarySection } from '@/Modules/ContentManagement/ui/sections/HeroPrimarySection';
import { RichTextSection } from '@/Modules/ContentManagement/ui/sections/RichTextSection';
import type { SectionComponentRegistry } from '@/Modules/ContentManagement/core/sections/sectionRegistry';

export const contentManagementSectionRegistryProvider = {
    getSectionRegistry(): SectionComponentRegistry {
        return {
            hero_primary: HeroPrimarySection,
            rich_text: RichTextSection,
            cards_grid_primary: CardsGridSection,
        };
    },
};
