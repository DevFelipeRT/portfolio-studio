import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { Initiative } from '@/modules/initiatives/core/types';
import { RichTextRenderer } from '@/common/rich-text/RichTextRenderer';

interface InitiativeOverlayProps {
    open: boolean;
    initiative: Initiative | null;
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
    if (!initiative) {
        return null;
    }

    const { periodLabel, dateLabel, timeLabel } = buildDateMetadata(initiative);

    const images = initiative.images ?? [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex flex-wrap items-center gap-2 text-base">
                        <span className="font-semibold">{initiative.name}</span>

                        <Badge variant="outline" className="text-xs">
                            {initiative.display ? 'Visible' : 'Hidden'}
                        </Badge>
                    </DialogTitle>

                    <DialogDescription className="text-muted-foreground mt-2 space-y-1 text-xs">
                        {periodLabel && <p>{periodLabel}</p>}

                        {dateLabel && timeLabel && (
                            <p>
                                Created on {dateLabel} at {timeLabel}
                            </p>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <Separator className="my-4" />

                <div className="space-y-6">
                    <section>
                        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                            Summary
                        </p>
                        <p className="text-foreground text-sm">
                            {initiative.summary ?? ''}
                        </p>
                    </section>

                    <section>
                        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                            Details
                        </p>
                        <RichTextRenderer value={initiative.description ?? ''} />
                    </section>

                    {images.length > 0 && (
                        <section>
                            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                                Images
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
            </DialogContent>
        </Dialog>
    );
}

function buildDateMetadata(initiative: Initiative): {
    periodLabel: string | null;
    dateLabel: string | null;
    timeLabel: string | null;
} {
    const periodLabel = formatPeriod(
        initiative.start_date,
        initiative.end_date,
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
        return `Happened on ${startLabel}`;
    }

    const endLabel = endDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    });

    return `From ${startLabel} to ${endLabel}`;
}
