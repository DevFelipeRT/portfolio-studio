import type {
  PageSectionDto,
  TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import { sectionRegistryProviders } from '@/config/sectionRegistryProviders';
import { JSX } from 'react';
import { SectionFieldResolverProvider } from '../../runtime/sectionFieldResolverProvider';
import { buildComponentRegistry } from '../../template/registry/componentRegistry';
import { createSectionFieldResolver } from '../sectionFieldResolver';
import { findTemplateDefinition } from './findTemplateDefinition';
import { renderGenericTemplateSection } from './renderGenericTemplateSection';
import { resolveTemplateComponent } from './resolveTemplateComponent';
import { toSectionRenderModel } from './toSectionRenderModel';

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

  const componentRegistry = buildComponentRegistry({}, sectionRegistryProviders);

  return (
    <>
      {sections.map((section) => {
        const sectionModel = toSectionRenderModel(section);

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

        const fieldResolver = createSectionFieldResolver(
          section.data ?? null,
          template,
        );

        const baseSectionClassName = 'm-0 border-b py-8 md:py-12 lg:py-16';
        const resolvedSectionClassName =
          [baseSectionClassName, sectionClassName]
            .filter(Boolean)
            .join(' ')
            .trim() || undefined;

        const content = Component ? (
          <Component
            section={sectionModel}
            template={template}
            className={resolvedSectionClassName}
          />
        ) : (
          renderGenericTemplateSection(
            sectionModel,
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
