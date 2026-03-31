// resources/js/Pages/Skills/Partials/SkillsRow.tsx

import { useTranslation } from '@/common/i18n';
import type { Skill } from '@/modules/skills/core/types';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';

import {
  InteractiveTableRow,
  TableActionCell,
  TableActionsMenu,
  TableActionsMenuItem,
  TableBadge,
  TableDateText,
  TableMetaCell,
  TableTitleCell,
} from '@/common/table';
import { Eye, Pencil, Tag, Trash2 } from 'lucide-react';
import React, { JSX } from 'react';

interface SkillsRowProps {
    skill: Skill;
    onRowClick(skill: Skill): void;
    onEdit(skill: Skill, event?: React.MouseEvent): void;
    onDelete(skill: Skill, event?: React.MouseEvent): void;
}

/**
 * SkillsRow renders a single skill row with category and actions.
 */
export function SkillsRow({
    skill,
    onRowClick,
    onEdit,
    onDelete,
}: SkillsRowProps) {
    const { locale } = useTranslation();
    const { translate: tActions } = useSkillsTranslation(SKILLS_NAMESPACES.actions);
    const { translate: tForm } = useSkillsTranslation(SKILLS_NAMESPACES.form);
    const categoryLabel =
        skill.category?.name ?? tForm('fields.category.uncategorized');

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
            <TableBadge className="bg-muted text-muted-foreground flex w-fit items-center gap-1 border-none px-2 py-0.5 font-medium whitespace-nowrap">
                <Tag className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{categoryLabel}</span>
                <span className="sm:hidden">{categoryLabel}</span>
            </TableBadge>
        );
    }

    return (
        <InteractiveTableRow
            interactive
            variant="default"
            onActivate={() => onRowClick(skill)}
        >
            <TableTitleCell className="sm:w-48" title={skill.name} />

            <TableMetaCell
                className="content-center pr-2 align-top text-xs sm:w-40"
            >
                {renderCategory()}
            </TableMetaCell>

            <TableMetaCell className="text-center sm:w-32">
                <TableDateText
                    value={skill.created_at}
                    locale={locale}
                    todayAsTime
                    fallback={tForm('values.empty')}
                />
            </TableMetaCell>

            <TableMetaCell className="text-center sm:w-32">
                <TableDateText
                    value={skill.updated_at}
                    locale={locale}
                    todayAsTime
                    fallback={tForm('values.empty')}
                />
            </TableMetaCell>

            <TableActionCell className="content-center sm:w-12">
                <TableActionsMenu triggerLabel={tActions('openMenu')}>
                    <TableActionsMenuItem onClick={() => onRowClick(skill)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>{tActions('viewDetails', 'View details')}</span>
                    </TableActionsMenuItem>

                    <TableActionsMenuItem onClick={handleEdit}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>{tActions('editSkill')}</span>
                    </TableActionsMenuItem>

                    <TableActionsMenuItem
                        onClick={handleDelete}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>{tActions('delete')}</span>
                    </TableActionsMenuItem>
                </TableActionsMenu>
            </TableActionCell>
        </InteractiveTableRow>
    );
}
