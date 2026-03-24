import { TableSearchField, TableToolbar } from '@/common/table';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';
import { FilterX } from 'lucide-react';
import type { ReactNode } from 'react';
import React from 'react';
import { DEFAULT_PAGE_LIST_FILTERS, type PageListFilters } from './';
import {
  PAGE_LOCALE_FILTER_ALL,
  PAGE_STATUS_FILTER_OPTIONS,
} from './constants';

interface PageFiltersProps {
  /**
   * Initial filter values for the UI.
   *
   * Consumers typically pass a normalized value (see `normalizePageListFilters`)
   * so the component can remain purely controlled by its own local state.
   */
  initialFilters: PageListFilters;
  availableLocales?: string[];
  actions?: ReactNode;
  /**
   * Called when the user applies, changes, or resets filters.
   *
   * This component does not perform navigation; the consumer decides how to
   * persist filters (e.g. update URL, refetch data, Inertia router.get, etc).
   */
  onApply: (filters: PageListFilters) => void;
}

/**
 * Reusable filter row for page listing screens.
 */
export function PageFilters({
  initialFilters,
  availableLocales = [],
  actions,
  onApply,
}: PageFiltersProps) {
  const { translate: tPages } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.pages,
  );
  const { translate: tActions } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.actions,
  );
  const [status, setStatus] = React.useState<PageListFilters['status']>(
    initialFilters.status,
  );
  const [locale, setLocale] = React.useState<PageListFilters['locale']>(
    initialFilters.locale,
  );
  const [search, setSearch] = React.useState<PageListFilters['search']>(
    initialFilters.search,
  );

  React.useEffect(() => {
    setStatus(initialFilters.status);
    setLocale(initialFilters.locale);
    setSearch(initialFilters.search);
  }, [initialFilters.locale, initialFilters.search, initialFilters.status]);

  const applyFilters = (next: PageListFilters): void => {
    onApply(next);
  };

  const handleStatusChange = (value: string): void => {
    const nextStatus = value as PageListFilters['status'];
    setStatus(nextStatus);
    applyFilters({
      perPage: initialFilters.perPage,
      status: nextStatus,
      locale,
      search,
      sort: initialFilters.sort,
      direction: initialFilters.direction,
    });
  };

  const handleLocaleChange = (value: string): void => {
    setLocale(value);
    applyFilters({
      perPage: initialFilters.perPage,
      status,
      locale: value,
      search,
      sort: initialFilters.sort,
      direction: initialFilters.direction,
    });
  };

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    applyFilters({
      perPage: initialFilters.perPage,
      status,
      locale,
      search,
      sort: initialFilters.sort,
      direction: initialFilters.direction,
    });
  };

  const handleReset = (): void => {
    setStatus(DEFAULT_PAGE_LIST_FILTERS.status);
    setLocale(DEFAULT_PAGE_LIST_FILTERS.locale);
    setSearch(DEFAULT_PAGE_LIST_FILTERS.search);
    applyFilters({
      ...DEFAULT_PAGE_LIST_FILTERS,
      perPage: initialFilters.perPage,
      sort: initialFilters.sort,
      direction: initialFilters.direction,
    });
  };

  return (
    <TableToolbar asChild>
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-end gap-3"
      >
        <div className="w-full sm:w-auto sm:min-w-[18rem] sm:flex-1">
          <Label htmlFor="page-search">
            {tPages('filters.search', 'Search')}
          </Label>
          <TableSearchField
            id="page-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={tPages(
              'filters.searchPlaceholder',
              'Filter by title, internal name, or slug',
            )}
            buttonLabel={tPages('filters.submitSearch', 'Search pages')}
            className="mt-1"
          />
        </div>

        <div className="w-full sm:w-[11rem]">
          <Label htmlFor="page-status">
            {tPages('filters.status', 'Status')}
          </Label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger id="page-status" className="mt-1 h-9">
              <SelectValue
                placeholder={tPages('filters.allStatuses', 'All statuses')}
              />
            </SelectTrigger>
            <SelectContent>
              {PAGE_STATUS_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.value === 'all'
                    ? tPages('filters.allStatuses', 'All statuses')
                    : option.value === 'draft'
                      ? tPages('filters.draft', 'Draft')
                      : option.value === 'published'
                        ? tPages('filters.published', 'Published')
                        : tPages('filters.archived', 'Archived')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-[10rem]">
          <Label htmlFor="page-locale">
            {tPages('filters.locale', 'Locale')}
          </Label>
          <Select value={locale} onValueChange={handleLocaleChange}>
            <SelectTrigger id="page-locale" className="mt-1 h-9">
              <SelectValue
                placeholder={tPages('filters.allLocales', 'All locales')}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PAGE_LOCALE_FILTER_ALL}>
                {tPages('filters.allLocales', 'All locales')}
              </SelectItem>

              {availableLocales.map((availableLocale) => (
                <SelectItem key={availableLocale} value={availableLocale}>
                  {availableLocale}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant="ghost"
          className="gap-2"
          onClick={handleReset}
        >
          <FilterX className="h-4 w-4" />
          {tActions('reset', 'Reset')}
        </Button>

        {actions}
      </form>
    </TableToolbar>
  );
}
