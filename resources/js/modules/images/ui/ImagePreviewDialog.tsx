import { Badge } from '@/components/ui/badge';
import { normalizeIntlLocale } from '@/common/i18n/normalizeIntlLocale';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { IMAGES_NAMESPACES, useImagesTranslation } from '@/modules/images/i18n';
import type { Image } from '@/modules/images/core/types';

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
    const { locale, translate: tImages } = useImagesTranslation(
        IMAGES_NAMESPACES.images,
    );
    if (!image) {
        return null;
    }

    const title =
        image.image_title ??
        image.original_filename ??
        tImages('list.titleWithId', { id: image.id.toString() });

    const fileSizeLabel = formatFileSize(image.file_size_bytes);
    const dimensionsLabel = formatDimensions(
        image.image_width,
        image.image_height,
    );
    const createdMeta = formatDateTime(image.created_at, locale);
    const updatedMeta = formatDateTime(image.updated_at, locale);

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
                                {createdMeta.timeLabel
                                    ? tImages('dialog.createdOnWithTime', {
                                          date: createdMeta.dateLabel,
                                          time: createdMeta.timeLabel,
                                      })
                                    : tImages('dialog.createdOn', {
                                          date: createdMeta.dateLabel,
                                      })}
                            </p>
                        )}

                        {updatedMeta && (
                            <p>
                                {updatedMeta.timeLabel
                                    ? tImages('dialog.updatedOnWithTime', {
                                          date: updatedMeta.dateLabel,
                                          time: updatedMeta.timeLabel,
                                      })
                                    : tImages('dialog.updatedOn', {
                                          date: updatedMeta.dateLabel,
                                      })}
                            </p>
                        )}

                        {image.storage_disk && image.storage_path && (
                            <p>
                                {tImages('dialog.storedOnDiskAt', {
                                    disk: image.storage_disk,
                                    path: image.storage_path,
                                })}
                            </p>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <Separator className="my-4" />

                <div className="flex flex-col gap-6 md:flex-row">
                    <section className="md:w-1/2">
                        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                            {tImages('dialog.sections.preview')}
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
                                    {tImages('dialog.noPreview')}
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
                                {tImages('dialog.sections.metadata')}
                            </p>

                            <dl className="grid gap-2 text-xs sm:grid-cols-2">
                                <MetadataRow
                                    label={tImages('dialog.fields.originalFilename')}
                                    value={image.original_filename}
                                />
                                <MetadataRow
                                    label={tImages('dialog.fields.altText')}
                                    value={image.alt_text}
                                />
                                <MetadataRow
                                    label={tImages('dialog.fields.title')}
                                    value={image.image_title}
                                />
                                <MetadataRow
                                    label={tImages('dialog.fields.fileSize')}
                                    value={fileSizeLabel}
                                />
                                <MetadataRow
                                    label={tImages('dialog.fields.dimensions')}
                                    value={dimensionsLabel}
                                />
                                <MetadataRow
                                    label={tImages('dialog.fields.mimeType')}
                                    value={image.mime_type}
                                />
                            </dl>
                        </div>

                        <div>
                            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                                {tImages('dialog.sections.identifiers')}
                            </p>

                            <dl className="grid gap-2 text-xs sm:grid-cols-2">
                                <MetadataRow
                                    label={tImages('dialog.fields.imageId')}
                                    value={image.id.toString()}
                                />
                                <MetadataRow
                                    label={tImages('dialog.fields.storageDisk')}
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
    locale: string,
): { dateLabel: string; timeLabel: string | null } | null {
    if (!value) {
        return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    const resolvedLocale = normalizeIntlLocale(locale);

    const dateLabel = date.toLocaleDateString(resolvedLocale, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    });

    const timeLabel = date.toLocaleTimeString(resolvedLocale, {
        hour: '2-digit',
        minute: '2-digit',
    });

    return { dateLabel, timeLabel };
}
