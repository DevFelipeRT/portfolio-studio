import { CoursesHighlightGridSection } from '@/modules/courses/ui/sections/CoursesHighlightGridSection';
import type { SectionComponentRegistry } from '@/modules/content-management/features/page-rendering';

export const coursesSectionRegistryProvider = {
    getSectionRegistry(): SectionComponentRegistry {
        return {
            courses_highlight_grid: CoursesHighlightGridSection,
        };
    },
};
