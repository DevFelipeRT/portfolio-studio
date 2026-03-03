import { ExperienceTimelineSection } from '@/modules/experiences/ui/sections/ExperienceTimelineSection';
import type { SectionComponentRegistry } from '@/modules/content-management/features/page-rendering';

export const experiencesSectionRegistryProvider = {
    i18n: ['experiences'],
    getSectionRegistry(): SectionComponentRegistry {
        return {
            experience_timeline: ExperienceTimelineSection,
        };
    },
};
