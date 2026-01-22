import { SectionHeader } from '@/Layouts/Partials/SectionHeader';
import type { SectionComponentProps } from '@/Modules/ContentManagement/ui/sections/sectionRegistry';
import { useSectionFieldResolver } from '@/Modules/ContentManagement/hooks/useSectionFieldResolver';
import { JSX } from 'react';

/**
 * Renders a rich text content section for a content-managed page.
 */
export function RichTextSection({
    section,
    className,
}: SectionComponentProps): JSX.Element | null {
    const fieldResolver = useSectionFieldResolver();

    const targetId = section.anchor || `rich-text-${section.id}`;

    const eyebrow = fieldResolver.getValue<string>('eyebrow');

    const title =
        fieldResolver.getValue<string>('title') ??
        fieldResolver.getValue<string>('headline') ??
        fieldResolver.getValue<string>('heading') ??
        '';

    const description =
        fieldResolver.getValue<string>('subtitle') ??
        fieldResolver.getValue<string>('description') ??
        undefined;

    const content =
        fieldResolver.getValue<string>('content') ??
        fieldResolver.getValue<string>('body') ??
        fieldResolver.getValue<string>('text') ??
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

                    {content && (
                        <div className="text-muted-foreground text-base leading-relaxed whitespace-pre-line">
                            {content}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
