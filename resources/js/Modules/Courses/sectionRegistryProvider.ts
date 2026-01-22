import { CoursesHighlightGridSection } from '@/Modules/Courses/ui/sections/CoursesHighlightGridSection';
import type { SectionComponentRegistry } from '@/Modules/ContentManagement/core/sections/sectionRegistry';

export const coursesSectionRegistryProvider = {
    getSectionRegistry(): SectionComponentRegistry {
        return {
            courses_highlight_grid: CoursesHighlightGridSection,
        };
    },
};
