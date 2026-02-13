import type { ComponentRegistryProvider } from '@/Modules/ContentManagement/types/provider';
import type { SectionComponentRegistry } from '../../types';
import { CardsGridSection } from '../components/CardsGridSection';
import { HeroPrimarySection } from '../components/HeroPrimarySection';
import { RichTextSection } from '../components/RichTextSection';

export const contentManagementSectionRegistryProvider: ComponentRegistryProvider<SectionComponentRegistry> =
  {
    getSectionRegistry(): SectionComponentRegistry {
      return {
        hero_primary: HeroPrimarySection,
        rich_text: RichTextSection,
        cards_grid_primary: CardsGridSection,
      };
    },
  };
