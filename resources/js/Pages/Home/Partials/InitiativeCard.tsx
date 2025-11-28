// resources/js/Pages/Home/Partials/InitiativeCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/Components/Ui/card';
import { Initiative } from '@/Pages/types';

type InitiativeCardProps = {
    initiative: Initiative;
};

/**
 * InitiativeCard renders a single initiative card for the landing page.
 */
export function InitiativeCard({ initiative }: InitiativeCardProps) {
    const coverImage = initiative.images?.[0] ?? null;
    const dateLabel = formatInitiativeDate(
        initiative.start_date,
        initiative.end_date,
    );

    return (
        <Card className="bg-card/80 flex h-full flex-col overflow-hidden border shadow-sm">
            {coverImage && (
                <div className="relative h-40 w-full overflow-hidden">
                    <img
                        src={coverImage.src}
                        alt={coverImage.alt ?? initiative.name}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                        loading="lazy"
                    />
                </div>
            )}

            <CardHeader className="space-y-2 pb-2">
                <CardTitle className="text-base font-semibold">
                    {initiative.name}
                </CardTitle>

                {dateLabel && (
                    <p className="text-muted-foreground text-xs tracking-wide uppercase">
                        {dateLabel}
                    </p>
                )}
            </CardHeader>

            <CardContent className="pb-5">
                {initiative.short_description && (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        {initiative.short_description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

function formatInitiativeDate(
    startDate?: string | null,
    endDate?: string | null,
): string | null {
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start && !end) {
        return null;
    }

    if (start && !end) {
        return start.toLocaleDateString(undefined, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }

    if (!start && end) {
        return end.toLocaleDateString(undefined, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }

    if (!start || !end) {
        return null;
    }

    const sameYear = start.getFullYear() === end.getFullYear();

    const fromLabel = start.toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: sameYear ? undefined : 'numeric',
    });

    const toLabel = end.toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    return `${fromLabel} – ${toLabel}`;
}

function parseDate(value?: string | null): Date | null {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
}
