import { ExpandableCard } from '@/components/ui/expandable-card';
import { ReactNode } from 'react';

interface TimelineItemProps {
    /**
     * The time period or date range for the item.
     */
    period: ReactNode;
    /** The main title of the item (e.g., Position, Course Name). */
    title: string;
    /** The subtitle (e.g., Company, Institution). */
    subtitle?: string;
    /** A brief summary visible by default. */
    summary?: string;
    /** A detailed description revealed on expansion. */
    description?: string;
    /** Optional tags or categories. */
    tags?: string[];
    /** An optional icon to display. */
    icon?: ReactNode;
    /** Flag to indicate if this is the last item in the timeline (affects the vertical line). */
    isLast?: boolean;
    /** Optional custom expandable content. */
    children?: ReactNode;
}

/**
 * TimelineItem composes the expandable card with the vertical timeline markers.
 */
export function TimelineItem({
    period,
    title,
    subtitle,
    summary,
    description,
    tags,
    icon,
    isLast = false,
    children,
}: TimelineItemProps) {
    const hasDescription =
        !!children ||
        (typeof description === 'string' && description.trim() !== '');

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

            <ExpandableCard
                title={title}
                subtitle={subtitle}
                description={summary}
                icon={icon}
                meta={period}
                tags={tags}
                disabled={!hasDescription}
            >
                {children}
                {!children && description && <p className="mt-1">{description}</p>}
            </ExpandableCard>
        </div>
    );
}
