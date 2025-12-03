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
import { KeyboardEvent, ReactNode, useCallback, useState } from 'react';

export interface ExpandableCardProps {
    /**
     * Primary title rendered in the card header.
     */
    title: ReactNode;

    /**
     * Optional subtitle rendered below the title.
     */
    subtitle?: ReactNode;

    /**
     * Optional short description rendered in the header.
     */
    description?: ReactNode;

    /**
     * Optional icon rendered in the header, usually next to the meta content.
     */
    icon?: ReactNode;

    /**
     * Optional meta information rendered on the right side of the header.
     * Common use cases include period labels, status badges, or small counters.
     */
    meta?: ReactNode;

    /**
     * Optional list of string tags rendered in the card content.
     */
    tags?: string[];

    /**
     * Optional custom tag renderer.
     * If provided, it will be used to render each tag instead of the default Badge.
     */
    renderTag?: (tag: string) => ReactNode;

    /**
     * Expandable content rendered inside the collapsible section.
     */
    children?: ReactNode;

    /**
     * Initial open state for uncontrolled usage.
     */
    defaultOpen?: boolean;

    /**
     * Controlled open state. When defined, the component becomes controlled.
     */
    open?: boolean;

    /**
     * Callback invoked whenever the open state changes.
     */
    onOpenChange?: (isOpen: boolean) => void;

    /**
     * When true, disables the expandable behavior even if children are provided.
     */
    disabled?: boolean;

    /**
     * Additional class name applied to the Card root element.
     */
    className?: string;

    /**
     * Additional class name applied to the CardHeader element.
     */
    headerClassName?: string;

    /**
     * Additional class name applied to the CardContent element.
     */
    contentClassName?: string;
}

/**
 * ExpandableCard renders a generic card that can optionally expand
 * to reveal additional content when header interactions occur.
 */
export function ExpandableCard({
    title,
    subtitle,
    description,
    icon,
    meta,
    tags,
    renderTag,
    children,
    defaultOpen = false,
    open,
    onOpenChange,
    disabled = false,
    className,
    headerClassName,
    contentClassName,
}: ExpandableCardProps) {
    const hasTags = Array.isArray(tags) && tags.length > 0;
    const hasExpandableContent = !!children && !disabled;

    const [uncontrolledOpen, setUncontrolledOpen] =
        useState<boolean>(defaultOpen);

    const isControlled = typeof open === 'boolean';
    const isOpen = isControlled ? (open as boolean) : uncontrolledOpen;

    const handleInternalOpenChange = useCallback(
        (nextOpen: boolean): void => {
            if (!isControlled) {
                setUncontrolledOpen(nextOpen);
            }

            if (onOpenChange) {
                onOpenChange(nextOpen);
            }
        },
        [isControlled, onOpenChange],
    );

    const handleToggle = (): void => {
        if (!hasExpandableContent) {
            return;
        }

        handleInternalOpenChange(!isOpen);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
        if (!hasExpandableContent) {
            return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleInternalOpenChange(!isOpen);
        }
    };

    const rootClassName = [
        'border-border/60 bg-card/50 hover:border-border/80 hover:bg-card/80 backdrop-blur transition-colors',
        hasExpandableContent ? 'cursor-pointer' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const headerClasses = ['pb-3', headerClassName].filter(Boolean).join(' ');

    const contentClasses = ['space-y-4 pt-0', contentClassName]
        .filter(Boolean)
        .join(' ');

    return (
        <Collapsible open={isOpen} onOpenChange={handleInternalOpenChange}>
            <Card
                className={rootClassName}
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                role={hasExpandableContent ? 'button' : undefined}
                tabIndex={hasExpandableContent ? 0 : -1}
            >
                <CardHeader className={headerClasses}>
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

                            {meta && (
                                <span className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap">
                                    {meta}
                                </span>
                            )}

                            {hasExpandableContent && (
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

                    {description && (
                        <CardDescription className="text-muted-foreground mt-2 text-xs leading-relaxed sm:text-sm">
                            {description}
                        </CardDescription>
                    )}
                </CardHeader>

                {(hasTags || hasExpandableContent) && (
                    <CardContent className={contentClasses}>
                        {hasTags && (
                            <div className="flex flex-wrap gap-2">
                                {tags?.map((tag) =>
                                    renderTag ? (
                                        <span key={tag}>{renderTag(tag)}</span>
                                    ) : (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="hover:bg-secondary/80 px-2 py-0.5 text-[0.7rem] font-normal transition-colors"
                                        >
                                            {tag}
                                        </Badge>
                                    ),
                                )}
                            </div>
                        )}

                        {hasExpandableContent && (
                            <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up text-muted-foreground mt-1 overflow-hidden text-xs leading-relaxed sm:text-sm">
                                {children}
                            </CollapsibleContent>
                        )}
                    </CardContent>
                )}
            </Card>
        </Collapsible>
    );
}
