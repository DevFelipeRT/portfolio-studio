import { useTranslation } from '@/common/i18n';
import { pageRouter } from '@/common/page-runtime';
import {
  InteractiveTableRow,
  SystemTable,
  TableActionCell,
  TableActionsMenu,
  TableActionsMenuItem,
  TableCard,
  TableDateText,
  TableEmptyState,
  TableHeaderRow,
  TableMetaCell,
  TablePagination,
  TableSortHeader,
  type TablePaginated,
  type TableSortState,
  tablePresets,
  TableTitleCell,
} from '@/common/table';
import { TableBody, TableHead, TableHeader } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { AdminSkillCategoryRecord } from '@/modules/skills/core/types';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';
import { SkillCategoryOverlay } from '@/modules/skills/ui/SkillCategoryOverlay';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

type SkillCategorySortKey = 'name' | 'slug' | 'updated_at';

type SkillCategoriesSectionProps = {
  categories?: AdminSkillCategoryRecord[];
  paginatedCategories?: TablePaginated<AdminSkillCategoryRecord>;
  header?: React.ReactNode;
  emptyStateMessage?: React.ReactNode;
  deleteQuery?: Record<string, string>;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onSortChange?: (column: string) => void;
  perPageOptions?: readonly number[];
  sort?: TableSortState;
  sortableColumns?: Partial<Record<SkillCategorySortKey, boolean>>;
};

export function SkillCategoriesTable({
  categories,
  paginatedCategories,
  header,
  emptyStateMessage,
  deleteQuery,
  onPageChange,
  onPerPageChange,
  onSortChange,
  perPageOptions,
  sort = { column: null, direction: null },
  sortableColumns = {},
}: SkillCategoriesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<AdminSkillCategoryRecord | null>(
    null,
  );
  const { locale } = useTranslation();
  const { translate: tActions } = useSkillsTranslation(
    SKILLS_NAMESPACES.actions,
  );
  const { translate: tForm } = useSkillsTranslation(SKILLS_NAMESPACES.form);
  const items = paginatedCategories?.data ?? categories ?? [];
  const hasCategories = items.length > 0;
  const baseClass = tablePresets.headerCell;
  const columnCount = 4;

  const handleEdit = (category: AdminSkillCategoryRecord): void => {
    pageRouter.get(route('skill-categories.edit', category.id));
  };

  const handleDelete = (
    category: AdminSkillCategoryRecord,
    event?: React.MouseEvent,
  ): void => {
    event?.stopPropagation();

    if (
      !window.confirm(tActions('confirmDeleteCategory'))
    ) {
      return;
    }

    pageRouter.delete(route('skill-categories.destroy', {
      skillCategory: category.id,
      ...(deleteQuery ?? {}),
    }));
  };

  return (
    <TableCard header={header}>
      <SystemTable className="min-w-[34rem]" layout="auto">
        <TableHeader>
          <TableHeaderRow>
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
              />
            </TableHead>
            <TableHead
              className={cn(baseClass, 'w-px whitespace-nowrap')}
              aria-sort={resolveAriaSort(sort, 'slug', sortableColumns)}
            >
              <TableSortHeader
                column="slug"
                label={tForm('fields.slug.label')}
                srLabel={tForm('fields.slug.label')}
                sort={sort}
                disabled={!isColumnSortable('slug', sortableColumns)}
                onToggleSort={onSortChange}
                truncateLabel={false}
              />
            </TableHead>
            <TableHead
              className={cn(baseClass, 'w-px whitespace-nowrap')}
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
              />
            </TableHead>
            <TableHead className={cn(baseClass, 'w-16 text-right')}>
              <span className="sr-only">{tForm('fields.actions.label')}</span>
            </TableHead>
          </TableHeaderRow>
        </TableHeader>

        <TableBody>
          {!hasCategories && (
            <TableEmptyState
              colSpan={columnCount}
              message={emptyStateMessage ?? tForm('emptyState.categories')}
            />
          )}

          {items.map((category) => {
            return (
              <InteractiveTableRow
                key={category.id}
                interactive
                onActivate={() => setSelectedCategory(category)}
              >
                <TableTitleCell title={category.name} />

                <TableMetaCell className="font-mono text-[0.7rem]">
                  {category.slug}
                </TableMetaCell>

                <TableMetaCell>
                  <TableDateText
                    value={category.updated_at}
                    locale={locale}
                    fallback={tForm('values.empty')}
                  />
                </TableMetaCell>

                <TableActionCell>
                  <TableActionsMenu
                    triggerLabel={tForm('fields.actions.label')}
                  >
                    <TableActionsMenuItem
                      onClick={() => setSelectedCategory(category)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      <span>{tActions('viewDetails')}</span>
                    </TableActionsMenuItem>
                    <TableActionsMenuItem onClick={() => handleEdit(category)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>{tActions('editSkillCategory')}</span>
                    </TableActionsMenuItem>
                    <TableActionsMenuItem
                      onClick={(event) => handleDelete(category, event)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>{tActions('delete')}</span>
                    </TableActionsMenuItem>
                  </TableActionsMenu>
                </TableActionCell>
              </InteractiveTableRow>
            );
          })}
        </TableBody>
      </SystemTable>

      {paginatedCategories ? (
        <TablePagination
          pagination={paginatedCategories}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
          perPageOptions={perPageOptions}
          showPageLinks
        />
      ) : null}

      <SkillCategoryOverlay
        open={selectedCategory !== null}
        category={selectedCategory}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCategory(null);
          }
        }}
      />
    </TableCard>
  );
}

function resolveAriaSort(
  sort: TableSortState,
  column: SkillCategorySortKey,
  sortableColumns: Partial<Record<SkillCategorySortKey, boolean>>,
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
  column: SkillCategorySortKey,
  sortableColumns: Partial<Record<SkillCategorySortKey, boolean>>,
): boolean {
  return sortableColumns[column] !== false;
}
