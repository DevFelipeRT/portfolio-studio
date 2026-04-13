import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { SearchField } from '@/common/filtering';
import {
  PageHead,
  PageLink,
  pageRouter,
  useCurrentPage,
} from '@/common/page-runtime';
import {
  NewButton,
  serializeTableQueryParams,
  setTablePageInQueryParams,
  setTablePerPageInQueryParams,
  setTableSortInQueryParams,
  TableCard,
  TableToolbar,
  toggleTableSortState,
  type TablePaginated,
  type TableSortState,
} from '@/common/table';
import { Button } from '@/components/ui/button';
import type {
  AdminSkillCategoryRecord,
  AdminSkillListItem,
} from '@/modules/skills/core/types';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';
import { SkillOverlay } from '@/modules/skills/ui/SkillOverlay';
import { SkillsTable } from '@/modules/skills/ui/table/SkillsTable';
import { type FormEvent, useEffect, useState } from 'react';

interface SkillsIndexProps {
  skills: TablePaginated<AdminSkillListItem>;
  categories: AdminSkillCategoryRecord[];
  filters: {
    per_page?: number | null;
    search?: string | null;
    category?: number | null;
    sort?: string | null;
    direction?: string | null;
  };
}

const SKILL_PER_PAGE_OPTIONS = [15, 30, 50] as const;
const SKILL_SORTABLE_COLUMNS = {
  name: true,
  category: true,
  created_at: true,
  updated_at: true,
} as const;

export default function Index({
  skills,
  categories,
  filters,
}: SkillsIndexProps) {
  const [selectedSkill, setSelectedSkill] = useState<AdminSkillListItem | null>(null);
  const currentPage = useCurrentPage();
  const { translate: tActions } = useSkillsTranslation(
    SKILLS_NAMESPACES.actions,
  );
  const { translate: tSections } = useSkillsTranslation(
    SKILLS_NAMESPACES.sections,
  );
  const { translate: tForm } = useSkillsTranslation(SKILLS_NAMESPACES.form);
  const appliedSearch =
    typeof filters.search === 'string' ? filters.search : '';
  const appliedCategoryId =
    typeof filters.category === 'number' && filters.category > 0
      ? filters.category
      : null;
  const sortState: TableSortState = {
    column: typeof filters.sort === 'string' ? filters.sort : null,
    direction:
      filters.direction === 'asc' || filters.direction === 'desc'
        ? filters.direction
        : null,
  };
  const currentPerPage =
    typeof filters.per_page === 'number' && filters.per_page > 0
      ? filters.per_page
      : skills.per_page;
  const hasAppliedFilters = appliedSearch !== '' || appliedCategoryId !== null;
  const emptyStateMessage = hasAppliedFilters
    ? tForm('emptyState.filteredSkills')
    : tForm('emptyState.skills');
  const [draftSearch, setDraftSearch] = useState(appliedSearch);
  const [draftCategory, setDraftCategory] = useState(
    appliedCategoryId === null ? '' : String(appliedCategoryId),
  );

  // Keep the form draft aligned with the applied table query after navigation.
  useEffect(() => {
    setDraftSearch(appliedSearch);
  }, [appliedSearch, currentPage.url]);

  useEffect(() => {
    setDraftCategory(
      appliedCategoryId === null ? '' : String(appliedCategoryId),
    );
  }, [appliedCategoryId, currentPage.url]);

  const handleEdit = (skill: AdminSkillListItem): void => {
    pageRouter.get(route('skills.edit', skill.id));
  };

  const handleDelete = (skill: AdminSkillListItem, event?: React.MouseEvent): void => {
    event?.stopPropagation();

    if (!window.confirm(tActions('confirmDeleteSkill'))) {
      return;
    }

    pageRouter.delete(route('skills.destroy', {
      skill: skill.id,
      ...buildSkillsIndexQueryParams({
        search: appliedSearch,
        category: appliedCategoryId,
        perPage: currentPerPage,
        sort: sortState,
        page: skills.current_page,
      }),
    }), {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const handlePageChange = (page: number): void => {
    pageRouter.get(
      route('skills.index'),
      setTablePageInQueryParams(
        buildSkillsIndexQueryParams({
          search: appliedSearch,
          category: appliedCategoryId,
          perPage: currentPerPage,
          sort: sortState,
        }),
        page,
      ),
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  const handlePerPageChange = (perPage: number): void => {
    pageRouter.get(
      route('skills.index'),
      setTablePerPageInQueryParams(
        buildSkillsIndexQueryParams({
          search: appliedSearch,
          category: appliedCategoryId,
          sort: sortState,
        }),
        perPage,
      ),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  };

  const handleSortChange = (column: string): void => {
    pageRouter.get(
      route('skills.index'),
      setTableSortInQueryParams(
        serializeTableQueryParams({
          per_page: currentPerPage,
          search: appliedSearch,
          category: appliedCategoryId,
        }),
        toggleTableSortState(sortState, column),
      ),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    pageRouter.get(
      route('skills.index'),
      buildSkillsIndexQueryParams({
        search: draftSearch,
        category: draftCategory,
        perPage: currentPerPage,
        sort: sortState,
      }),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  };

  const handleResetFilters = (): void => {
    setDraftSearch('');
    setDraftCategory('');

    pageRouter.get(
      route('skills.index'),
      buildSkillsIndexQueryParams({
        search: '',
        category: '',
        perPage: currentPerPage,
        sort: sortState,
      }),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  };

  return (
    <AuthenticatedLayout>
      <PageHead title={tSections('managementTitle')} />

      <PageContent
        className="space-y-10 overflow-hidden py-8"
        pageWidth="container"
      >
        <div>
          <div>
            <h1 className="text-xl leading-tight font-semibold">
              {tSections('managementTitle')}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {tForm('help.managementSubtitle')}
            </p>
          </div>
        </div>

        <SkillsTable
          skills={skills}
          items={skills.data}
          onRowClick={(skill) => setSelectedSkill(skill)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyStateMessage={emptyStateMessage}
          header={
            <TableToolbar className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <form
                className="flex w-full flex-col gap-3 md:flex-row md:items-center"
                onSubmit={handleSearchSubmit}
              >
                <SearchField
                  className="w-full md:max-w-md"
                  aria-label={tForm('filters.searchLabel')}
                  value={draftSearch}
                  onChange={(event) =>
                    setDraftSearch(event.currentTarget.value)
                  }
                  placeholder={tForm('filters.searchPlaceholder')}
                  buttonLabel={tForm('filters.searchSubmit')}
                />

                <select
                  aria-label={tForm('filters.categoryLabel')}
                  className="border-input bg-background ring-offset-background focus-visible:ring-ring placeholder:text-muted-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:max-w-xs"
                  value={draftCategory}
                  onChange={(event) =>
                    setDraftCategory(event.currentTarget.value)
                  }
                >
                  <option value="">{tForm('filters.categoryPlaceholder')}</option>
                  {categories.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </form>

              <div className="flex items-center gap-2 self-end lg:self-auto">
                {hasAppliedFilters ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                  >
                    {tForm('filters.reset')}
                  </Button>
                ) : null}

                <NewButton
                  href={route('skills.create')}
                  label={tActions('newSkill')}
                />
              </div>
            </TableToolbar>
          }
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSortChange={handleSortChange}
          perPageOptions={SKILL_PER_PAGE_OPTIONS}
          sort={sortState}
          sortableColumns={SKILL_SORTABLE_COLUMNS}
        />

        <TableCard
          header={
            <TableToolbar className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-lg leading-tight font-semibold">
                  {tForm('sections.categoriesTitle')}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {tForm('help.categoriesDescription')}
                </p>
              </div>

              <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <PageLink href={route('skill-categories.index')}>
                    {tActions('manageCategories')}
                  </PageLink>
                </Button>

                <NewButton
                  href={route('skill-categories.create')}
                  label={tActions('newCategory')}
                  className="w-full justify-center sm:w-auto"
                />
              </div>
            </TableToolbar>
          }
          contentClassName="p-4"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {tForm('help.categoriesSummary')}: {categories.length}
            </p>
            <p className="text-muted-foreground text-sm">
              {tForm('help.categoriesStandaloneHint')}
            </p>
          </div>
        </TableCard>

        <SkillOverlay
          open={selectedSkill !== null}
          skill={selectedSkill}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedSkill(null);
            }
          }}
        />
      </PageContent>
    </AuthenticatedLayout>
  );
}

Index.i18n = ['skills'];

function buildSkillsIndexQueryParams({
  search,
  category,
  perPage,
  sort,
  page,
}: {
  search: string;
  category: string | number | null;
  perPage?: number;
  sort: TableSortState;
  page?: number;
}): Record<string, string> {
  const query = setTableSortInQueryParams(
    serializeTableQueryParams({
      search,
      category,
      per_page: perPage,
    }),
    sort,
  );

  return page && page > 1 ? setTablePageInQueryParams(query, page) : query;
}
