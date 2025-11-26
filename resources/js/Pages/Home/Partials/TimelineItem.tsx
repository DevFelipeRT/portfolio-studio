import { Badge } from '@/Components/Ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/Ui/card';
import { Collapsible, CollapsibleContent } from '@/Components/Ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { KeyboardEvent, ReactNode, useState } from 'react';

interface TimelineItemProps {
    period: string;
    title: string;
    subtitle?: string;
    short_description?: string;
    long_description?: string;
    tags?: string[];
    icon?: ReactNode;
    isLast?: boolean;
}

/**
 * TimelineItem represents a single entry in an experience or education timeline.
 * The entire card acts as a trigger to expand or collapse detailed content.
 */
export function TimelineItem({
    period,
    title,
    subtitle,
    short_description,
    long_description,
    tags,
    icon,
    isLast = false,
}: TimelineItemProps) {
    const hasTags = !!tags && tags.length > 0;
    const hasLongDescription = !!long_description;
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (): void => {
        if (!hasLongDescription) {
            return;
        }

        setIsOpen((current) => !current);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
        if (!hasLongDescription) {
            return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen((current) => !current);
        }
    };

    return (
        <div className="relative pb-2 pl-8 sm:pl-10">
            {!isLast && (
                <div
                    className="bg-border absolute top-8 left-[11px] h-full w-px sm:left-[15px]"
                    aria-hidden="true"
                />
            )}

            <div
                className="border-primary bg-background ring-background absolute top-8 left-[7px] h-2.5 w-2.5 rounded-full border ring-4 sm:left-[11px]"
                aria-hidden="true"
            />

            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <Card
                    className={[
                        'border-border/60 bg-card/50 hover:border-border/80 hover:bg-card/80 backdrop-blur transition-colors',
                        hasLongDescription ? 'cursor-pointer' : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    onClick={handleToggle}
                    onKeyDown={handleKeyDown}
                    role={hasLongDescription ? 'button' : undefined}
                    tabIndex={hasLongDescription ? 0 : -1}
                >
                    <CardHeader className="pb-3">
                        <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-start">
                            <div className="space-y-1.5">
                                <CardTitle className="text-base leading-none font-semibold tracking-tight">
                                    {title}
                                </CardTitle>

                                {subtitle && (
                                    <p className="text-muted-foreground text-sm font-medium">
                                        {subtitle}
                                    </p>
                                )}
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                {icon && (
                                    <div className="text-muted-foreground h-4 w-4">
                                        {icon}
                                    </div>
                                )}

                                <span className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap">
                                    {period}
                                </span>

                                {hasLongDescription && (
                                    <ChevronDown
                                        className={[
                                            'text-muted-foreground h-4 w-4 transition-transform',
                                            isOpen ? 'rotate-180' : '',
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}
                                        aria-hidden="true"
                                    />
                                )}
                            </div>
                        </div>

                        {short_description && (
                            <CardDescription className="text-muted-foreground mt-2 text-xs leading-relaxed sm:text-sm">
                                {short_description}
                            </CardDescription>
                        )}
                    </CardHeader>

                    {(hasTags || hasLongDescription) && (
                        <CardContent className="space-y-4 pt-0">
                            {hasTags && (
                                <div className="flex flex-wrap gap-2">
                                    {tags?.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="hover:bg-secondary/80 px-2 py-0.5 text-[0.7rem] font-normal transition-colors"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {hasLongDescription && (
                                <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up text-muted-foreground mt-1 overflow-hidden text-xs leading-relaxed sm:text-sm">
                                    <p className="mt-1">{long_description}</p>
                                </CollapsibleContent>
                            )}
                        </CardContent>
                    )}
                </Card>
            </Collapsible>
        </div>
    );
}
