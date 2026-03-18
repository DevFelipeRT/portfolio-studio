import {
    SectionHeader,
    useFieldValueResolver,
} from '@/modules/content-management/features/page-rendering';
import type { SectionDataValue } from '@/modules/content-management/types';
import {
    INITIATIVES_NAMESPACES,
    useInitiativesTranslation,
} from '@/modules/initiatives/i18n';
import { InitiativeCarousel } from '@/modules/initiatives/ui/InitiativeCarousel';
import type { InitiativeCarouselImage } from '@/modules/initiatives/ui/InitiativeImageCarousel';
import { JSX } from 'react';

type CapabilityInitiative = {
    id: number;
    name: string;
    summary?: string | null;
    description?: string | null;
    display?: boolean;
    start_date?: string | null;
    end_date?: string | null;
    images?: InitiativeCarouselImage[] | null;
};

/**
 * Renders an initiative highlight list section for a content-managed page.
 *
 * Primary source for all content is the section field resolver.
 */
export function InitiativeHighlightListSection(): JSX.Element | null {
    const { translate: tForm } = useInitiativesTranslation(INITIATIVES_NAMESPACES.form);
    const fieldResolver = useFieldValueResolver();

    const highlightOnly =
        fieldResolver.getFieldValue<boolean>('highlight_only') ??
        fieldResolver.getFieldValue<boolean>('highlightOnly') ??
        undefined;

    const eyebrow = (() => {
        const fromData = fieldResolver.getFieldValue<string>('eyebrow');

        if (fromData) {
            return fromData;
        }

        if (highlightOnly === true) {
            return tForm('card.highlightEyebrow');
        }

        return undefined;
    })();

    const title = fieldResolver.getFieldValue<string>('title') ?? '';

    const description =
        fieldResolver.getFieldValue<string>('subtitle') ??
        fieldResolver.getFieldValue<string>('description') ??
        undefined;

    const maxItems =
        fieldResolver.getFieldValue<number>('max_items') ??
        fieldResolver.getFieldValue<number>('maxItems') ??
        undefined;

    const rawInitiatives =
        fieldResolver.getFieldValue<SectionDataValue>('initiatives');

    const initiativesArray = Array.isArray(rawInitiatives)
        ? rawInitiatives
        : [];

    const allInitiatives: CapabilityInitiative[] = initiativesArray
        .filter(
            (item) =>
                item !== null &&
                typeof item === 'object' &&
                !Array.isArray(item),
        )
        .map((item) => item as CapabilityInitiative);

    const limitedInitiatives: CapabilityInitiative[] =
        typeof maxItems === 'number' && maxItems > 0
            ? allInitiatives.slice(0, maxItems)
            : allInitiatives;

    const hasInitiatives = limitedInitiatives.length > 0;

    if (!eyebrow && !title && !description && !hasInitiatives) {
        return null;
    }

    const ariaLabel = title || description || undefined;

    return (
        <div className="flex flex-col gap-8" aria-label={ariaLabel}>
            <SectionHeader
                eyebrow={eyebrow}
                title={title}
                description={description}
                align="left"
                level={2}
            />

            {hasInitiatives ? (
                <InitiativeCarousel
                    initiatives={limitedInitiatives.map((initiative) => ({
                        id: initiative.id,
                        name: initiative.name,
                        summary: initiative.summary ?? null,
                        description: initiative.description ?? null,
                        start_date: initiative.start_date ?? null,
                        end_date: initiative.end_date ?? null,
                        images: initiative.images,
                    }))}
                />
            ) : (
                <p className="text-muted-foreground text-sm">
                    {tForm('emptyState.publicSection')}
                </p>
            )}
        </div>
    );
}
