import { Initiative } from './InitiativeOverlay';

import { Badge } from '@/Components/Ui/badge';
import { Button } from '@/Components/Ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/Ui/dropdown-menu';
import { TableCell, TableRow } from '@/Components/Ui/table';
import {
    ChevronRight,
    Eye,
    EyeOff,
    ImageIcon,
    MoreVertical,
    Trash2,
} from 'lucide-react';
import React from 'react';
import { InitiativeActions } from './InitiativeActions';

interface InitiativesRowProps {
    initiative: Initiative;
    onRowClick(initiative: Initiative): void;
    onToggleDisplay(initiative: Initiative, event?: React.MouseEvent): void;
    onDelete(initiative: Initiative, event?: React.MouseEvent): void;
}

/**
 * InitiativesRow renders a single initiative row with date or period and actions.
 */
export function InitiativesRow({
    initiative,
    onRowClick,
    onToggleDisplay,
    onDelete,
}: InitiativesRowProps) {
    const period = buildPeriodDisplay(
        initiative.start_date,
        initiative.end_date,
    );
    const hasImages = initiative.images.length > 0;

    function handleRowClick(): void {
        onRowClick(initiative);
    }

    function handleKeyDown(
        event: React.KeyboardEvent<HTMLTableRowElement>,
    ): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onRowClick(initiative);
        }
    }

    return (
        <TableRow
            className={rowClassName(initiative)}
            role="button"
            tabIndex={0}
            onClick={handleRowClick}
            onKeyDown={handleKeyDown}
        >
            <TableCell className="min-w-0 content-center pr-2 align-top sm:w-64">
                <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="line-clamp-1 min-w-0 truncate font-medium text-pretty hyphens-auto">
                        {initiative.name}
                    </p>
                    <p className="text-muted-foreground line-clamp-1 min-w-0 truncate text-xs text-pretty hyphens-auto">
                        {initiative.short_description}
                    </p>
                </div>
            </TableCell>

            <TableCell className="text-muted-foreground content-center pr-2 align-top text-xs sm:w-44">
                {!period.isPeriod && (
                    <span className="block whitespace-nowrap">
                        {period.singleLabel}
                    </span>
                )}

                {period.isPeriod && (
                    <div className="flex min-w-0 flex-col gap-0.5">
                        <p className="whitespace-nowrap">
                            <span className="text-muted-foreground/80 mr-1">
                                From:
                            </span>
                            <span>{period.fromLabel}</span>
                        </p>
                        <p className="whitespace-nowrap">
                            <span className="text-muted-foreground/80 mr-1">
                                To:
                            </span>
                            <span>{period.toLabel}</span>
                        </p>
                    </div>
                )}
            </TableCell>

            <TableCell className="content-center pr-2 align-top text-xs sm:w-32">
                <Badge
                    className={
                        (initiative.display
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground') +
                        ' flex w-fit cursor-default items-center gap-1 border-none px-2 py-0.5 font-medium whitespace-nowrap'
                    }
                >
                    {initiative.display ? (
                        <>
                            <Eye className="h-3.5 w-3.5" />
                            <span className="hidden whitespace-nowrap sm:inline">
                                Visible
                            </span>
                        </>
                    ) : (
                        <>
                            <EyeOff className="h-3.5 w-3.5" />
                            <span className="hidden whitespace-nowrap sm:inline">
                                Hidden
                            </span>
                        </>
                    )}
                </Badge>
            </TableCell>

            <TableCell className="text-muted-foreground content-center pr-2 align-top text-xs sm:w-24">
                <div className="flex items-center gap-1">
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span className="text-xs whitespace-nowrap">
                        {hasImages ? initiative.images.length : 0}
                    </span>
                </div>
            </TableCell>

            <TableCell className="content-center align-top sm:w-24">
                <InitiativeActions
                    initiative={initiative}
                    onToggleDisplay={onToggleDisplay}
                    onDelete={onDelete}
                />
            </TableCell>
        </TableRow>
    );
}

type PeriodDisplay =
    | {
          isPeriod: false;
          singleLabel: string;
          fromLabel: null;
          toLabel: null;
      }
    | {
          isPeriod: true;
          singleLabel: null;
          fromLabel: string;
          toLabel: string;
      };

function buildPeriodDisplay(start: string, end: string | null): PeriodDisplay {
    if (!start) {
        return {
            isPeriod: false,
            singleLabel: '-',
            fromLabel: null,
            toLabel: null,
        };
    }

    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;

    if (Number.isNaN(startDate.getTime())) {
        return {
            isPeriod: false,
            singleLabel: '-',
            fromLabel: null,
            toLabel: null,
        };
    }

    const startLabel = startDate.toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    if (!endDate || Number.isNaN(endDate.getTime()) || end === start) {
        return {
            isPeriod: false,
            singleLabel: startLabel,
            fromLabel: null,
            toLabel: null,
        };
    }

    const toLabel = endDate.toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    return {
        isPeriod: true,
        singleLabel: null,
        fromLabel: startLabel,
        toLabel,
    };
}

function rowClassName(initiative: Initiative): string {
    const base =
        'group cursor-pointer transition-colors content-center min-w-0 duration-150';

    const background = initiative.display
        ? 'bg-background hover:bg-muted/60 dark:bg-background dark:hover:bg-muted/40'
        : 'bg-muted/40 hover:bg-muted/60 dark:bg-muted/40 dark:hover:bg-muted/70';

    const border = initiative.display
        ? 'border-l-4 border-l-primary/70'
        : 'border-l border-l-transparent';

    return `${base} ${background} ${border}`;
}
