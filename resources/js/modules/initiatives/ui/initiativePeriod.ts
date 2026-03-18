import type { Initiative } from '@/modules/initiatives/core/types';

type InitiativePeriodTranslator = (
    key: string,
    params?: Record<string, string>,
) => string;

export function formatInitiativePeriod(
    start: Initiative['start_date'],
    end: Initiative['end_date'],
    t: InitiativePeriodTranslator,
): string | null {
    if (!start) {
        return null;
    }

    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;

    if (Number.isNaN(startDate.getTime())) {
        return null;
    }

    const startLabel = startDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    });

    if (!endDate || Number.isNaN(endDate.getTime()) || end === start) {
        return startLabel;
    }

    const endLabel = endDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    });

    return t('overlay.fromTo', { start: startLabel, end: endLabel });
}
