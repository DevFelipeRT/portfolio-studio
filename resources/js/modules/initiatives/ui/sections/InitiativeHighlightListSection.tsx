import {
    SectionHeader,
    type SectionComponentProps,
    useFieldValueResolver,
} from '@/modules/content-management/features/page-rendering';
import type { SectionDataValue } from '@/modules/content-management/types';
import { JSX } from 'react';

type CapabilityInitiative = {
    id: number;
    name: string;
    summary?: string | null;
    description?: string | null;
    display?: boolean;
    start_date?: string | null;
    end_date?: string | null;
};

/**
 * Renders an initiative highlight list section for a content-managed page.
 *
 * Primary source for all content is the section field resolver.
 */
export function InitiativeHighlightListSection({
    section: renderModel,
    className,
}: SectionComponentProps): JSX.Element | null {
    const fieldResolver = useFieldValueResolver();

    const targetId = renderModel.anchor || `initiatives-${renderModel.id}`;

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
            return 'Iniciativas em destaque';
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

    if (!eyebrow && !title && !description && limitedInitiatives.length === 0) {
        return null;
    }

    const baseSectionClassName = 'mx-auto space-y-8';

    const resolvedSectionClassName = [baseSectionClassName, className]
        .filter(Boolean)
        .join(' ')
        .trim();

    return (
        <section id={targetId} className={resolvedSectionClassName}>
            <SectionHeader
                eyebrow={eyebrow}
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
                            initiative.summary ??
                            initiative.description ??
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
        </section>
    );
}
