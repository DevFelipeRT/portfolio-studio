import * as React from 'react';
import type { Image } from '../../types';
import { ImageActions } from './ImageActions';

import { Badge } from '@/Components/Ui/badge';
import { Button } from '@/Components/Ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/Ui/card';

interface ImageListPagination {
    currentPage: number;
    lastPage: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface ImageListProps {
    items: Image[];
    pagination?: ImageListPagination | null;
    onItemClick?(image: Image): void;
    onView?(image: Image): void;
    onDelete?(image: Image): void;
    onPageChange?(page: number): void;
}

/**
 * Renders a responsive grid of image cards with optional pagination controls.
 */
export function ImageList({
    items,
    pagination,
    onItemClick,
    onView,
    onDelete,
    onPageChange,
}: ImageListProps) {
    const handleCardClick = (image: Image) => {
        if (onItemClick) {
            onItemClick(image);
        }
    };

    const handleCardKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement>,
        image: Image,
    ) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (onItemClick) {
                onItemClick(image);
            }
        }
    };

    const handlePreviousPage = () => {
        if (!pagination || !onPageChange) {
            return;
        }

        if (pagination.currentPage > 1) {
            onPageChange(pagination.currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (!pagination || !onPageChange) {
            return;
        }

        if (pagination.currentPage < pagination.lastPage) {
            onPageChange(pagination.currentPage + 1);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((image) => {
                    const title =
                        image.image_title ??
                        image.original_filename ??
                        `Image #${image.id.toString()}`;

                    const fileSizeLabel = formatFileSize(image.file_size_bytes);
                    const dimensionsLabel = formatDimensions(
                        image.image_width,
                        image.image_height,
                    );

                    return (
                        <Card
                            key={image.id}
                            className="hover:border-primary/50 flex cursor-pointer flex-col transition hover:shadow-sm"
                            role="button"
                            tabIndex={0}
                            onClick={() => handleCardClick(image)}
                            onKeyDown={(event) =>
                                handleCardKeyDown(event, image)
                            }
                        >
                            <CardHeader className="space-y-2 pb-2">
                                <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="line-clamp-2 text-sm font-semibold">
                                        {title}
                                    </CardTitle>

                                    <ImageActions
                                        image={image}
                                        onView={onView}
                                        onDelete={onDelete}
                                    />
                                </div>

                                <div className="flex flex-wrap items-center gap-1">
                                    {image.mime_type && (
                                        <Badge
                                            variant="outline"
                                            className="text-[0.65rem]"
                                        >
                                            {image.mime_type}
                                        </Badge>
                                    )}

                                    {dimensionsLabel && (
                                        <Badge
                                            variant="outline"
                                            className="text-[0.65rem]"
                                        >
                                            {dimensionsLabel}
                                        </Badge>
                                    )}

                                    {fileSizeLabel && (
                                        <Badge
                                            variant="outline"
                                            className="text-[0.65rem]"
                                        >
                                            {fileSizeLabel}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="flex flex-1 flex-col gap-3 pt-0">
                                <div className="bg-muted/60 flex min-h-[160px] items-center justify-center overflow-hidden rounded-md border">
                                    {image.url ? (
                                        <img
                                            src={image.url}
                                            alt={image.alt_text ?? ''}
                                            className="max-h-[180px] w-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-muted-foreground flex h-40 w-full items-center justify-center text-xs">
                                            No preview available.
                                        </div>
                                    )}
                                </div>

                                <div className="text-muted-foreground space-y-1 text-xs">
                                    {image.caption && (
                                        <p className="line-clamp-2">
                                            {image.caption}
                                        </p>
                                    )}

                                    {image.original_filename && (
                                        <p className="font-mono text-[0.68rem]">
                                            {image.original_filename}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {pagination && onPageChange && (
                <div className="text-muted-foreground flex flex-col items-center justify-between gap-3 border-t pt-3 text-xs sm:flex-row">
                    <div>
                        {pagination.total > 0 ? (
                            <span>
                                Showing{' '}
                                <span className="font-medium">
                                    {pagination.from ?? 0}
                                </span>{' '}
                                to{' '}
                                <span className="font-medium">
                                    {pagination.to ?? 0}
                                </span>{' '}
                                of{' '}
                                <span className="font-medium">
                                    {pagination.total}
                                </span>{' '}
                                images
                            </span>
                        ) : (
                            <span>No images to display.</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={pagination.currentPage <= 1}
                            onClick={handlePreviousPage}
                        >
                            Previous
                        </Button>

                        <span className="text-[0.75rem]">
                            Page{' '}
                            <span className="font-medium">
                                {pagination.currentPage}
                            </span>{' '}
                            of{' '}
                            <span className="font-medium">
                                {pagination.lastPage}
                            </span>
                        </span>

                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={
                                pagination.currentPage >= pagination.lastPage
                            }
                            onClick={handleNextPage}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
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
