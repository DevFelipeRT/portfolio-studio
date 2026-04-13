import type { SectionComponentRegistry } from '@/modules/content-management/features/page-rendering';
import { ProjectHighlightListSection } from '@/modules/projects/public/sections/ProjectHighlightListSection';

export const projectsSectionRegistryProvider = {
  i18n: ['projects'],
  getSectionRegistry(): SectionComponentRegistry {
    return {
      project_highlight_list: ProjectHighlightListSection,
    };
  },
};
