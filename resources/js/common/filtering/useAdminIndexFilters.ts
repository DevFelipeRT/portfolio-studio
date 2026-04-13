import { pageRouter } from '@/common/page-runtime';
import {
  setTablePageInQueryParams,
  setTablePerPageInQueryParams,
  setTableSortInQueryParams,
  toggleTableSortState,
  type TableSortState,
} from '@/common/table';
import { useEffect, useRef, useState, type FormEvent } from 'react';

export type AdminIndexFilterDefinition<
  TRawFilters,
  TValue,
> = {
  fromRawFilters: (rawFilters: TRawFilters) => TValue;
  emptyValue: TValue;
  isApplied(value: TValue): boolean;
};

type AdminIndexFilterDefinitions<TRawFilters> = Record<
  string,
  AdminIndexFilterDefinition<TRawFilters, unknown>
>;

type InferAdminIndexFilterValues<
  TRawFilters,
  TDefinitions extends AdminIndexFilterDefinitions<TRawFilters>,
> = {
  [TKey in keyof TDefinitions]: TDefinitions[TKey] extends AdminIndexFilterDefinition<
    TRawFilters,
    infer TValue
  >
    ? TValue
    : never;
};

type UseAdminIndexFiltersParams<
  TRawFilters,
  TDefinitions extends AdminIndexFilterDefinitions<TRawFilters>,
> = {
  routeName: string;
  rawFilters: TRawFilters;
  syncKey: string;
  defaultPerPage: number;
  filterDefinitions: TDefinitions;
  resolvePerPage: (
    rawFilters: TRawFilters,
    defaultPerPage: number,
  ) => number;
  resolveSortState: (rawFilters: TRawFilters) => TableSortState;
  buildQueryParams: (args: {
    filters: InferAdminIndexFilterValues<TRawFilters, TDefinitions>;
    perPage?: number;
    sort: TableSortState;
  }) => Record<string, string>;
};

function parseAdminIndexFilters<
  TRawFilters,
  TDefinitions extends AdminIndexFilterDefinitions<TRawFilters>,
>(
  rawFilters: TRawFilters,
  filterDefinitions: TDefinitions,
): InferAdminIndexFilterValues<TRawFilters, TDefinitions> {
  return Object.fromEntries(
    Object.entries(filterDefinitions).map(([key, definition]) => [
      key,
      definition.fromRawFilters(rawFilters),
    ]),
  ) as InferAdminIndexFilterValues<TRawFilters, TDefinitions>;
}

function createEmptyAdminIndexFilters<
  TRawFilters,
  TDefinitions extends AdminIndexFilterDefinitions<TRawFilters>,
>(
  filterDefinitions: TDefinitions,
): InferAdminIndexFilterValues<TRawFilters, TDefinitions> {
  return Object.fromEntries(
    Object.entries(filterDefinitions).map(([key, definition]) => [
      key,
      definition.emptyValue,
    ]),
  ) as InferAdminIndexFilterValues<TRawFilters, TDefinitions>;
}

function hasAppliedAdminIndexFilters<
  TRawFilters,
  TDefinitions extends AdminIndexFilterDefinitions<TRawFilters>,
>(
  appliedFilters: InferAdminIndexFilterValues<TRawFilters, TDefinitions>,
  filterDefinitions: TDefinitions,
): boolean {
  return Object.entries(filterDefinitions).some(([key, definition]) =>
    definition.isApplied(
      appliedFilters[
        key as keyof InferAdminIndexFilterValues<TRawFilters, TDefinitions>
      ],
    ),
  );
}

export function stringAdminIndexFilter<TRawFilters>(
  readValue: (rawFilters: TRawFilters) => unknown,
): AdminIndexFilterDefinition<TRawFilters, string> {
  return {
    fromRawFilters: (rawFilters) => {
      const value = readValue(rawFilters);

      return typeof value === 'string' ? value : '';
    },
    emptyValue: '',
    isApplied: (value) => value !== '',
  };
}

export function customAdminIndexFilter<TRawFilters, TValue>(options: {
  fromRawFilters: (rawFilters: TRawFilters) => TValue;
  emptyValue: TValue;
  isApplied: (value: TValue) => boolean;
}): AdminIndexFilterDefinition<TRawFilters, TValue> {
  return options;
}

/**
 * Provides the shared applied-vs-draft query state used by admin index pages.
 * Consumers describe the filter fields declaratively and keep module-specific
 * concerns focused on routing, rendering, and domain actions.
 */
export function useAdminIndexFilters<
  TRawFilters,
  TDefinitions extends AdminIndexFilterDefinitions<TRawFilters>,
>({
  routeName,
  rawFilters,
  syncKey,
  defaultPerPage,
  filterDefinitions,
  resolvePerPage,
  resolveSortState,
  buildQueryParams,
}: UseAdminIndexFiltersParams<TRawFilters, TDefinitions>) {
  /**
   * `appliedFilters` always reflects the canonical query state coming from the
   * current page props, while `draftFilters` represents in-progress UI edits.
   */
  const appliedFilters = parseAdminIndexFilters(rawFilters, filterDefinitions);
  const sortState = resolveSortState(rawFilters);
  const currentPerPage = resolvePerPage(rawFilters, defaultPerPage);
  const emptyDraftFilters = createEmptyAdminIndexFilters<
    TRawFilters,
    TDefinitions
  >(filterDefinitions);
  const [draftFilters, setDraftFilters] = useState<
    InferAdminIndexFilterValues<TRawFilters, TDefinitions>
  >(() => ({ ...appliedFilters }));
  const appliedFiltersRef = useRef<
    InferAdminIndexFilterValues<TRawFilters, TDefinitions>
  >(appliedFilters);
  const emptyDraftFiltersRef = useRef<
    InferAdminIndexFilterValues<TRawFilters, TDefinitions>
  >(emptyDraftFilters);
  const draftFiltersRef = useRef<
    InferAdminIndexFilterValues<TRawFilters, TDefinitions>
  >(draftFilters);

  appliedFiltersRef.current = appliedFilters;
  emptyDraftFiltersRef.current = emptyDraftFilters;
  draftFiltersRef.current = draftFilters;

  useEffect(() => {
    /**
     * Re-align the local draft after any navigation that changes the page URL.
     * This keeps the visible form in sync with the currently applied query.
     */
    const nextDraftFilters = { ...appliedFiltersRef.current };

    draftFiltersRef.current = nextDraftFilters;
    setDraftFilters(nextDraftFilters);
  }, [syncKey]);

  /**
   * Performs the canonical Inertia visit for index-query updates while
   * preserving local component state outside the filter draft itself.
   */
  const visit = (
    queryParams: Record<string, string>,
    options?: {
      replace?: boolean;
    },
  ): void => {
    pageRouter.get(route(routeName), queryParams, {
      preserveScroll: true,
      preserveState: true,
      replace: options?.replace ?? false,
    });
  };

  const applyDraftFilters = (
    nextDraftFilters: InferAdminIndexFilterValues<TRawFilters, TDefinitions>,
    options?: {
      replace?: boolean;
    },
  ): void => {
    draftFiltersRef.current = nextDraftFilters;
    setDraftFilters(nextDraftFilters);

    visit(
      buildQueryParams({
        filters: nextDraftFilters,
        perPage: currentPerPage,
        sort: sortState,
      }),
      {
        replace: options?.replace ?? true,
      },
    );
  };

  const applyPartialDraftFilters = (
    partialDraftFilters: Partial<
      InferAdminIndexFilterValues<TRawFilters, TDefinitions>
    >,
    options?: {
      replace?: boolean;
    },
  ): void => {
    applyDraftFilters(
      {
        ...draftFiltersRef.current,
        ...partialDraftFilters,
      } as InferAdminIndexFilterValues<TRawFilters, TDefinitions>,
      options,
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    applyDraftFilters(draftFiltersRef.current);
  };

  const handleReset = (): void => {
    applyDraftFilters(emptyDraftFiltersRef.current);
  };

  const handlePageChange = (page: number): void => {
    visit(
      setTablePageInQueryParams(
        buildQueryParams({
          filters: appliedFilters,
          perPage: currentPerPage,
          sort: sortState,
        }),
        page,
      ),
    );
  };

  const handlePerPageChange = (perPage: number): void => {
    visit(
      setTablePerPageInQueryParams(
        buildQueryParams({
          filters: appliedFilters,
          sort: sortState,
        }),
        perPage,
      ),
      {
        replace: true,
      },
    );
  };

  const handleSortChange = (column: string): void => {
    visit(
      setTableSortInQueryParams(
        buildQueryParams({
          filters: appliedFilters,
          perPage: currentPerPage,
          sort: sortState,
        }),
        toggleTableSortState(sortState, column),
      ),
      {
        replace: true,
      },
    );
  };

  const setDraftValue = <
    TKey extends keyof InferAdminIndexFilterValues<TRawFilters, TDefinitions>,
  >(
    key: TKey,
    value: InferAdminIndexFilterValues<TRawFilters, TDefinitions>[TKey],
  ): void => {
    const nextDraftFilters = {
      ...draftFiltersRef.current,
      [key]: value,
    } as InferAdminIndexFilterValues<TRawFilters, TDefinitions>;

    draftFiltersRef.current = nextDraftFilters;
    setDraftFilters(nextDraftFilters);
  };

  return {
    appliedFilters,
    draftFilters,
    sortState,
    currentPerPage,
    hasAppliedFilters: hasAppliedAdminIndexFilters(
      appliedFilters,
      filterDefinitions,
    ),
    setDraftFilters,
    setDraftValue,
    applyDraftFilters,
    applyPartialDraftFilters,
    handleSubmit,
    handleReset,
    handlePageChange,
    handlePerPageChange,
    handleSortChange,
  };
}
