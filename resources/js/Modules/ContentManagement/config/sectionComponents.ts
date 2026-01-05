// resources/js/Modules/ContentManagement/Config/sectionComponents.ts

import { CardsGridSection } from '@/Modules/ContentManagement/Components/Sections/CardsGridSection';
import { HeroPrimarySection } from '@/Modules/ContentManagement/Components/Sections/HeroPrimarySection';
import { ProjectHighlightListSection } from '@/Modules/ContentManagement/Components/Sections/ProjectHighlightListSection';
import { RichTextSection } from '@/Modules/ContentManagement/Components/Sections/RichTextSection';
import type {
    PageSectionDto,
    TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import React from 'react';
import { ContactPrimarySection } from '../Components/Sections/ContactPrimarySection';
import { CoursesHighlightGridSection } from '../Components/Sections/CoursesHighlightGridSection';
import { ExperienceTimelineSection } from '../Components/Sections/ExperienceTimelineSection';
import { InitiativeHighlightListSection } from '../Components/Sections/InitiativeHighlightListSection';
import { TechStackPrimarySection } from '../Components/Sections/TechStackPrimarySection';

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
    tech_stack_primary: TechStackPrimarySection,
};
