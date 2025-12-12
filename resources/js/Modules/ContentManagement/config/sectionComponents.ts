// resources/js/Modules/ContentManagement/Config/sectionComponents.ts

import { HeroPrimarySection } from '@/Modules/ContentManagement/Components/Sections/HeroPrimarySection';
import { ProjectHighlightListSection } from '@/Modules/ContentManagement/Components/Sections/ProjectHighlightListSection';
import { RichTextSection } from '@/Modules/ContentManagement/Components/Sections/RichTextSection';
import type {
    PageSectionDto,
    TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import React from 'react';

export interface SectionComponentProps {
    section: PageSectionDto;
    template?: TemplateDefinitionDto;
}

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
};
