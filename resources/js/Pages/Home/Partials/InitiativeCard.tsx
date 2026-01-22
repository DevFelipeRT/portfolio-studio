import { Card, CardContent, CardHeader, CardTitle } from '@/Components/Ui/card';
import { DateDisplay } from '@/Components/Ui/date-display';
import { useTranslation } from '@/i18n';
import type { Initiative } from '@/Modules/Initiatives/core/types';
import type { JSX } from 'react';

type InitiativeCardProps = {
    initiative: Initiative;
};

/**
 * Renders the period of an initiative (start date to end date) using DateDisplay components.
 *
 * This component handles two cases: a single date (if only one is provided) or a date range (Start – End).
 *
 * @param {Initiative} initiative The initiative data containing start and end dates.
 * @param {string} locale The current locale for date formatting.
 * @returns {JSX.Element | null} The rendered period string or null if no dates are provided.
 */
function InitiativePeriodDisplay({
    initiative,
    locale,
}: {
    initiative: Initiative;
    locale: string;
}): JSX.Element | null {
    const { start_date, end_date } = initiative;

    const format = 'PP';
    const separator = ' – ';

    if (start_date && !end_date) {
        return (
            <DateDisplay value={start_date} locale={locale} format={format} />
        );
    }

    if (!start_date && end_date) {
        return <DateDisplay value={end_date} locale={locale} format={format} />;
    }

    if (start_date && end_date) {
        return (
            <>
                <DateDisplay
                    value={start_date}
                    locale={locale}
                    format={format}
                />
                {separator}
                <DateDisplay value={end_date} locale={locale} format={format} />
            </>
        );
    }

    return null;
}

/**
 * InitiativeCard renders a single initiative card for the landing page.
 */
export function InitiativeCard({ initiative }: InitiativeCardProps) {
    const { locale } = useTranslation('home');

    const coverImage = initiative.images?.[0] ?? null;
    const coverUrl = coverImage?.url ?? coverImage?.src ?? null;
    const coverAlt =
        coverImage?.alt_text ||
        coverImage?.alt ||
        coverImage?.image_title ||
        coverImage?.title ||
        initiative.name;

    const periodLabel = (
        <InitiativePeriodDisplay initiative={initiative} locale={locale} />
    );

    const hasDates = !!initiative.start_date || !!initiative.end_date;

    return (
        <Card className="bg-card/80 flex h-full flex-col overflow-hidden border shadow-sm">
            {coverUrl && (
                <div className="relative h-40 w-full overflow-hidden">
                    <img
                        src={coverUrl}
                        alt={coverAlt}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                        loading="lazy"
                    />
                </div>
            )}

            <CardHeader className="space-y-2 pb-2">
                <CardTitle className="text-base font-semibold">
                    {initiative.name}
                </CardTitle>

                {hasDates && periodLabel && (
                    <p className="text-muted-foreground text-xs tracking-wide uppercase">
                        {periodLabel}
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
