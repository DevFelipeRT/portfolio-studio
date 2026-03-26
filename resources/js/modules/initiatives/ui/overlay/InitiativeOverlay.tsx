import { fetchInitiativeDetail } from '@/modules/initiatives/core/api/details';
import { Badge } from '@/components/ui/badge';
import { TableDetailDialog } from '@/common/table';
import { Separator } from '@/components/ui/separator';
import type {
  InitiativeDetail,
  InitiativeListItem,
} from '@/modules/initiatives/core/types';
import { RichTextRenderer } from '@/common/rich-text/RichTextRenderer';
import {
    INITIATIVES_NAMESPACES,
    useInitiativesTranslation,
} from '@/modules/initiatives/i18n';
import React from 'react';
import { formatInitiativePeriod } from '../initiativePeriod';

interface InitiativeOverlayProps {
    open: boolean;
    initiative: InitiativeListItem | null;
    onOpenChange(open: boolean): void;
}

/**
 * InitiativeOverlay displays a single initiative in a modal overlay.
 */
export function InitiativeOverlay({
    open,
    initiative,
    onOpenChange,
}: InitiativeOverlayProps) {
    const { translate: tForm } = useInitiativesTranslation(INITIATIVES_NAMESPACES.form);
    const [detail, setDetail] = React.useState<InitiativeDetail | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [hasLoadError, setHasLoadError] = React.useState(false);
    const initiativeId = initiative?.id ?? null;

    React.useEffect(() => {
        let active = true;

        if (!open || initiativeId === null) {
            setDetail(null);
            setLoading(false);
            setHasLoadError(false);
            return () => {
                active = false;
            };
        }

        setDetail(null);
        setLoading(true);
        setHasLoadError(false);

        void fetchInitiativeDetail(initiativeId)
            .then((nextDetail) => {
                if (!active) {
                    return;
                }

                setDetail(nextDetail);
            })
            .catch(() => {
                if (!active) {
                    return;
                }

                setDetail(null);
                setHasLoadError(true);
            })
            .finally(() => {
                if (!active) {
                    return;
                }

                setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [initiativeId, open]);

    if (!initiative) {
        return null;
    }

    const titleSource = detail ?? initiative;
    const images = detail?.images ?? [];
    const metadata = detail ? buildDateMetadata(detail, tForm) : null;

    return (
        <TableDetailDialog
            open={open}
            onOpenChange={onOpenChange}
            title={
                <div className="flex flex-wrap items-center gap-2 text-base">
                    <span className="font-semibold">{titleSource.name}</span>

                    <Badge variant="outline" className="text-xs">
                        {titleSource.display
                            ? tForm('values.public')
                            : tForm('values.private')}
                    </Badge>
                </div>
            }
            className="max-w-2xl"
        >
            {loading && !detail ? (
                <p className="text-muted-foreground text-sm">
                    {tForm('overlay.loading')}
                </p>
            ) : null}

            {!loading && hasLoadError ? (
                <p className="text-destructive text-sm">
                    {tForm('overlay.loadError')}
                </p>
            ) : null}

            {detail ? (
                <>
                    <div className="text-muted-foreground space-y-1 text-xs">
                        {metadata?.periodLabel && <p>{metadata.periodLabel}</p>}

                        {metadata?.dateLabel && metadata.timeLabel && (
                            <p>
                                {tForm('overlay.createdOn', {
                                    date: metadata.dateLabel,
                                    time: metadata.timeLabel,
                                })}
                            </p>
                        )}
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-6">
                        <section>
                            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                                {tForm('overlay.summary')}
                            </p>
                            <p className="text-foreground text-sm">
                                {detail.summary ?? ''}
                            </p>
                        </section>

                        <section>
                            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                                {tForm('overlay.details')}
                            </p>
                            <RichTextRenderer value={detail.description ?? ''} />
                        </section>

                        {images.length > 0 && (
                            <section>
                                <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                                    {tForm('overlay.images')}
                                </p>

                                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                                    {images.map((image) => (
                                        <figure
                                            key={image.id}
                                            className="bg-muted/40 overflow-hidden rounded-md border"
                                        >
                                            <img
                                                src={image.url ?? image.src ?? ''}
                                                alt={
                                                    image.alt_text ??
                                                    image.alt ??
                                                    image.image_title ??
                                                    image.title ??
                                                    ''
                                                }
                                                className="h-32 w-full object-cover sm:h-36 md:h-40"
                                            />
                                        </figure>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </>
            ) : null}
        </TableDetailDialog>
    );
}

function buildDateMetadata(
    initiative: InitiativeDetail,
    t: (key: string, params?: Record<string, string>) => string,
): {
    periodLabel: string | null;
    dateLabel: string | null;
    timeLabel: string | null;
} {
    const periodLabel = formatPeriod(
        initiative.start_date,
        initiative.end_date,
        t,
    );

    if (!initiative.created_at) {
        return {
            periodLabel,
            dateLabel: null,
            timeLabel: null,
        };
    }

    const createdAt = new Date(initiative.created_at);

    if (Number.isNaN(createdAt.getTime())) {
        return {
            periodLabel,
            dateLabel: null,
            timeLabel: null,
        };
    }

    const dateLabel = createdAt.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    });

    const timeLabel = createdAt.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });

    return { periodLabel, dateLabel, timeLabel };
}

function formatPeriod(
    start: string | null,
    end: string | null,
    t: (key: string, params?: Record<string, string>) => string,
): string | null {
    return formatInitiativePeriod(start, end, t);
}
