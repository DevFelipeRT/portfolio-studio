import { ExperienceTimelineSection } from '@/Modules/Experiences/ui/sections/ExperienceTimelineSection';
import type { SectionComponentRegistry } from '@/Modules/ContentManagement/features/page-rendering';

export const experiencesSectionRegistryProvider = {
    getSectionRegistry(): SectionComponentRegistry {
        return {
            experience_timeline: ExperienceTimelineSection,
        };
    },
};
