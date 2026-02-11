// resources/js/Modules/ContentManagement/Components/Sections/CardsGridSection.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/Components/Ui/card';
import type {
  SectionDataCollectionItem,
  SectionDataValue,
} from '@/Modules/ContentManagement/types';
import { JSX } from 'react';
import type { SectionComponentProps } from '../registry/sectionRegistry';
import { useSectionFieldResolver } from '../runtime/useSectionFieldResolver';
import { SectionHeader } from './partials/SectionHeader';

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
  className,
}: SectionComponentProps): JSX.Element | null {
  const fieldResolver = useSectionFieldResolver();
  const targetId = section.anchor || `cards-grid-${section.id}`;

  const eyebrow = fieldResolver.getValue<string>('eyebrow');
  const title = fieldResolver.getValue<string>('title') ?? '';
  const description = fieldResolver.getValue<string>('description');

  const rawColumns = fieldResolver.getValue<number>('columns');
  const columns = rawColumns === 2 ? 2 : 3;

  const rawAlignHeader = fieldResolver.getValue<string>('align_header');
  const alignHeader = rawAlignHeader === 'center' ? 'center' : 'left';

  const rawMaxItems =
    fieldResolver.getValue<number>('max_items') ??
    fieldResolver.getValue<number>('maxItems');

  const maxItems =
    typeof rawMaxItems === 'number' && rawMaxItems > 0
      ? rawMaxItems
      : undefined;

  const rawCards = fieldResolver.getValue<SectionDataValue>('cards');

  const collectionItems: SectionDataCollectionItem[] = Array.isArray(rawCards)
    ? rawCards.filter(
        (item): item is SectionDataCollectionItem =>
          item !== null && typeof item === 'object' && !Array.isArray(item),
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
        typeof subtitleValue === 'string' && subtitleValue.trim().length > 0
          ? subtitleValue
          : undefined,
      content:
        typeof contentValue === 'string' && contentValue.trim().length > 0
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

  const resolvedSectionClasses = ['flex flex-col gap-8', className]
    .filter(Boolean)
    .join(' ')
    .trim();

  const gridColumnsClass = columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

  return (
    <section className={resolvedSectionClasses} id={targetId}>
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
    </section>
  );
}
