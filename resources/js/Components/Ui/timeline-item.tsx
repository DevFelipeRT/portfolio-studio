import { ExpandableCard } from '@/Components/Ui/expandable-card';
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
    short_description?: string;
    /** A detailed description revealed on expansion. */
    long_description?: string;
    /** Optional tags or categories. */
    tags?: string[];
    /** An optional icon to display. */
    icon?: ReactNode;
    /** Flag to indicate if this is the last item in the timeline (affects the vertical line). */
    isLast?: boolean;
}

/**
 * TimelineItem composes the expandable card with the vertical timeline markers.
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
    const hasLongDescription =
        typeof long_description === 'string' && long_description.trim() !== '';

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
                description={short_description}
                icon={icon}
                meta={period}
                tags={tags}
                disabled={!hasLongDescription}
            >
                {hasLongDescription && (
                    <p className="mt-1">{long_description}</p>
                )}
            </ExpandableCard>
        </div>
    );
}
