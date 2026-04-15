// resources/js/Pages/Skills/Partials/SkillsRow.tsx

import { useTranslation } from '@/common/i18n';
import { InfoBadge } from '@/components/badges';
import type { AdminSkillListItem } from '@/modules/skills/core/types';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';

import {
  InteractiveTableRow,
  TableActionCell,
  TableActionsMenu,
  TableActionsMenuItem,
  TableDateText,
  TableMetaCell,
  TableTitleCell,
} from '@/common/table';
import { Eye, Pencil, Tag, Trash2 } from 'lucide-react';
import React, { JSX } from 'react';

interface SkillsRowProps {
    skill: AdminSkillListItem;
    onRowClick(skill: AdminSkillListItem): void;
    onEdit(skill: AdminSkillListItem, event?: React.MouseEvent): void;
    onDelete(skill: AdminSkillListItem, event?: React.MouseEvent): void;
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
            <InfoBadge tone="muted" className="flex items-center gap-1 px-2">
                <Tag className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{categoryLabel}</span>
                <span className="sm:hidden">{categoryLabel}</span>
            </InfoBadge>
        );
    }

    return (
        <InteractiveTableRow
            interactive
            variant="default"
            onActivate={() => onRowClick(skill)}
        >
            <TableTitleCell
                className="w-full max-w-0 min-w-0"
                title={skill.name}
            />

            <TableMetaCell
                className="w-px content-center pr-2 align-top text-xs whitespace-nowrap"
            >
                {renderCategory()}
            </TableMetaCell>

            <TableMetaCell className="hidden w-px text-center whitespace-nowrap sm:table-cell">
                <TableDateText
                    value={skill.created_at}
                    locale={locale}
                    todayAsTime
                    fallback={tForm('values.empty')}
                />
            </TableMetaCell>

            <TableMetaCell className="hidden w-px text-center whitespace-nowrap sm:table-cell">
                <TableDateText
                    value={skill.updated_at}
                    locale={locale}
                    todayAsTime
                    fallback={tForm('values.empty')}
                />
            </TableMetaCell>

            <TableActionCell className="content-center">
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
