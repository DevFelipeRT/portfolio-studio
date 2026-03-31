// resources/js/Pages/Skills/Partials/SkillsTable.tsx

import type { AdminSkillListItem } from '@/modules/skills/core/types';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';
import type { ReactNode } from 'react';
import { SkillsRow } from './SkillsRow';

import {
    SystemTable,
    TableCard,
    TableEmptyState,
    TableHeaderRow,
    TablePagination,
    TableSortHeader,
    type TablePaginated,
    type TableSortState,
    tablePresets,
} from '@/common/table';
import {
    TableBody,
    TableHead,
    TableHeader,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type SkillsSortKey = 'name' | 'category' | 'created_at' | 'updated_at';

interface SkillsTableProps {
    skills?: TablePaginated<AdminSkillListItem>;
    items: AdminSkillListItem[];
    onRowClick(skill: AdminSkillListItem): void;
    onEdit(skill: AdminSkillListItem, event?: React.MouseEvent): void;
    onDelete(skill: AdminSkillListItem, event?: React.MouseEvent): void;
    header?: ReactNode;
    emptyStateMessage?: ReactNode;
    onPageChange?: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
    onSortChange?: (column: string) => void;
    perPageOptions?: readonly number[];
    sort?: TableSortState;
    sortableColumns?: Partial<Record<SkillsSortKey, boolean>>;
}

/**
 * SkillsTable renders the catalog table with headers and rows.
 */
export function SkillsTable({
    skills,
    items,
    onRowClick,
    onEdit,
    onDelete,
    header,
    emptyStateMessage,
    onPageChange,
    onPerPageChange,
    onSortChange,
    perPageOptions,
    sort = { column: null, direction: null },
    sortableColumns = {},
}: SkillsTableProps) {
    const { translate: tForm } = useSkillsTranslation(SKILLS_NAMESPACES.form);
    const baseClass = tablePresets.headerCell;
    const columnCount = 5;
    const headerLabelClassName = 'whitespace-nowrap';

    return (
        <TableCard header={header}>
            <SystemTable layout="auto">
                <TableHeader>
                    <TableHeaderRow className="min-w-0">
                        <TableHead
                            className={cn(baseClass, 'w-full min-w-0')}
                            aria-sort={resolveAriaSort(sort, 'name', sortableColumns)}
                        >
                            <TableSortHeader
                                column="name"
                                label={tForm('fields.name.label')}
                                srLabel={tForm('fields.name.label')}
                                sort={sort}
                                disabled={!isColumnSortable('name', sortableColumns)}
                                onToggleSort={onSortChange}
                                truncateLabel={false}
                                labelClassName={headerLabelClassName}
                            />
                        </TableHead>

                        <TableHead
                            className={cn(
                                baseClass,
                                'w-px text-left whitespace-nowrap',
                            )}
                            aria-sort={resolveAriaSort(sort, 'category', sortableColumns)}
                        >
                            <TableSortHeader
                                column="category"
                                label={tForm('fields.category.label')}
                                srLabel={tForm('fields.category.label')}
                                sort={sort}
                                disabled={!isColumnSortable('category', sortableColumns)}
                                onToggleSort={onSortChange}
                                truncateLabel={false}
                                labelClassName={headerLabelClassName}
                            />
                        </TableHead>

                        <TableHead
                            className={cn(
                                baseClass,
                                'hidden w-px text-center whitespace-nowrap sm:table-cell',
                            )}
                            aria-sort={resolveAriaSort(sort, 'created_at', sortableColumns)}
                        >
                            <TableSortHeader
                                column="created_at"
                                label={tForm('fields.created_at.label')}
                                srLabel={tForm('fields.created_at.label')}
                                sort={sort}
                                disabled={!isColumnSortable('created_at', sortableColumns)}
                                onToggleSort={onSortChange}
                                truncateLabel={false}
                                labelClassName={headerLabelClassName}
                            />
                        </TableHead>

                        <TableHead
                            className={cn(
                                baseClass,
                                'hidden w-px text-center whitespace-nowrap sm:table-cell',
                            )}
                            aria-sort={resolveAriaSort(sort, 'updated_at', sortableColumns)}
                        >
                            <TableSortHeader
                                column="updated_at"
                                label={tForm('fields.updated_at.label')}
                                srLabel={tForm('fields.updated_at.label')}
                                sort={sort}
                                disabled={!isColumnSortable('updated_at', sortableColumns)}
                                onToggleSort={onSortChange}
                                truncateLabel={false}
                                labelClassName={headerLabelClassName}
                            />
                        </TableHead>

                        <TableHead
                            className={cn(
                                baseClass,
                                'w-px text-right whitespace-nowrap',
                            )}
                        >
                            <span className="sr-only">{tForm('table.menu')}</span>
                        </TableHead>
                    </TableHeaderRow>
                </TableHeader>

                <TableBody>
                    {items.length === 0 ? (
                        <TableEmptyState
                            colSpan={columnCount}
                            message={emptyStateMessage ?? tForm('emptyState.skills')}
                        />
                    ) : null}

                    {items.map((skill) => (
                        <SkillsRow
                            key={skill.id}
                            skill={skill}
                            onRowClick={onRowClick}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </TableBody>
            </SystemTable>

            {skills ? (
                <TablePagination
                    pagination={skills}
                    onPageChange={onPageChange}
                    perPageOptions={perPageOptions}
                    onPerPageChange={onPerPageChange}
                    showPageLinks
                />
            ) : null}
        </TableCard>
    );
}

function resolveAriaSort(
    sort: TableSortState,
    column: SkillsSortKey,
    sortableColumns: Partial<Record<SkillsSortKey, boolean>>,
): 'ascending' | 'descending' | 'none' {
    if (!isColumnSortable(column, sortableColumns)) {
        return 'none';
    }

    if (sort.column !== column) {
        return 'none';
    }

    return sort.direction === 'desc' ? 'descending' : 'ascending';
}

function isColumnSortable(
    column: SkillsSortKey,
    sortableColumns: Partial<Record<SkillsSortKey, boolean>>,
): boolean {
    return sortableColumns[column] !== false;
}
