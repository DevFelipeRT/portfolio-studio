import type {
    PageSectionDto,
    TemplateDefinitionDto,
} from '@/Modules/ContentManagement/core/types';
import { buildSectionRegistry } from '@/Modules/ContentManagement/core/sections/sectionRegistryBuilder';
import { sectionRegistryProviders } from '@/config/sectionRegistryProviders';
import React from 'react';

export type SectionComponentProps = {
    section: PageSectionDto;
    template?: TemplateDefinitionDto;
    anchorId?: string;
    className?: string;
};

export type SectionComponentRegistry = Record<
    string,
    React.ComponentType<SectionComponentProps>
>;

export type SectionRegistryProvider = {
    getSectionRegistry(): SectionComponentRegistry;
};

/**
 * Registry that maps template keys to specialized section components.
 */
export const SECTION_COMPONENT_REGISTRY = buildSectionRegistry(
    {},
    sectionRegistryProviders,
);
