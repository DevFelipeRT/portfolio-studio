import { Badge } from '@/Components/Ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/Components/Ui/dialog';
import { Separator } from '@/Components/Ui/separator';
import type { Image } from '@/Modules/Images/core/types';

interface ImagePreviewDialogProps {
    open: boolean;
    image: Image | null;
    onOpenChange(open: boolean): void;
}

/**
 * Renders a modal dialog showing a larger preview and metadata for a single image.
 */
export function ImagePreviewDialog({
    open,
    image,
    onOpenChange,
}: ImagePreviewDialogProps) {
    if (!image) {
        return null;
    }

    const title =
        image.image_title ??
        image.original_filename ??
        `Image #${image.id.toString()}`;

    const fileSizeLabel = formatFileSize(image.file_size_bytes);
    const dimensionsLabel = formatDimensions(
        image.image_width,
        image.image_height,
    );
    const createdMeta = formatDateTime(image.created_at);
    const updatedMeta = formatDateTime(image.updated_at);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex flex-wrap items-center gap-2 text-base">
                        <span className="font-semibold">{title}</span>

                        {image.mime_type && (
                            <Badge variant="outline" className="text-xs">
                                {image.mime_type}
                            </Badge>
                        )}
                    </DialogTitle>

                    <DialogDescription className="text-muted-foreground mt-2 space-y-1 text-xs">
                        {createdMeta && (
                            <p>
                                Created on {createdMeta.dateLabel}
                                {createdMeta.timeLabel && (
                                    <>
                                        {' at '}
                                        {createdMeta.timeLabel}
                                    </>
                                )}
                            </p>
                        )}

                        {updatedMeta && (
                            <p>
                                Last updated on {updatedMeta.dateLabel}
                                {updatedMeta.timeLabel && (
                                    <>
                                        {' at '}
                                        {updatedMeta.timeLabel}
                                    </>
                                )}
                            </p>
                        )}

                        {image.storage_disk && image.storage_path && (
                            <p>
                                Stored on disk{' '}
                                <span className="font-medium">
                                    {image.storage_disk}
                                </span>{' '}
                                at{' '}
                                <span className="font-mono text-[0.7rem]">
                                    {image.storage_path}
                                </span>
                            </p>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <Separator className="my-4" />

                <div className="flex flex-col gap-6 md:flex-row">
                    <section className="md:w-1/2">
                        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                            Preview
                        </p>

                        <div className="bg-muted/60 flex items-center justify-center overflow-hidden rounded-md border">
                            {image.url ? (
                                <img
                                    src={image.url}
                                    alt={image.alt_text ?? ''}
                                    className="max-h-[320px] w-full object-contain"
                                />
                            ) : (
                                <div className="text-muted-foreground flex h-48 w-full items-center justify-center text-xs">
                                    No preview available for this image.
                                </div>
                            )}
                        </div>

                        {image.caption && (
                            <p className="text-muted-foreground mt-2 text-xs">
                                {image.caption}
                            </p>
                        )}
                    </section>

                    <section className="space-y-4 md:w-1/2">
                        <div>
                            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                                Metadata
                            </p>

                            <dl className="grid gap-2 text-xs sm:grid-cols-2">
                                <MetadataRow
                                    label="Original filename"
                                    value={image.original_filename}
                                />
                                <MetadataRow
                                    label="Alt text"
                                    value={image.alt_text}
                                />
                                <MetadataRow
                                    label="Title"
                                    value={image.image_title}
                                />
                                <MetadataRow
                                    label="File size"
                                    value={fileSizeLabel}
                                />
                                <MetadataRow
                                    label="Dimensions"
                                    value={dimensionsLabel}
                                />
                                <MetadataRow
                                    label="MIME type"
                                    value={image.mime_type}
                                />
                            </dl>
                        </div>

                        <div>
                            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                                Identifiers
                            </p>

                            <dl className="grid gap-2 text-xs sm:grid-cols-2">
                                <MetadataRow
                                    label="Image ID"
                                    value={image.id.toString()}
                                />
                                <MetadataRow
                                    label="Storage disk"
                                    value={image.storage_disk}
                                />
                            </dl>
                        </div>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface MetadataRowProps {
    label: string;
    value: string | null | undefined;
}

function MetadataRow({ label, value }: MetadataRowProps) {
    if (!value) {
        return null;
    }

    return (
        <div>
            <dt className="text-muted-foreground text-[0.68rem] tracking-wide uppercase">
                {label}
            </dt>
            <dd className="text-foreground text-xs">{value}</dd>
        </div>
    );
}

function formatFileSize(bytes: number | null | undefined): string | null {
    if (bytes == null || Number.isNaN(bytes)) {
        return null;
    }

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    const kb = bytes / 1024;
    if (kb < 1024) {
        return `${kb.toFixed(1)} KB`;
    }

    const mb = kb / 1024;
    if (mb < 1024) {
        return `${mb.toFixed(2)} MB`;
    }

    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
}

function formatDimensions(
    width: number | null | undefined,
    height: number | null | undefined,
): string | null {
    if (
        width == null ||
        height == null ||
        Number.isNaN(width) ||
        Number.isNaN(height)
    ) {
        return null;
    }

    return `${width} × ${height}px`;
}

function formatDateTime(
    value: string | null | undefined,
): { dateLabel: string; timeLabel: string | null } | null {
    if (!value) {
        return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    const dateLabel = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    });

    const timeLabel = date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });

    return { dateLabel, timeLabel };
}
