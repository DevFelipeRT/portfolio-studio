import * as React from 'react';
import type { Image } from '@/modules/images/core/types';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageLink } from '@/common/page-runtime';
import { IMAGES_NAMESPACES, useImagesTranslation } from '@/modules/images/i18n';
import { Eye, MoreVertical, Pencil, Trash2 } from 'lucide-react';

interface ImageActionsProps {
    image: Image;
    onView?(image: Image): void;
    onDelete?(image: Image): void;
}

/**
 * Dropdown menu exposing contextual actions for a single image.
 */
export function ImageActions({ image, onView, onDelete }: ImageActionsProps) {
    const { translate: tActions } = useImagesTranslation(IMAGES_NAMESPACES.actions);
    const handleTriggerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
    };

    const handleViewClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (onView) {
            onView(image);
        }
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (onDelete) {
            onDelete(image);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-muted h-8 w-8"
                    onClick={handleTriggerClick}
                >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">{tActions('openMenu')}</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="min-w-40"
                onClick={(event) => event.stopPropagation()}
            >
                <DropdownMenuItem onClick={handleViewClick}>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>{tActions('viewDetails')}</span>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <PageLink href={route('images.edit', image.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>{tActions('editMetadata')}</span>
                    </PageLink>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={handleDeleteClick}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>{tActions('deleteImage')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
