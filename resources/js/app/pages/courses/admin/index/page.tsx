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
import type { Course } from '@/modules/courses/core/types';
import { COURSES_NAMESPACES, useCoursesTranslation } from '@/modules/courses/i18n';
import { CourseOverlay } from '@/modules/courses/ui/CourseOverlay';
import { CoursesHeader } from '@/modules/courses/ui/CoursesHeader';
import { CoursesTable } from '@/modules/courses/ui/table/CoursesTable';
import React from 'react';

interface CoursesIndexProps {
  courses: TablePaginated<Course>;
  filters: {
    per_page?: number | null;
    search?: string | null;
    institution?: string | null;
    status?: string | null;
    visibility?: string | null;
    sort?: string | null;
    direction?: string | null;
  };
}

const COURSE_PER_PAGE_OPTIONS = [15, 30, 50] as const;
const COURSE_SORTABLE_COLUMNS = {
  name: true,
  institution: true,
  started_at: true,
  completed_at: true,
  status: true,
  display: true,
} as const;

export default function Index({ courses, filters }: CoursesIndexProps) {
  const { translate: tActions } = useCoursesTranslation(
    COURSES_NAMESPACES.actions,
  );
  const { translate: tSections } = useCoursesTranslation(
    COURSES_NAMESPACES.sections,
  );
  const { translate: tForm } = useCoursesTranslation(COURSES_NAMESPACES.form);
  const currentSearch =
    typeof filters.search === 'string' ? filters.search : '';
  const currentInstitution =
    typeof filters.institution === 'string' ? filters.institution : '';
  const currentStatus =
    typeof filters.status === 'string' ? filters.status : '';
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
      : courses.per_page;
  const [search, setSearch] = React.useState(currentSearch);
  const [institution, setInstitution] = React.useState(currentInstitution);
  const [status, setStatus] = React.useState(currentStatus);
  const [visibility, setVisibility] = React.useState(currentVisibility);

  // State for the overlay
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(
    null,
  );
  const [isOverlayOpen, setIsOverlayOpen] = React.useState(false);

  /**
   * Opens the course details overlay.
   */
  const handleRowClick = (course: Course) => {
    setSelectedCourse(course);
    setIsOverlayOpen(true);
  };

  /**
   * Closes the course details overlay.
   */
  const handleOverlayOpenChange = (open: boolean) => {
    setIsOverlayOpen(open);
    if (!open) {
      // Short delay to allow animation to finish before clearing data
      setTimeout(() => setSelectedCourse(null), 200);
    }
  };

  const handlePageChange = (page: number): void => {
    pageRouter.get(
      route('courses.index'),
      setTablePageInQueryParams(
        buildCoursesIndexQueryParams({
          search: currentSearch,
          institution: currentInstitution,
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
      route('courses.index'),
      setTablePerPageInQueryParams(
        buildCoursesIndexQueryParams({
          search: currentSearch,
          institution: currentInstitution,
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
      route('courses.index'),
      setTableSortInQueryParams(
        serializeTableQueryParams({
          per_page: currentPerPage,
          search: currentSearch,
          institution: currentInstitution,
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

    applyFilters({
      search,
      institution,
      status,
      visibility,
    });
  };

  const handleStatusChange = (nextStatus: string): void => {
    setStatus(nextStatus);

    applyFilters({
      search,
      institution,
      status: nextStatus,
      visibility,
    });
  };

  const handleVisibilityChange = (nextVisibility: string): void => {
    setVisibility(nextVisibility);

    applyFilters({
      search,
      institution,
      status,
      visibility: nextVisibility,
    });
  };

  const applyFilters = ({
    search,
    institution,
    status,
    visibility,
  }: {
    search: string;
    institution: string;
    status: string;
    visibility: string;
  }): void => {
    pageRouter.get(
      route('courses.index'),
      buildCoursesIndexQueryParams({
        search,
        institution,
        status,
        visibility,
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
    setSearch('');
    setInstitution('');
    setStatus('');
    setVisibility('');

    pageRouter.get(
      route('courses.index'),
      buildCoursesIndexQueryParams({
        search: '',
        institution: '',
        status: '',
        visibility: '',
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

      <PageContent className="overflow-hidden py-8" pageWidth="container">
        <CoursesHeader />

        <CoursesTable
          courses={courses}
          onRowClick={handleRowClick}
          header={
            <TableToolbar className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <form
                className="flex w-full flex-col gap-3 md:flex-row md:items-center"
                onSubmit={handleSearchSubmit}
              >
                <TableSearchField
                  className="w-full md:max-w-md"
                  aria-label={tForm('filters.searchLabel')}
                  value={search}
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  placeholder={tForm('filters.searchPlaceholder')}
                  buttonLabel={tForm('filters.searchSubmit')}
                />

                <input
                  aria-label={tForm('filters.institutionLabel')}
                  className="border-input bg-background ring-offset-background focus-visible:ring-ring placeholder:text-muted-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:max-w-xs"
                  value={institution}
                  onChange={(event) => setInstitution(event.currentTarget.value)}
                  placeholder={tForm('filters.institutionPlaceholder')}
                />

                <select
                  aria-label={tForm('filters.statusLabel')}
                  className="border-input bg-background ring-offset-background focus-visible:ring-ring placeholder:text-muted-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:max-w-xs"
                  value={status}
                  onChange={(event) => handleStatusChange(event.currentTarget.value)}
                >
                  <option value="">{tForm('filters.statusPlaceholder')}</option>
                  <option value="planned">{tForm('status.planned')}</option>
                  <option value="in_progress">{tForm('status.in_progress')}</option>
                  <option value="completed">{tForm('status.completed')}</option>
                </select>

                <select
                  aria-label={tForm('filters.visibilityLabel')}
                  className="border-input bg-background ring-offset-background focus-visible:ring-ring placeholder:text-muted-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:max-w-xs"
                  value={visibility}
                  onChange={(event) => handleVisibilityChange(event.currentTarget.value)}
                >
                  <option value="">{tForm('filters.visibilityPlaceholder')}</option>
                  <option value="public">{tForm('filters.publicOnly')}</option>
                  <option value="private">{tForm('filters.privateOnly')}</option>
                </select>
              </form>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {currentSearch !== '' ||
                currentInstitution !== '' ||
                currentStatus !== '' ||
                currentVisibility !== '' ? (
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
                  href={route('courses.create')}
                  label={tActions('newCourse')}
                />
              </div>
            </TableToolbar>
          }
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSortChange={handleSortChange}
          perPageOptions={COURSE_PER_PAGE_OPTIONS}
          sort={sortState}
          sortableColumns={COURSE_SORTABLE_COLUMNS}
        />
      </PageContent>

      <CourseOverlay
        open={isOverlayOpen}
        course={selectedCourse}
        onOpenChange={handleOverlayOpenChange}
      />
    </AuthenticatedLayout>
  );
}

Index.i18n = ['courses'];

function buildCoursesIndexQueryParams({
  search,
  institution,
  status,
  visibility,
  perPage,
  sort,
}: {
  search: string;
  institution: string;
  status: string;
  visibility: string;
  perPage?: number;
  sort: TableSortState;
}): Record<string, string> {
  return setTableSortInQueryParams(
    serializeTableQueryParams({
      search,
      institution,
      status,
      visibility,
      per_page: perPage,
    }),
    sort,
  );
}
