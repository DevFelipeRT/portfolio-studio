import { Card, CardContent, CardHeader, CardTitle } from '@/Components/Ui/card';
import { DateDisplay } from '@/Components/Ui/date-display'; // Importação adicionada
import { useTranslation } from '@/i18n'; // Importação adicionada
import { Initiative } from '@/Pages/types';
import { JSX } from 'react';

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

    const format = 'PP'; // Formato de data padrão localizado (ex: '3 Mar, 2020')
    const separator = ' – ';

    // Case 1: Only start_date available
    if (start_date && !end_date) {
        return (
            <DateDisplay
                value={start_date}
                locale={locale}
                format={format}
                key="start-only"
            />
        );
    }

    // Case 2: Only end_date available (Unusual, but handled)
    if (!start_date && end_date) {
        return (
            <DateDisplay
                value={end_date}
                locale={locale}
                format={format}
                key="end-only"
            />
        );
    }

    // Case 3: Both dates available (Date Range)
    if (start_date && end_date) {
        return (
            <>
                <DateDisplay
                    value={start_date}
                    locale={locale}
                    format={format}
                    key="start-date"
                />
                {separator}
                <DateDisplay
                    value={end_date}
                    locale={locale}
                    format={format}
                    key="end-date"
                />
            </>
        );
    }

    // Case 4: No dates available
    return null;
}

/**
 * InitiativeCard renders a single initiative card for the landing page.
 */
export function InitiativeCard({ initiative }: InitiativeCardProps) {
    // Need access to locale for DateDisplay
    const { locale } = useTranslation('home');

    const coverImage = initiative.images?.[0] ?? null;

    // Use the new component for date labeling
    const periodLabel = (
        <InitiativePeriodDisplay initiative={initiative} locale={locale} />
    );

    const hasDates = !!initiative.start_date || !!initiative.end_date;

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

                {/* Render the new component if dates exist */}
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
