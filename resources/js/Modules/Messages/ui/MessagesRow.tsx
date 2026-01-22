// resources/js/Pages/Messages/Partials/MessagesRow.tsx

import type { Message } from '@/Modules/Messages/core/types';

import { Badge } from '@/Components/Ui/badge';
import { Button } from '@/Components/Ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/Ui/dropdown-menu';
import { TableCell, TableRow } from '@/Components/Ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    CheckCircle2,
    ChevronRight,
    CircleDot,
    Minus,
    MoreVertical,
    RotateCcw,
    Star,
    Trash2,
} from 'lucide-react';
import React, { JSX } from 'react';

interface MessagesRowProps {
    message: Message;
    onRowClick(message: Message): void;
    onToggleImportant(message: Message, event?: React.MouseEvent): void;
    onToggleSeen(message: Message, event?: React.MouseEvent): void;
    onDelete(message: Message, event?: React.MouseEvent): void;
}

/**
 * MessagesRow renders a single message row with status and actions.
 */
export function MessagesRow({
    message,
    onRowClick,
    onToggleImportant,
    onToggleSeen,
    onDelete,
}: MessagesRowProps) {
    const whenLabel = formatWhen(message.created_at);

    function handleRowClick(): void {
        onRowClick(message);
    }

    function handleKeyDown(
        event: React.KeyboardEvent<HTMLTableRowElement>,
    ): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onRowClick(message);
        }
    }

    function renderStatus(): JSX.Element {
        const isNew = !message.seen;

        return (
            <div className="xs:flex-row pointer-events-none flex w-full flex-col items-center gap-2 text-[0.7rem] sm:flex-nowrap">
                <Badge
                    className={
                        (isNew
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground') +
                        ' flex w-fit cursor-default items-center gap-1 border-none px-2 py-0.5 font-medium whitespace-nowrap'
                    }
                >
                    {isNew ? (
                        <>
                            <CircleDot className="h-3.5 w-3.5" />
                            <span className="hidden whitespace-nowrap sm:inline">
                                New
                            </span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span className="hidden whitespace-nowrap sm:inline">
                                Seen
                            </span>
                        </>
                    )}
                </Badge>

                <Badge
                    className={
                        (message.important
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground') +
                        ' flex w-fit cursor-default items-center gap-1 border-none px-2 py-0.5 font-medium whitespace-nowrap'
                    }
                >
                    {message.important ? (
                        <>
                            <Star className="h-3.5 w-3.5" />
                            <span className="ml-1 hidden whitespace-nowrap sm:inline">
                                Important
                            </span>
                        </>
                    ) : (
                        <>
                            <Minus className="h-3.5 w-3.5 sm:hidden" />
                            <span className="hidden whitespace-nowrap sm:inline">
                                Regular
                            </span>
                        </>
                    )}
                </Badge>
            </div>
        );
    }

    return (
        <TableRow
            className={rowClassName(message)}
            role="button"
            tabIndex={0}
            onClick={handleRowClick}
            onKeyDown={handleKeyDown}
        >
            <TableCell className="min-w-0 content-center pr-2 align-top sm:w-48">
                <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="line-clamp-1 min-w-0 truncate font-medium text-pretty hyphens-auto">
                        {message.name}
                    </p>
                    <p className="text-muted-foreground line-clamp-1 min-w-0 truncate text-xs text-pretty hyphens-auto">
                        {message.email}
                    </p>
                </div>
            </TableCell>

            <TableCell className="hidden content-center align-top sm:table-cell">
                <span className="text-muted-foreground block truncate text-sm">
                    {truncate(message.message, 80)}
                </span>
            </TableCell>

            <TableCell className="content-center pr-2 align-top text-xs sm:w-32">
                {renderStatus()}
            </TableCell>

            <TableCell className="text-muted-foreground content-center pr-2 text-right align-top text-xs">
                <span className="block whitespace-nowrap">{whenLabel}</span>
            </TableCell>

            <TableCell className="content-center align-top sm:w-12">
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
                            <DropdownMenuItem
                                onClick={(event) =>
                                    onToggleImportant(message, event)
                                }
                            >
                                <Star className="mr-2 h-4 w-4" />
                                <span>
                                    {message.important
                                        ? 'Remove important'
                                        : 'Mark as important'}
                                </span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={(event) =>
                                    onToggleSeen(message, event)
                                }
                            >
                                {message.seen ? (
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                ) : (
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                )}
                                <span>
                                    {message.seen
                                        ? 'Mark as new'
                                        : 'Mark as seen'}
                                </span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={(event) => onDelete(message, event)}
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
            </TableCell>
        </TableRow>
    );
}

function truncate(text: string, maxLength: number): string {
    const trimmed = text.trim();

    if (trimmed.length <= maxLength) {
        return trimmed;
    }

    return `${trimmed.slice(0, maxLength - 1)}…`;
}

function formatWhen(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    const now = new Date();

    const isSameDay =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();

    const isMobile = useIsMobile();

    if (isSameDay) {
        return date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    if (isMobile) {
        return date.toLocaleDateString(undefined, {
            day: '2-digit',
            month: '2-digit',
        });
    }

    return date.toLocaleDateString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function rowClassName(message: Message): string {
    const base =
        'group cursor-pointer transition-colors content-center min-w-0 duration-150 md:gap-10';

    const background = message.seen
        ? 'bg-background hover:bg-muted/60 dark:bg-background dark:hover:bg-muted/40'
        : 'bg-muted/60 hover:bg-muted dark:bg-muted/50 dark:hover:bg-muted/70';

    const importantBorder = message.important
        ? 'border-l-4 border-l-primary/70'
        : 'border-l border-l-transparent';

    return `${base} ${background} ${importantBorder}`;
}
