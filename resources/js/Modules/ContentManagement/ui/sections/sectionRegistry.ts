// resources/js/Modules/ContentManagement/Config/sectionComponents.ts

import { CardsGridSection } from '@/Modules/ContentManagement/ui/sections/CardsGridSection';
import { HeroPrimarySection } from '@/Modules/ContentManagement/ui/sections/HeroPrimarySection';
import { ProjectHighlightListSection } from '@/Modules/ContentManagement/ui/sections/ProjectHighlightListSection';
import { RichTextSection } from '@/Modules/ContentManagement/ui/sections/RichTextSection';
import type {
    PageSectionDto,
    TemplateDefinitionDto,
} from '@/Modules/ContentManagement/core/types';
import React from 'react';
import { ContactPrimarySection } from '@/Modules/ContentManagement/ui/sections/ContactPrimarySection';
import { CoursesHighlightGridSection } from '@/Modules/ContentManagement/ui/sections/CoursesHighlightGridSection';
import { ExperienceTimelineSection } from '@/Modules/ContentManagement/ui/sections/ExperienceTimelineSection';
import { InitiativeHighlightListSection } from '@/Modules/ContentManagement/ui/sections/InitiativeHighlightListSection';
import { TechStackPrimarySection } from '@/Modules/ContentManagement/ui/sections/TechStackPrimarySection';

export type SectionComponentProps = {
    section: PageSectionDto;
    template?: TemplateDefinitionDto;
    anchorId?: string;
    className?: string;
};

/**
 * Registry that maps template keys to specialized section components.
 */
export const SECTION_COMPONENT_REGISTRY: Record<
    string,
    React.ComponentType<SectionComponentProps>
> = {
    hero_primary: HeroPrimarySection,
    rich_text: RichTextSection,
    project_highlight_list: ProjectHighlightListSection,
    cards_grid_primary: CardsGridSection,
    initiative_highlight_list: InitiativeHighlightListSection,
    experience_timeline: ExperienceTimelineSection,
    courses_highlight_grid: CoursesHighlightGridSection,
    contact_primary: ContactPrimarySection,
    skills_primary: TechStackPrimarySection,
};
