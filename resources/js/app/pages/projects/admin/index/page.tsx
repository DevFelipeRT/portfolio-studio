import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { PageHead, pageRouter } from '@/common/page-runtime';
import {
  NewButton,
  serializeTableQueryParams,
  setTablePageInQueryParams,
  setTablePerPageInQueryParams,
  setTableSortInQueryParams,
  TableSearchField,
  TableToolbar,
  toggleTableSortState,
  type TablePaginated,
  type TableSortState,
} from '@/common/table';
import { Button } from '@/components/ui/button';
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import {
  isProjectStatusValue,
  type ProjectStatusValue,
  useProjectStatusOptions,
} from '@/modules/projects/core/status';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import type { ProjectListItem } from '@/modules/projects/core/types';
import { ProjectOverlay } from '@/modules/projects/ui/ProjectOverlay';
import { ProjectsTable } from '@/modules/projects/ui/table/ProjectsTable';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ProjectsIndexProps {
  projects: TablePaginated<ProjectListItem>;
  filters: {
    per_page?: number | null;
    search?: string | null;
    status?: string | null;
    visibility?: string | null;
    sort?: string | null;
    direction?: string | null;
  };
}

const PROJECT_PER_PAGE_OPTIONS = [15, 30, 50] as const;
const PROJECT_SORTABLE_COLUMNS = {
  name: true,
  status: true,
  display: true,
  image_count: true,
} as const;

export default function Index({ projects, filters }: ProjectsIndexProps) {
  return <ProjectsIndexI18nContent projects={projects} filters={filters} />;
}

function ProjectsIndexI18nContent({ projects, filters }: ProjectsIndexProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectListItem | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const { translate: tSections } = useProjectsTranslation(
    PROJECTS_NAMESPACES.sections,
  );
  const { translate: tActions } = useProjectsTranslation(
    PROJECTS_NAMESPACES.actions,
  );
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const statusOptions = useProjectStatusOptions();
  const currentSearch =
    typeof filters.search === 'string' ? filters.search : '';
  const rawStatus =
    typeof filters.status === 'string' ? filters.status : null;
  const currentStatus: ProjectStatusValue | '' =
    rawStatus !== null && isProjectStatusValue(rawStatus) ? rawStatus : '';
  const currentVisibility =
    typeof filters.visibility === 'string' ? filters.visibility : '';
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
      : projects.per_page;
  const [search, setSearch] = useState(currentSearch);
  const [status, setStatus] = useState<ProjectStatusValue | ''>(currentStatus);
  const [visibility, setVisibility] = useState(currentVisibility);
  const hasAppliedFilters =
    currentSearch !== '' || currentStatus !== '' || currentVisibility !== '';
  const emptyStateMessage = hasAppliedFilters
    ? tForm('emptyState.filteredDescription')
    : tForm('emptyState.index');

  const handleRowClick = (project: ProjectListItem): void => {
    setSelectedProject(project);
    setOverlayOpen(true);
  };

  const handleOverlayChange = (open: boolean): void => {
    if (!open) {
      setOverlayOpen(false);
      setSelectedProject(null);
      return;
    }

    setOverlayOpen(true);
  };

  const handleDelete = (
    project: ProjectListItem,
    event?: React.MouseEvent,
  ): void => {
    event?.stopPropagation();

    if (!window.confirm(tActions('confirmDelete'))) {
      return;
    }

    pageRouter.delete(route('projects.destroy', project.id), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        if (selectedProject?.id === project.id) {
          setSelectedProject(null);
          setOverlayOpen(false);
        }
      },
    });
  };

  const handlePageChange = (page: number): void => {
    pageRouter.get(
      route('projects.index'),
      setTablePageInQueryParams(
        buildProjectsIndexQueryParams({
          search: currentSearch,
          status: currentStatus,
          visibility: currentVisibility,
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
      route('projects.index'),
      setTablePerPageInQueryParams(
        buildProjectsIndexQueryParams({
          search: currentSearch,
          status: currentStatus,
          visibility: currentVisibility,
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
      route('projects.index'),
      setTableSortInQueryParams(
        serializeTableQueryParams({
          per_page: currentPerPage,
          search: currentSearch,
          status: currentStatus,
          visibility: currentVisibility,
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

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    applyFilters(search, status, visibility);
  };

  const handleResetFilters = (): void => {
    setSearch('');
    setStatus('');
    setVisibility('');

    applyFilters('', '', '');
  };

  const applyFilters = (
    nextSearch: string,
    nextStatus: ProjectStatusValue | '',
    nextVisibility: string,
  ): void => {
    pageRouter.get(
      route('projects.index'),
      buildProjectsIndexQueryParams({
        search: nextSearch,
        status: nextStatus,
        visibility: nextVisibility,
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
    <>
      <PageHead title={tSections('managementTitle')} />

      <PageContent className="overflow-hidden py-8" pageWidth="container">
        <div className="mb-6">
          <ProjectsIndexHeader />
        </div>

        <ProjectsTable
          projects={projects}
          onRowClick={handleRowClick}
          onDelete={handleDelete}
          header={
            <TableToolbar className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <form
                className="flex w-full flex-col gap-3 md:flex-row md:items-center"
                onSubmit={handleSearchSubmit}
              >
                <TableSearchField
                  className="w-full md:min-w-0 md:flex-1"
                  aria-label={tForm('filters.searchLabel')}
                  value={search}
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  placeholder={tForm('filters.searchPlaceholder')}
                  buttonLabel={tForm('filters.searchSubmit')}
                />

                <FilterCombobox
                  ariaLabel={tForm('filters.statusLabel')}
                  className="w-full md:w-40 md:flex-none"
                  value={status}
                  placeholder={tForm('filters.statusPlaceholder')}
                  options={statusOptions}
                  onChange={(nextStatus) => {
                    const resolvedStatus = isProjectStatusValue(nextStatus)
                      ? nextStatus
                      : '';

                    setStatus(resolvedStatus);
                    applyFilters(search, resolvedStatus, visibility);
                  }}
                />

                <FilterCombobox
                  ariaLabel={tForm('filters.visibilityLabel')}
                  className="w-full md:w-44 md:flex-none"
                  value={visibility}
                  placeholder={tForm('filters.visibilityPlaceholder')}
                  options={[
                    {
                      value: 'public',
                      label: tForm('filters.publicOnly'),
                    },
                    {
                      value: 'private',
                      label: tForm('filters.privateOnly'),
                    },
                  ]}
                  onChange={(nextVisibility) => {
                    setVisibility(nextVisibility);
                    applyFilters(search, status, nextVisibility);
                  }}
                />
              </form>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {currentSearch !== '' ||
                currentStatus !== '' ||
                currentVisibility !== '' ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleResetFilters}
                  >
                    <X className="h-4 w-4" />
                    {tForm('filters.reset')}
                  </Button>
                ) : null}

                <NewButton
                  href={route('projects.create')}
                  label={tActions('newProject')}
                />
              </div>
            </TableToolbar>
          }
          emptyStateMessage={emptyStateMessage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSortChange={handleSortChange}
          perPageOptions={PROJECT_PER_PAGE_OPTIONS}
          sort={sortState}
          sortableColumns={PROJECT_SORTABLE_COLUMNS}
        />

        <ProjectOverlay
          open={overlayOpen}
          project={selectedProject}
          onOpenChange={handleOverlayChange}
        />
      </PageContent>
    </>
  );
}

Index.i18n = ['projects'];
Index.layout = (page: React.ReactNode) => (
  <AuthenticatedLayout>{page}</AuthenticatedLayout>
);

function ProjectsIndexHeader() {
  const { translate: tSections } = useProjectsTranslation(
    PROJECTS_NAMESPACES.sections,
  );
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);

  return (
    <div>
      <h1 className="text-xl leading-tight font-semibold">
        {tSections('managementTitle')}
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">
        {tForm('help.managementSubtitle')}
      </p>
    </div>
  );
}

function buildProjectsIndexQueryParams({
  search,
  status,
  visibility,
  perPage,
  sort,
}: {
  search: string;
  status: ProjectStatusValue | '';
  visibility: string;
  perPage?: number;
  sort: TableSortState;
}): Record<string, string> {
  return setTableSortInQueryParams(
    serializeTableQueryParams({
      search,
      status,
      visibility,
      per_page: perPage,
    }),
    sort,
  );
}

type FilterComboboxOption = {
  value: string;
  label: string;
};

type FilterComboboxProps = {
  ariaLabel: string;
  className?: string;
  value: string;
  placeholder: string;
  options: FilterComboboxOption[];
  onChange: (value: string) => void;
};

function FilterCombobox({
  ariaLabel,
  className,
  value,
  placeholder,
  options,
  onChange,
}: FilterComboboxProps) {
  const selectedOption =
    value === '' ? null : options.find((option) => option.value === value) ?? null;
  const [inputValue, setInputValue] = useState(selectedOption?.label ?? '');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const optionValues = options.map((option) => option.value);
  const labelByValue = new Map(
    options.map((option) => [option.value, option.label] as const),
  );

  useEffect(() => {
    setInputValue(selectedOption?.label ?? '');
  }, [selectedOption]);

  return (
    <Combobox
      items={optionValues}
      open={open}
      onOpenChange={setOpen}
      itemToStringLabel={(item) => labelByValue.get(item) ?? String(item)}
      itemToStringValue={(item) => String(item)}
      inputValue={inputValue}
      onInputValueChange={(nextValue, eventDetails) => {
        const reason = eventDetails.reason ?? '';

        if (reason === 'clear-press' || reason === 'input-clear') {
          setInputValue('');
          onChange('');
        } else {
          setInputValue(nextValue);
        }
      }}
      value={value === '' ? null : value}
      onValueChange={(nextValue, eventDetails) => {
        if (typeof nextValue === 'string') {
          setInputValue(labelByValue.get(nextValue) ?? nextValue);
          onChange(nextValue);
          return;
        }

        const reason = eventDetails.reason ?? '';

        if (reason === 'clear-press' || reason === 'input-clear') {
          setInputValue('');
          onChange('');
        }
      }}
    >
      <ComboboxInput
        ref={inputRef}
        aria-label={ariaLabel}
        className={[
          className,
          open ? 'border-ring ring-1 ring-ring' : '',
          '[&_[data-slot=input-group-addon]]:cursor-default',
          '[&_input]:cursor-default',
        ]
          .filter(Boolean)
          .join(' ')}
        placeholder={placeholder}
        readOnly
        showClear={value !== ''}
        showTrigger
        onMouseDown={(event) => {
          event.preventDefault();
          setOpen((currentOpen) => !currentOpen);
          requestAnimationFrame(() => {
            inputRef.current?.focus();
          });
        }}
      />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxCollection>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {labelByValue.get(item) ?? item}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
