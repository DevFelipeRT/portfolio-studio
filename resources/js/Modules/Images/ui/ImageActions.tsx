import * as React from 'react';
import type { Image } from '@/Modules/Images/core/types';

import { Button } from '@/Components/Ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/Ui/dropdown-menu';
import { Link } from '@inertiajs/react';
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
                    <span className="sr-only">Open image actions menu</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="min-w-40"
                onClick={(event) => event.stopPropagation()}
            >
                <DropdownMenuItem onClick={handleViewClick}>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>View details</span>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href={route('images.edit', image.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit metadata</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={handleDeleteClick}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete image</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
