import { SectionHeader } from '@/Layouts/Partials/SectionHeader';
import type { SectionComponentProps } from '@/Modules/ContentManagement/config/sectionComponents';
import type { SectionData } from '@/Modules/ContentManagement/types';
import { JSX } from 'react';

/**
 * Renders a rich text content section for a content-managed page.
 */
export function RichTextSection({
    section,
    template,
}: SectionComponentProps): JSX.Element | null {
    const data = (section.data ?? {}) as SectionData;

    const getString = (key: string): string | undefined => {
        const value = data[key];

        if (typeof value === 'string') {
            return value;
        }

        return undefined;
    };

    const eyebrow = getString('eyebrow');

    const rawTitle =
        getString('title') ??
        getString('headline') ??
        getString('heading') ??
        undefined;

    const description =
        getString('subtitle') ?? getString('description') ?? undefined;

    const content =
        getString('content') ??
        getString('body') ??
        getString('text') ??
        undefined;

    const title = rawTitle ?? template?.label ?? '';

    if (!title && !description && !content) {
        return null;
    }

    return (
        <div className="py-12 md:py-16">
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
        </div>
    );
}
