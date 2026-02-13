import { RichTextRenderer } from '@/common/rich-text/RichTextRenderer';
import { JSX } from 'react';
import { useFieldValueResolver } from '../../rendering/section-renderer/field-value/useFieldValueResolver';
import { SectionComponentProps } from '../../types';
import { SectionHeader } from './partials/SectionHeader';

/**
 * Renders a rich text content section for a content-managed page.
 */
export function RichTextSection({
  section: renderModel,
  className,
}: SectionComponentProps): JSX.Element | null {
  const fieldResolver = useFieldValueResolver();

  const targetId = renderModel.anchor || `rich-text-${renderModel.id}`;

  const eyebrow = fieldResolver.getFieldValue<string>('eyebrow');

  const title =
    fieldResolver.getFieldValue<string>('title') ??
    fieldResolver.getFieldValue<string>('headline') ??
    fieldResolver.getFieldValue<string>('heading') ??
    '';

  const description =
    fieldResolver.getFieldValue<string>('subtitle') ??
    fieldResolver.getFieldValue<string>('description') ??
    undefined;

  const content =
    fieldResolver.getFieldValue<string>('content') ??
    fieldResolver.getFieldValue<string>('body') ??
    fieldResolver.getFieldValue<string>('text') ??
    undefined;

  if (!title && !description && !content) {
    return null;
  }

  const baseSectionClassName = 'py-12 md:py-16';
  const resolvedSectionClassName = [baseSectionClassName, className]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <section id={targetId} className={resolvedSectionClassName}>
      <div className="container mx-auto">
        <div className="space-y-6">
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            align="left"
            level={2}
          />

          {content && <RichTextRenderer value={content} />}
        </div>
      </div>
    </section>
  );
}
