import { CardsGridSection } from '../components/CardsGridSection';
import { HeroPrimarySection } from '../components/HeroPrimarySection';
import { RichTextSection } from '../components/RichTextSection';
import type { SectionComponentRegistry } from './sectionRegistry';

export const contentManagementSectionRegistryProvider = {
    getSectionRegistry(): SectionComponentRegistry {
        return {
            hero_primary: HeroPrimarySection,
            rich_text: RichTextSection,
            cards_grid_primary: CardsGridSection,
        };
    },
};
