import { RichTextRenderer } from '@/common/rich-text/RichTextRenderer';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Initiative } from '@/modules/initiatives/core/types';
import {
    INITIATIVES_NAMESPACES,
    useInitiativesTranslation,
} from '@/modules/initiatives/i18n';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
    InitiativeImageCarousel,
    type InitiativeCarouselImage,
} from './InitiativeImageCarousel';
import { formatInitiativePeriod } from './initiativePeriod';

export interface InitiativeCardProps {
    id: Initiative['id'];
    name: Initiative['name'] | null | undefined;
    summary: Initiative['summary'];
    description: Initiative['description'];
    start_date: Initiative['start_date'];
    end_date: Initiative['end_date'];
    images?: InitiativeCarouselImage[] | null;
    className?: string;
    collapsedMinHeight?: number;
    onCollapsedHeightChange?: (height: number) => void;
}

/**
 * InitiativeCard renders a public initiative card with optional image carousel
 * and expandable details, following the same interaction pattern as projects.
 */
export function InitiativeCard({
    name,
    summary,
    description,
    start_date,
    end_date,
    images,
    className,
    collapsedMinHeight,
    onCollapsedHeightChange,
}: InitiativeCardProps) {
    const { translate: tActions } = useInitiativesTranslation(
        INITIATIVES_NAMESPACES.actions,
    );
    const { translate: tForm } = useInitiativesTranslation(
        INITIATIVES_NAMESPACES.form,
    );
    const collapsedContentRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const hasImages = Array.isArray(images) && images.length > 0;

    const displayName =
        typeof name === 'string' && name.trim().length > 0
            ? name
            : tForm('card.untitled');

    const displaySummary =
        typeof summary === 'string' && summary.trim().length > 0
            ? summary
            : tForm('card.noSummary');

    const periodLabel = formatInitiativePeriod(start_date, end_date, tForm);
    const shouldRenderLongDescription =
        typeof description === 'string' && description.trim().length > 0;

    useEffect(() => {
        const element = collapsedContentRef.current;

        if (!element || !onCollapsedHeightChange) {
            return;
        }

        const reportHeight = () => {
            onCollapsedHeightChange(Math.ceil(element.getBoundingClientRect().height));
        };

        reportHeight();

        if (typeof ResizeObserver === 'undefined') {
            return;
        }

        const observer = new ResizeObserver(() => {
            reportHeight();
        });

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [onCollapsedHeightChange]);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card
                className={cn('flex h-full flex-col overflow-hidden', className)}
                style={
                    collapsedMinHeight
                        ? { minHeight: `${collapsedMinHeight}px` }
                        : undefined
                }
            >
                <div ref={collapsedContentRef} className="flex flex-1 flex-col">
                    {hasImages && (
                        <InitiativeImageCarousel
                            images={images}
                            title={displayName}
                            emptyLabel={tForm('card.noImages')}
                        />
                    )}

                    <div className="flex flex-1 flex-col">
                        <CardHeader className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <CardTitle className="text-base font-semibold sm:text-lg">
                                        {displayName}
                                    </CardTitle>
                                </div>
                            </div>

                            <CardDescription className="flex-1 text-muted-foreground text-xs leading-relaxed sm:text-sm">
                                {displaySummary}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-0">
                            <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                                {periodLabel ?? tForm('card.noPeriod')}
                            </p>
                        </CardContent>

                        <CardFooter className="mt-auto flex flex-col gap-3 pt-4">
                            {shouldRenderLongDescription && (
                                <>
                                    <Separator />

                                    <div className="flex justify-center">
                                        <CollapsibleTrigger asChild>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                className="group focus-visible:text-foreground mx-auto gap-1.5 border-0 px-0 text-xs font-medium shadow-none focus-within:ring-0 hover:bg-transparent focus-visible:bg-transparent"
                                            >
                                                <span className="text-muted-foreground group-hover:text-foreground/80 focus:text-foreground">
                                                    {isOpen
                                                        ? tActions('hideDetails')
                                                        : tActions('showDetails')}
                                                </span>
                                                <ChevronDown
                                                    className={`text-muted-foreground hover:shadow-primary group-hover:text-primary group-hover:drop-shadow-primary h-4 w-4 transition-transform group-hover:drop-shadow-sm ${
                                                        isOpen ? 'rotate-180' : ''
                                                    }`}
                                                />
                                            </Button>
                                        </CollapsibleTrigger>
                                    </div>
                                </>
                            )}
                        </CardFooter>
                    </div>
                </div>

                {shouldRenderLongDescription && (
                    <CollapsibleContent className="text-muted-foreground data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden text-xs leading-relaxed sm:text-sm">
                        <div className="border-border/60 mx-6 mt-3 mb-6 border-t pt-3">
                            <RichTextRenderer value={description} />
                        </div>
                    </CollapsibleContent>
                )}
            </Card>
        </Collapsible>
    );
}
