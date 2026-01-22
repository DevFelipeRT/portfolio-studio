import { Button } from '@/Components/Ui/button';
import { SectionHeader } from '@/Layouts/Partials/SectionHeader';
import type { SectionComponentProps } from '@/Modules/ContentManagement/ui/sections/sectionRegistry';
import { useSectionFieldResolver } from '@/Modules/ContentManagement/hooks/useSectionFieldResolver';
import type {
    SectionDataValue,
    SectionImage,
} from '@/Modules/ContentManagement/core/types';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { JSX } from 'react';

/**
 * Renders the primary hero section for a content-managed page.
 */
export function HeroPrimarySection({
    section,
    className,
}: SectionComponentProps): JSX.Element | null {
    const fieldResolver = useSectionFieldResolver();

    const targetId = section.anchor || `hero-${section.id}`;

    const baseClassName = 'lg:py-28';

    const resolvedClassName =
        [baseClassName, className].filter(Boolean).join(' ').trim() ||
        undefined;

    const rawHeroImage = fieldResolver.getValue<SectionDataValue>('hero_image');

    const heroImage: SectionImage | null = Array.isArray(rawHeroImage)
        ? ((rawHeroImage[0] as SectionImage | undefined) ?? null)
        : ((rawHeroImage as SectionImage | null | undefined) ?? null);

    const eyebrow = fieldResolver.getValue<string>('eyebrow');

    const title =
        fieldResolver.getValue<string>('headline') ??
        fieldResolver.getValue<string>('title') ??
        fieldResolver.getValue<string>('heading') ??
        '';

    const description =
        fieldResolver.getValue<string>('subheadline') ??
        fieldResolver.getValue<string>('description') ??
        undefined;

    const primaryCtaLabel =
        fieldResolver.getValue<string>('primary_cta_label') ??
        fieldResolver.getValue<string>('primaryCtaLabel');

    const primaryCtaUrl =
        fieldResolver.getValue<string>('primary_cta_url') ??
        fieldResolver.getValue<string>('primaryCtaUrl');

    if (!title && !description && !primaryCtaLabel) {
        return null;
    }

    return (
        <section id={targetId} className={resolvedClassName}>
            <div className="mx-auto">
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
                        {heroImage ? (
                            <div className="relative w-full overflow-hidden rounded-2xl border">
                                <AspectRatio ratio={4 / 3}>
                                    <img
                                        src={heroImage.url}
                                        alt={
                                            heroImage.alt ??
                                            heroImage.title ??
                                            ''
                                        }
                                        className="h-full w-full object-cover"
                                    />
                                </AspectRatio>
                                <div className="from-background/60 via-background/20 pointer-events-none absolute inset-0 bg-gradient-to-tr to-transparent" />
                            </div>
                        ) : (
                            <div className="bg-muted relative h-48 w-full overflow-hidden rounded-2xl border md:h-64 lg:h-72" />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
