import { ProjectHighlightListSection } from '@/Modules/Projects/ui/sections/ProjectHighlightListSection';
import type { SectionComponentRegistry } from '@/Modules/ContentManagement/features/sections';

export const projectsSectionRegistryProvider = {
    getSectionRegistry(): SectionComponentRegistry {
        return {
            project_highlight_list: ProjectHighlightListSection,
        };
    },
};
