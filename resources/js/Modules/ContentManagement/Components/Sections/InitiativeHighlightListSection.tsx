import { SectionHeader } from '@/Layouts/Partials/SectionHeader';
import type { SectionComponentProps } from '@/Modules/ContentManagement/config/sectionComponents';
import type { SectionData } from '@/Modules/ContentManagement/types';
import { JSX } from 'react';

type CapabilityInitiativeImage = {
    id: number;
    url: string;
    alt?: string | null;
    title?: string | null;
    caption?: string | null;
    position?: number | null;
    is_cover: boolean;
    owner_caption?: string | null;
};

type CapabilityInitiative = {
    id: number;
    name: string;
    short_description?: string | null;
    long_description?: string | null;
    display?: boolean;
    start_date?: string | null;
    end_date?: string | null;
    images?: CapabilityInitiativeImage[] | unknown;
};

/**
 * Renders an initiative highlight list section for a content-managed page.
 *
 * Primary source for all content is the section data, with template
 * metadata used as a fallback when applicable.
 */
export function InitiativeHighlightListSection({
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

    const getNumber = (key: string): number | undefined => {
        const value = data[key];

        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }

        return undefined;
    };

    const getBoolean = (key: string): boolean | undefined => {
        const value = data[key];

        if (typeof value === 'boolean') {
            return value;
        }

        return undefined;
    };

    const highlightOnly =
        getBoolean('highlight_only') ??
        getBoolean('highlightOnly') ??
        undefined;

    const eyebrow = (): string | undefined => {
        const fromData = getString('eyebrow');

        if (fromData) {
            return fromData;
        }

        if (highlightOnly === true) {
            return 'Iniciativas em destaque';
        }

        return undefined;
    };

    const titleFromData = getString('title');
    const titleFallbackFromTemplate = template?.label;
    const title = titleFromData ?? titleFallbackFromTemplate ?? '';

    const descriptionFromData =
        getString('subtitle') ?? getString('description');
    const descriptionFallbackFromTemplate = template?.description ?? undefined;
    const description = descriptionFromData ?? descriptionFallbackFromTemplate;

    const maxItems =
        getNumber('max_items') ?? getNumber('maxItems') ?? undefined;

    const rawInitiatives = data['initiatives'] as unknown;

    const allInitiatives: CapabilityInitiative[] = Array.isArray(rawInitiatives)
        ? rawInitiatives.filter(
              (item): item is CapabilityInitiative =>
                  item !== null && typeof item === 'object',
          )
        : [];

    const limitedInitiatives: CapabilityInitiative[] =
        typeof maxItems === 'number' && maxItems > 0
            ? allInitiatives.slice(0, maxItems)
            : allInitiatives;

    const headerEyebrow = eyebrow();

    if (
        !headerEyebrow &&
        !title &&
        !description &&
        limitedInitiatives.length === 0
    ) {
        return null;
    }

    return (
        <section className="border-t py-12 md:py-16">
            <div className="container mx-auto">
                <div className="space-y-8">
                    <SectionHeader
                        eyebrow={headerEyebrow}
                        title={title}
                        description={description}
                        align="left"
                        level={2}
                    />

                    {limitedInitiatives.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {limitedInitiatives.map((initiative) => {
                                const name = initiative.name;
                                const shortDescription =
                                    initiative.short_description ??
                                    initiative.long_description ??
                                    null;
                                const startDate = initiative.start_date ?? null;
                                const endDate = initiative.end_date ?? null;

                                return (
                                    <article
                                        key={initiative.id}
                                        className="bg-card text-card-foreground flex h-full flex-col rounded-2xl border p-6 shadow-sm"
                                    >
                                        <div className="space-y-2">
                                            <h3 className="text-base leading-tight font-semibold tracking-tight">
                                                {name}
                                            </h3>

                                            {shortDescription && (
                                                <p className="text-muted-foreground text-sm leading-relaxed">
                                                    {shortDescription}
                                                </p>
                                            )}

                                            {(startDate || endDate) && (
                                                <p className="text-muted-foreground text-xs">
                                                    {startDate && endDate
                                                        ? `${startDate} – ${endDate}`
                                                        : startDate
                                                          ? startDate
                                                          : endDate}
                                                </p>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            Nenhuma iniciativa retornada para esta seção.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
