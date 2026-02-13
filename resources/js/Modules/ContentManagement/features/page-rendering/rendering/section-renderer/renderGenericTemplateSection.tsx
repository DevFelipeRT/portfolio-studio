import type {
  TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import type { JSX } from 'react';
import type { FieldValueResolver, SectionRenderModel } from '../../types';

/**
 * Generic fallback renderer for template-driven sections.
 *
 * Uses the provided FieldValueResolver so values follow the same precedence and
 * normalization rules as component-driven sections.
 */
export function renderGenericTemplateSection(
  renderModel: SectionRenderModel,
  template: TemplateDefinitionDto | undefined,
  fieldValueResolver: FieldValueResolver,
  className?: string,
): JSX.Element | null {
  if (!template) {
    return null;
  }

  const fields = template.fields ?? [];

  const renderedFields = fields
    .map((field) => {
      const value = fieldValueResolver.getFieldValue<unknown>(field.name);

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

  const sectionId = renderModel.anchor ?? undefined;

  const baseSectionClassName = 'm-0';
  const resolvedSectionClassName =
    [baseSectionClassName, className].filter(Boolean).join(' ').trim() ||
    undefined;

  return (
    <section id={sectionId} className={resolvedSectionClassName}>
      <div className="container mx-auto">
        {template.label && (
          <h2 className="mb-6 text-2xl font-semibold">{template.label}</h2>
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
