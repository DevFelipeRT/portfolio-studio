// resources/js/Modules/ContentManagement/Components/SectionRenderer.tsx

import {
    SECTION_COMPONENT_REGISTRY,
    type SectionComponentProps,
} from '@/Modules/ContentManagement/features/sections/registry/sectionRegistry';
import { SectionFieldResolverProvider } from '@/Modules/ContentManagement/features/sections/runtime/useSectionFieldResolver';
import type {
    PageSectionDto,
    TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import {
    createSectionFieldResolver,
    type SectionFieldResolver,
} from '@/Modules/ContentManagement/features/sections/lib/sectionFieldResolver';
import React, { JSX } from 'react';

export interface SectionRendererProps {
    sections: PageSectionDto[];
    templates?: TemplateDefinitionDto[];
    /**
     * Optional base class names applied to all rendered sections.
     * Components can merge this value with their own internal classes.
     */
    sectionClassName?: string;
}

/**
 * Renders a list of page sections, using template-specific components when available
 * and falling back to a generic template-based renderer otherwise.
 *
 * Each rendered section receives a field resolver through context so that
 * components can read CMS values with the correct precedence between
 * persisted section data and template defaults.
 *
 * Layout-related metadata (anchor id and class names) is passed down
 * to section components instead of wrapping them with an extra <section>.
 */
export function SectionRenderer({
    sections,
    templates,
    sectionClassName,
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

                if (!Component && !template) {
                    return null;
                }

                const fieldResolver = createSectionFieldResolver(
                    section.data ?? null,
                    template,
                );

                const baseSectionClassName =
                    'm-0 border-b py-8 md:py-12 lg:py-16';
                const resolvedSectionClassName =
                    [baseSectionClassName, sectionClassName]
                        .filter(Boolean)
                        .join(' ')
                        .trim() || undefined;

                const content = Component ? (
                    <Component
                        section={section}
                        template={template}
                        className={resolvedSectionClassName}
                    />
                ) : (
                    renderGenericTemplateSection(
                        section,
                        template,
                        fieldResolver,
                        resolvedSectionClassName,
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
                        {content}
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
    className?: string,
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

    const sectionId = section.anchor ?? undefined;

    const baseSectionClassName = 'm-0';
    const resolvedSectionClassName =
        [baseSectionClassName, className].filter(Boolean).join(' ').trim() ||
        undefined;

    return (
        <section id={sectionId} className={resolvedSectionClassName}>
            <div className="container mx-auto">
                {template.label && (
                    <h2 className="mb-6 text-2xl font-semibold">
                        {template.label}
                    </h2>
                )}
                {template.description && (
                    <p className="text-muted-foreground mb-6 text-sm">
                        {template.description}
                    </p>
                )}
                {renderedFields}
            </div>
        </section>
    );
}
