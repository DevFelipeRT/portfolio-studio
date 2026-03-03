import { ProjectHighlightListSection } from '@/modules/projects/ui/sections/ProjectHighlightListSection';
import type { SectionComponentRegistry } from '@/modules/content-management/features/page-rendering';

export const projectsSectionRegistryProvider = {
    i18n: ['projects'],
    getSectionRegistry(): SectionComponentRegistry {
        return {
            project_highlight_list: ProjectHighlightListSection,
        };
    },
};
