// resources/js/Pages/Skills/Partials/SkillsRow.tsx

import { Skill } from '../../types';

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
import { MoreVertical, Pencil, Tag, Trash2 } from 'lucide-react';
import React, { JSX } from 'react';

interface SkillsRowProps {
    skill: Skill;
    onEdit(skill: Skill, event?: React.MouseEvent): void;
    onDelete(skill: Skill, event?: React.MouseEvent): void;
}

/**
 * SkillsRow renders a single skill row with category and actions.
 */
export function SkillsRow({
    skill,
    onEdit,
    onDelete,
}: SkillsRowProps) {
    const updatedLabel = formatUpdatedAt(skill.updated_at);
    const categoryLabel = skill.category?.name ?? 'Uncategorized';

    function handleEdit(event: React.MouseEvent): void {
        event.stopPropagation();
        onEdit(skill, event);
    }

    function handleDelete(event: React.MouseEvent): void {
        event.stopPropagation();
        onDelete(skill, event);
    }

    function renderCategory(): JSX.Element {
        return (
            <Badge className="bg-muted text-muted-foreground flex w-fit cursor-default items-center gap-1 border-none px-2 py-0.5 text-xs font-medium whitespace-nowrap">
                <Tag className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{categoryLabel}</span>
                <span className="sm:hidden">{categoryLabel}</span>
            </Badge>
        );
    }

    return (
        <TableRow className={rowClassName()}>
            <TableCell className="min-w-0 content-center pr-2 align-top sm:w-48">
                <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="line-clamp-1 min-w-0 truncate font-medium text-pretty hyphens-auto">
                        {skill.name}
                    </p>
                </div>
            </TableCell>

            <TableCell className="content-center pr-2 align-top text-xs sm:w-40">
                {renderCategory()}
            </TableCell>

            <TableCell className="content-center pr-2 text-center align-top text-xs sm:w-32">
                <span className="block whitespace-nowrap">{updatedLabel}</span>
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
                            <DropdownMenuItem onClick={handleEdit}>
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={handleDelete}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </TableCell>
        </TableRow>
    );
}

function formatUpdatedAt(value: string | null | undefined): string {
    if (!value) {
        return '—';
    }

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

function rowClassName(): string {
    const base =
        'group min-w-0 content-center cursor-default transition-colors duration-150 md:gap-10';
    const background =
        'bg-background hover:bg-muted/60 dark:bg-background dark:hover:bg-muted/40';

    return `${base} ${background}`;
}
