import { Initiative } from './InitiativeOverlay';

import { Button } from '@/Components/Ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/Ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import {
    ChevronRight,
    Eye,
    EyeOff,
    MoreVertical,
    Pencil,
    Trash2,
} from 'lucide-react';
import React from 'react';

interface InitiativeActionsProps {
    initiative: Initiative;
    onToggleDisplay(initiative: Initiative, event?: React.MouseEvent): void;
    onDelete(initiative: Initiative, event?: React.MouseEvent): void;
}

/**
 * InitiativeActions renders the actions menu for a single initiative row.
 */
export function InitiativeActions({
    initiative,
    onToggleDisplay,
    onDelete,
}: InitiativeActionsProps) {
    return (
        <div className="flex items-center justify-end gap-1">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:outline-muted-foreground/50 h-8 w-8"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="min-w-40"
                    onClick={(event) => event.stopPropagation()}
                >
                    <DropdownMenuItem asChild>
                        <Link href={route('initiatives.edit', initiative.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={(event) => onToggleDisplay(initiative, event)}
                    >
                        {initiative.display ? (
                            <EyeOff className="mr-2 h-4 w-4" />
                        ) : (
                            <Eye className="mr-2 h-4 w-4" />
                        )}
                        <span>
                            {initiative.display
                                ? 'Hide from landing'
                                : 'Show on landing'}
                        </span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={(event) => onDelete(initiative, event)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex h-8 w-8 items-center justify-center">
                <ChevronRight className="text-muted-foreground hover:shadow-primary group-hover:text-primary group-hover:drop-shadow-primary h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:drop-shadow-sm" />
            </div>
        </div>
    );
}
