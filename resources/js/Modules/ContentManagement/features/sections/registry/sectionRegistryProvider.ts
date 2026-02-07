import { CardsGridSection } from '@/Modules/ContentManagement/features/sections/ui/components/CardsGridSection';
import { HeroPrimarySection } from '@/Modules/ContentManagement/features/sections/ui/components/HeroPrimarySection';
import { RichTextSection } from '@/Modules/ContentManagement/features/sections/ui/components/RichTextSection';
import type { SectionComponentRegistry } from '@/Modules/ContentManagement/features/sections/registry/sectionRegistry';

export const contentManagementSectionRegistryProvider = {
    getSectionRegistry(): SectionComponentRegistry {
        return {
            hero_primary: HeroPrimarySection,
            rich_text: RichTextSection,
            cards_grid_primary: CardsGridSection,
        };
    },
};

