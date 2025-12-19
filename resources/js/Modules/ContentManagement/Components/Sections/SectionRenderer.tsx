// resources/js/Modules/ContentManagement/Components/Sections/SectionRenderer.tsx

import {
    SECTION_COMPONENT_REGISTRY,
    type SectionComponentProps,
} from '@/Modules/ContentManagement/config/sectionComponents';
import { SectionFieldResolverProvider } from '@/Modules/ContentManagement/context/SectionFieldResolverContext';
import type {
    PageSectionDto,
    TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import {
    createSectionFieldResolver,
    type SectionFieldResolver,
} from '@/Modules/ContentManagement/utils/sectionFieldResolver';
import React, { JSX } from 'react';

export interface SectionRendererProps {
    sections: PageSectionDto[];
    templates?: TemplateDefinitionDto[];
}

/**
 * Renders a list of page sections, using template-specific components when available
 * and falling back to a generic template-based renderer otherwise.
 *
 * Each rendered section receives a field resolver through context so that
 * components can read CMS values with the correct precedence between
 * persisted section data and template defaults.
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

                const Component = resolveTemplateComponent(
                    section.template_key,
                );

                // If there is no specialized component and no template definition,
                // there is nothing to render for this section.
                if (!Component && !template) {
                    return null;
                }

                // Field resolver for this specific section and template.
                const fieldResolver = createSectionFieldResolver(
                    section.data ?? null,
                    template,
                );

                const content = Component ? (
                    <Component section={section} template={template} />
                ) : (
                    renderGenericTemplateSection(
                        section,
                        template,
                        fieldResolver,
                    )
                );

                if (!content) {
                    return null;
                }

                return (
                    <SectionFieldResolverProvider
                        key={section.id}
                        resolver={fieldResolver}
                    >
                        <section
                            id={section.anchor ?? undefined}
                            className="py-12"
                        >
                            {content}
                        </section>
                    </SectionFieldResolverProvider>
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
    fieldResolver: SectionFieldResolver,
): JSX.Element | null {
    if (!template) {
        return null;
    }

    const fields = template.fields ?? [];

    const renderedFields = fields
        .map((field) => {
            const value = fieldResolver.getValue<unknown>(field.name);

            if (
                value === null ||
                value === undefined ||
                (typeof value === 'string' && value === '')
            ) {
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
