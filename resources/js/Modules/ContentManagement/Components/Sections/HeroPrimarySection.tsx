// resources/js/Modules/ContentManagement/Components/Sections/HeroPrimarySection.tsx
import { Button } from '@/Components/Ui/button';
import { SectionHeader } from '@/Layouts/Partials/SectionHeader';
import type { SectionComponentProps } from '@/Modules/ContentManagement/config/sectionComponents';
import type { SectionData } from '@/Modules/ContentManagement/types';
import { JSX } from 'react';

/**
 * Renders the primary hero section for a content-managed page.
 */
export function HeroPrimarySection({
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
        getString('headline') ??
        getString('title') ??
        getString('heading') ??
        undefined;

    const description =
        getString('subheadline') ?? getString('description') ?? undefined;

    const title = rawTitle ?? template?.label ?? '';

    const primaryCtaLabel =
        getString('primary_cta_label') ?? getString('primaryCtaLabel');
    const primaryCtaUrl =
        getString('primary_cta_url') ?? getString('primaryCtaUrl');

    if (!title && !description && !primaryCtaLabel) {
        return null;
    }

    return (
        <div className="py-12 md:py-20 lg:py-24">
            <div className="container mx-auto">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    {/* Text column */}
                    <div className="space-y-8">
                        <SectionHeader
                            eyebrow={eyebrow}
                            title={title}
                            description={description}
                            align="left"
                            level={1}
                        />

                        {primaryCtaLabel && primaryCtaUrl && (
                            <div className="flex flex-wrap items-center gap-4">
                                <Button size="lg" asChild>
                                    <a href={primaryCtaUrl}>
                                        {primaryCtaLabel}
                                    </a>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Image / visual column */}
                    <div className="relative" aria-hidden="true">
                        <div className="bg-muted relative h-48 w-full overflow-hidden rounded-2xl border md:h-64 lg:h-72" />
                    </div>
                </div>
            </div>
        </div>
    );
}
