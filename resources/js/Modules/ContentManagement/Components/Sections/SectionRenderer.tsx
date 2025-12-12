// resources/js/Modules/ContentManagement/Components/Sections/SectionRenderer.tsx

import {
    SECTION_COMPONENT_REGISTRY,
    type SectionComponentProps,
} from '@/Modules/ContentManagement/config/sectionComponents';
import type {
    PageSectionDto,
    TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import React, { JSX } from 'react';

export interface SectionRendererProps {
    sections: PageSectionDto[];
    templates?: TemplateDefinitionDto[];
}

/**
 * Renders a list of page sections, using template-specific components when available
 * and falling back to a generic template-based renderer otherwise.
 */
export function SectionRenderer({
    sections,
    templates,
}: SectionRendererProps): JSX.Element | null {
    if (!sections.length) {
        return null;
    }

    return (
        <>
            {sections.map((section) => {
                const template = findTemplateDefinition(
                    templates,
                    section.template_key,
                );

                const Component = resolveTemplateComponent(section.template_key);

                if (!Component && !template) {
                    return null;
                }

                const content = Component ? (
                    <Component section={section} template={template} />
                ) : (
                    renderGenericTemplateSection(section, template)
                );

                if (!content) {
                    return null;
                }

                return (
                    <section
                        key={section.id}
                        id={section.anchor ?? undefined}
                        className="py-12"
                    >
                        {content}
                    </section>
                );
            })}
        </>
    );
}

function findTemplateDefinition(
    templates: TemplateDefinitionDto[] | undefined,
    template_key: string,
): TemplateDefinitionDto | undefined {
    if (!templates || !templates.length) {
        return undefined;
    }

    return templates.find((template) => template.key === template_key);
}

function resolveTemplateComponent(
    template_key: string,
): React.ComponentType<SectionComponentProps> | null {
    return SECTION_COMPONENT_REGISTRY[template_key] ?? null;
}

function renderGenericTemplateSection(
    section: PageSectionDto,
    template: TemplateDefinitionDto | undefined,
): JSX.Element | null {
    if (!template) {
        return null;
    }

    const fields = template.fields ?? [];

    const renderedFields = fields
        .map((field) => {
            const value = section.data
                ? (section.data as Record<string, unknown>)[field.name]
                : undefined;

            if (value === null || value === undefined || value === '') {
                return null;
            }

            return (
                <div key={field.name} className="mb-4">
                    <div className="text-muted-foreground text-sm font-medium">
                        {field.label}
                    </div>
                    <div className="text-base">{String(value)}</div>
                </div>
            );
        })
        .filter(Boolean);

    if (!renderedFields.length) {
        return null;
    }

    return (
        <div className="container mx-auto">
            {template.label && (
                <h2 className="mb-6 text-2xl font-semibold">
                    {template.label}
                </h2>
            )}
            {renderedFields}
        </div>
    );
}
