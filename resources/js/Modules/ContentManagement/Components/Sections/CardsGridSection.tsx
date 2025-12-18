// resources/js/Modules/ContentManagement/Components/Sections/CardsGridSection.tsx

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/Ui/card';
import { SectionHeader } from '@/Layouts/Partials/SectionHeader';
import type { SectionComponentProps } from '@/Modules/ContentManagement/config/sectionComponents';
import type {
    SectionData,
    SectionDataCollectionItem,
    SectionDataValue,
} from '@/Modules/ContentManagement/types';
import { JSX } from 'react';

interface CardsGridItem {
    id: string;
    title: string;
    subtitle?: string;
    content?: string;
    footer?: string;
}

/**
 * Section component that renders a grid of cards based on template-driven data.
 */
export function CardsGridSection({
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

    const getBoolean = (key: string, defaultValue: boolean): boolean => {
        const value = data[key];

        if (typeof value === 'boolean') {
            return value;
        }

        return defaultValue;
    };

    const getNumber = (key: string): number | undefined => {
        const value = data[key];

        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }

        if (typeof value === 'string') {
            const parsed = Number.parseInt(value, 10);

            if (Number.isFinite(parsed)) {
                return parsed;
            }
        }

        return undefined;
    };

    const eyebrow = getString('eyebrow');

    const rawTitle = getString('title');
    const description = getString('description');

    const title = rawTitle ?? template?.label ?? '';

    const hasBorderTop = getBoolean('has_border_top', true);
    const rawColumns = getNumber('columns');
    const columns = rawColumns === 2 ? 2 : 3;

    const alignHeader =
        getString('align_header') === 'center' ? 'center' : 'left';

    const rawMaxItems = getNumber('max_items') ?? getNumber('maxItems');
    const maxItems =
        typeof rawMaxItems === 'number' && rawMaxItems > 0
            ? rawMaxItems
            : undefined;

    const rawCards: SectionDataValue | undefined = data.cards;

    const collectionItems: SectionDataCollectionItem[] = Array.isArray(rawCards)
        ? rawCards.filter(
              (item): item is SectionDataCollectionItem =>
                  item !== null &&
                  typeof item === 'object' &&
                  !Array.isArray(item),
          )
        : [];

    const items: CardsGridItem[] = collectionItems.map((item, index) => {
        const titleValue = item.title;

        const titleString =
            typeof titleValue === 'string'
                ? titleValue
                : String(titleValue ?? '').trim();

        const subtitleValue = item.subtitle;
        const contentValue = item.content;
        const footerValue = item.footer;

        return {
            id: `card_${index}`,
            title: titleString,
            subtitle:
                typeof subtitleValue === 'string' &&
                subtitleValue.trim().length > 0
                    ? subtitleValue
                    : undefined,
            content:
                typeof contentValue === 'string' &&
                contentValue.trim().length > 0
                    ? contentValue
                    : undefined,
            footer:
                typeof footerValue === 'string' && footerValue.trim().length > 0
                    ? footerValue
                    : undefined,
        };
    });

    const filteredItems =
        typeof maxItems === 'number' ? items.slice(0, maxItems) : items;

    const nonEmptyItems = filteredItems.filter(
        (item) => item.title.trim().length > 0,
    );

    if (nonEmptyItems.length === 0) {
        return null;
    }

    const sectionClasses = [
        'flex flex-col gap-8',
        hasBorderTop ? 'border-t pt-12 md:pt-16' : 'pt-8 md:pt-12',
    ]
        .filter(Boolean)
        .join(' ');

    const gridColumnsClass =
        columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

    return (
        <div className={sectionClasses}>
            <SectionHeader
                eyebrow={eyebrow}
                title={title}
                description={description}
                align={alignHeader}
            />

            <div className={`grid gap-6 ${gridColumnsClass}`}>
                {nonEmptyItems.map((item) => (
                    <Card key={item.id} className="h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold sm:text-base">
                                {item.title}
                            </CardTitle>

                            {item.subtitle && (
                                <CardDescription className="text-xs sm:text-sm">
                                    {item.subtitle}
                                </CardDescription>
                            )}
                        </CardHeader>

                        {item.content && (
                            <CardContent className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                                {item.content}
                            </CardContent>
                        )}

                        {item.footer && (
                            <CardFooter className="text-muted-foreground text-[0.7rem] sm:text-xs">
                                {item.footer}
                            </CardFooter>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
