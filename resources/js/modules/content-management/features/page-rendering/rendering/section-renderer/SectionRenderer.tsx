import { sectionRegistryProviders } from '@/config/sectionRegistryProviders';
import {
  Section,
  SectionContent,
} from '@/app/layouts/primitives';
import type {
  PageSectionDto,
  TemplateDefinitionDto,
} from '@/modules/content-management/types';
import { JSX } from 'react';
import { buildComponentRegistry } from '../../template/registry/componentRegistry';
import { createFieldValueResolver } from './field-value/fieldValueResolver';
import { FieldValueResolverProvider } from './field-value/FieldValueResolverProvider';
import { renderGenericTemplateSection } from './RenderGenericTemplateSection';
import { resolveSectionLayout } from './sectionLayout';
import { buildSectionRenderModel } from './sectionRenderModel';
import { findTemplateDefinition } from './template/findTemplateDefinition';
import { resolveTemplateComponent } from './template/resolveTemplateComponent';

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
 * Each rendered section receives a field value resolver through context so that
 * components can read CMS values with the correct precedence between
 * persisted section data and template defaults.
 *
 * Layout-related metadata is resolved here so CMS sections share one
 * structural contract for bleed, spacing, borders, and horizontal containment.
 */
export function SectionRenderer({
  sections,
  templates,
  sectionClassName,
}: SectionRendererProps): JSX.Element | null {
  if (!sections.length) {
    return null;
  }

  const componentRegistry = buildComponentRegistry(
    {},
    sectionRegistryProviders,
  );

  return (
    <>
      {sections.map((section) => {
        const sectionModel = buildSectionRenderModel(section);

        const template = findTemplateDefinition(
          templates,
          sectionModel.templateKey,
        );

        const Component = resolveTemplateComponent(
          componentRegistry,
          sectionModel.templateKey,
        );

        if (!Component && !template) {
          return null;
        }

        const fieldValueResolver = createFieldValueResolver(
          section.data ?? null,
          template,
        );
        const layout = resolveSectionLayout(sectionModel.templateKey);
        const sectionId =
          sectionModel.anchor ??
          `${sectionModel.templateKey.replace(/_/g, '-')}-${sectionModel.id}`;

        const baseSectionClassName = 'm-0 border-b';
        const resolvedSectionClassName =
          [baseSectionClassName, sectionClassName]
            .filter(Boolean)
            .join(' ')
            .trim() || undefined;

        const content = Component ? (
          <Component
            section={sectionModel}
            template={template}
          />
        ) : (
          renderGenericTemplateSection(
            template,
            fieldValueResolver,
          )
        );

        if (!content) {
          return null;
        }

        return (
          <FieldValueResolverProvider
            key={section.id}
            resolver={fieldValueResolver}
          >
            <Section
              id={sectionId}
              className={resolvedSectionClassName}
              spacing={layout.spacing}
              surface={layout.surface}
              bleed={layout.bleed}
            >
              <SectionContent contentWidth={layout.contentWidth}>
                {content}
              </SectionContent>
            </Section>
          </FieldValueResolverProvider>
        );
      })}
    </>
  );
}
